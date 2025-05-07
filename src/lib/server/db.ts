import { DB_AUTH_TOKEN, DB_URL } from '$env/static/private'
import { createClient, type LibsqlError } from '@libsql/client'

export const db = createClient({
	url: DB_URL,
	authToken: DB_AUTH_TOKEN
})

db.execute('PRAGMA foreign_keys = ON')

/**
 * Small wrapper around the `db.execute` function from `@libsql/client` to handle errors.
 */
export async function query<T = any>(
	sql: string,
	args?: Record<string, any> | any[]
): Promise<{ rows: T[]; err: null } | { rows: null; err: LibsqlError }> {
	try {
		const res = args ? await db.execute(sql, args) : await db.execute(sql)
		return { rows: res.rows as T[], err: null }
	} catch (err) {
		console.error(err)
		return { rows: null, err: err as LibsqlError }
	}
}

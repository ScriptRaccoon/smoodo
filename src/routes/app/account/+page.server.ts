import { error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const user_query = `SELECT username FROM users WHERE id = ?`
	const args = [user.id]

	const { rows, err } = await query<{ username: string }>(user_query, args)

	if (err) {
		error(500, 'Database error.')
	}

	if (!rows.length) {
		error(404, 'User not found.')
	}

	const { username } = rows[0]

	return { username }
}

export const actions: Actions = {
	delete_account: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const delete_query = `DELETE FROM users WHERE id = ?`
		const args = [user.id]

		const { err } = await query(delete_query, args)

		if (err) {
			return { success: false, error: 'Database error.' }
		}

		event.cookies.delete('jwt', { path: '/' })

		redirect(302, '/')
	}
}

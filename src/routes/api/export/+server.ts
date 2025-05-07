import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const export_query = `
        SELECT
            value, date, comment
        FROM
            moods
        WHERE
            user_id = ?
        ORDER BY date ASC
    `

	const args = [user.id]

	const { rows: moods, err } = await query(export_query, args)

	if (err) {
		return error(500, 'Database error.')
	}

	return json({ export_date: new Date(), moods })
}

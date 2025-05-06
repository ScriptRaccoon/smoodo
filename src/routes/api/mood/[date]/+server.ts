import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { Mood } from '$lib/server/types'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')
	const date = event.params.date

	const mood_query = `
    SELECT
        id, value, comment
    FROM
		moods
    WHERE
		user_id = ? AND date = ?
    `

	const args = [user.id, date]

	const { rows, err } = await query<Mood>(mood_query, args)

	if (err) {
		return error(500, 'Database error.')
	}

	if (!rows.length) {
		return json({ mood: null })
	}

	return json({ mood: rows[0] })
}

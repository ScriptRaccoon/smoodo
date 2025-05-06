import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'
import type { MoodBox } from '$lib/server/types'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) return error(401, 'Unauthorized')

	const mood_query = `
    SELECT
        id, value, date
    FROM
        moods
    WHERE
        user_id = ?
    ORDER BY date DESC
    `

	const args = [user.id]

	const { rows, err } = await query<MoodBox>(mood_query, args)

	if (err) {
		return error(500, 'Database error.')
	}

	return json({ moods: rows })
}

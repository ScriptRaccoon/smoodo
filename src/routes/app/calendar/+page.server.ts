import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { get_month_info, group_by } from '$lib/utils'
import type { Mood } from '$lib/server/types'
import { query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const moods_query = `
	SELECT
		id, value, date, comment
	FROM
		moods
	WHERE
		user_id = ?
	ORDER BY date ASC
	`
	const args = [user.id]

	const { rows: moods, err } = await query<Mood>(moods_query, args)

	if (err) {
		return error(500, 'Database error.')
	}

	const moods_dictionary = group_by(moods, 'date')

	const month_strings = Array.from(
		new Set(moods.map((mood) => mood.date.substring(0, 7)))
	).toSorted()

	const months = month_strings.map(get_month_info)

	return { moods_dictionary, months }
}

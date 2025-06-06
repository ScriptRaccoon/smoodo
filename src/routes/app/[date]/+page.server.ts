import { comment_max_length, date_regex } from '$lib/server/config'
import { query } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'
import { error, fail } from '@sveltejs/kit'
import type { Mood } from '$lib/server/types'
import { add_days } from '$lib/utils'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const date = event.params.date

	if (!date_regex.test(date)) {
		return error(400, 'Invalid date format.')
	}

	const date_display = new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(new Date(date))

	const mood_query = `
    SELECT
        id, value, date, comment
    FROM
		moods
    WHERE
		user_id = ? AND date = ?
    `
	const args = [user.id, date]

	const { rows: moods, err } = await query<Mood>(mood_query, args)

	if (err) {
		return error(500, 'Database error.')
	}

	const mood = moods.length ? moods[0] : null

	const next_date = add_days(date, 1)
	const prev_date = add_days(date, -1)

	return { mood, date_display, date, next_date, prev_date }
}

export const actions: Actions = {
	save: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date
		const form_data = await event.request.formData()

		const mood_value = parseInt(form_data.get('mood') as string)
		const comment = form_data.get('comment') as string

		const is_valid_mood = mood_value >= 1 && mood_value <= 5

		if (!is_valid_mood) {
			return fail(400, {
				success: false,
				error: 'Mood value must be between 1 and 5.',
				mood_value,
				comment: null
			})
		}

		if (comment.length > comment_max_length) {
			return fail(400, {
				success: false,
				error: `Comment must be at most ${comment_max_length} characters long.`,
				mood_value,
				comment
			})
		}

		const mood_query = `
        INSERT INTO
			moods (user_id, value, date, comment)
        VALUES
			(?, ?, ?, ?)
        ON CONFLICT (user_id, date) DO UPDATE SET
        	value = excluded.value,
        	comment = excluded.comment
		`
		const args = [user.id, mood_value, date, comment || null]

		const { err } = await query(mood_query, args)

		if (err) {
			return fail(500, {
				success: false,
				error: 'Database error.',
				mood_value,
				comment
			})
		}

		return { success: true, message: 'Mood has been saved' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date

		const delete_query = 'DELETE FROM moods WHERE user_id = ? AND date = ?'
		const args = [user.id, date]

		const { err } = await query(delete_query, args)

		if (err) {
			return fail(500, { success: false, error: 'Database error.' })
		}

		return { success: true, message: 'Mood has been deleted' }
	}
}

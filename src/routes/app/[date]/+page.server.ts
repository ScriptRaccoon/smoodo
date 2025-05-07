import { comment_max_length, date_regex } from '$lib/server/config'
import { query } from '$lib/server/db'
import { format } from 'date-fns'
import type { Actions, PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import type { Mood } from '$lib/server/types'

export const load: PageServerLoad = async (event) => {
	const date = event.params.date

	if (!date_regex.test(date)) {
		return error(400, 'Invalid date format.')
	}

	const date_display = format(new Date(date), 'EEEE dd MMMM yyyy')

	const res = await event.fetch(`/api/mood/${date}`)
	if (!res.ok) error(500, 'API error.')

	const { mood } = await res.json()

	return { mood: mood as Mood | null, date, date_display }
}

export const actions: Actions = {
	save: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date
		const form_data = await event.request.formData()

		const mood_value = parseInt(form_data.get('mood') as string)

		const comment = form_data.get('comment') as string

		if (comment.length > comment_max_length) {
			return {
				success: false,
				error: `Comment must be at most ${comment_max_length} characters long.`,
				mood_value,
				comment
			}
		}

		const mood_query = `
        INSERT INTO moods (user_id, value, date, comment)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (user_id, date) DO UPDATE SET
        value = excluded.value,
        comment = excluded.comment`

		const args = [user.id, mood_value, date, comment || null]
		const { err } = await query(mood_query, args)

		if (err) {
			return { success: false, error: 'Database error.', mood_value, comment }
		}

		return { success: true, message: 'Mood has been saved' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const date = event.params.date

		const mood_query = `DELETE FROM moods WHERE user_id = ? AND date = ?`

		const args = [user.id, date]
		const { err } = await query(mood_query, args)

		if (err) {
			return { success: false, error: 'Database error.' }
		}

		return { success: true, message: 'Mood has been deleted' }
	}
}

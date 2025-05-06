import { comment_max_length } from '$lib/server/config'
import { query } from '$lib/server/db'
import { format } from 'date-fns'
import type { Actions, PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import type { Mood } from '$lib/server/types'

export const load: PageServerLoad = async (event) => {
	const now = new Date()
	const date = format(now, 'yyyy-MM-dd')
	const date_display = format(now, 'EEEE dd MMMM yyyy')

	const res = await event.fetch(`/api/mood/${date}`)
	if (!res.ok) error(500, 'API error.')
	const { mood } = await res.json()

	return { mood: mood as Mood | null, date, date_display }
}

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()

		const mood_value = form_data.get('mood') as string
		const date = form_data.get('date') as string
		const comment = form_data.get('comment') as string

		if (comment.length > comment_max_length) {
			return {
				success: false,
				error: `Comment must be at most ${comment_max_length} characters long.`
			}
		}

		const mood_query = `
        INSERT INTO moods (user_id, value, date, comment)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (user_id, date) DO UPDATE SET
        value = excluded.value,
        comment = excluded.comment`

		const args = [user.id, parseInt(mood_value), date, comment || null]
		const { err } = await query(mood_query, args)

		if (err) {
			return { success: false, error: 'Database error.' }
		}

		return { success: true }
	}
}

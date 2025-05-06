import { query } from '$lib/server/db'
import type { Actions } from './$types'

import { error } from '@sveltejs/kit'

const comment_max_length = 1000

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()

		const mood = form_data.get('mood') as string
		const date = form_data.get('date') as string
		const comment = form_data.get('comment') as string

		if (comment.length > comment_max_length) {
			return {
				success: false,
				error: `Comment must be at most ${comment_max_length} characters long.`
			}
		}

		const mood_query = `
        INSERT INTO moods (user_id, mood, date, comment)
        VALUES (?, ?, ?, ?)
        ON CONFLICT (user_id, date) DO UPDATE SET
        mood = excluded.mood,
        comment = excluded.comment
        `

		const args = [user.id, parseInt(mood), date, comment || null]
		const { err } = await query(mood_query, args)

		if (err) {
			return { success: false, error: 'Database error.' }
		}

		return { success: true }
	}
}

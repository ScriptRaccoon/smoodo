import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { MoodBox } from '$lib/server/types'
import { get_month_info, group_by } from '$lib/server/utils'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const res = await event.fetch('/api/mood')
	if (!res.ok) error(500, 'API error.')

	const data = await res.json()
	const mood_list = data.moods as MoodBox[]

	const moods = group_by(mood_list, 'date')

	const month_strings = Array.from(
		new Set(mood_list.map((mood) => mood.date.substring(0, 7)))
	).toSorted()

	const months = month_strings.map(get_month_info)

	return { moods, months }
}

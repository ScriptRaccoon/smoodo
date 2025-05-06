import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { MoodBox } from '$lib/server/types'
import { group_by } from '$lib/server/utils'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const res = await event.fetch('/api/mood')
	if (!res.ok) error(500, 'API error.')

	const data = await res.json()
	const moods = data.moods as MoodBox[]

	const moods_dictionary = group_by(moods, 'date')

	return { moods_dictionary }
}

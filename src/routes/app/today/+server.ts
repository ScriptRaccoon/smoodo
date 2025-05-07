import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { format_date } from '$lib/utils'

export const GET: RequestHandler = async () => {
	const date = format_date(new Date())
	redirect(302, `/app/${date}`)
}

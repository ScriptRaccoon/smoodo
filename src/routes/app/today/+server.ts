import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async (event) => {
	const now = new Date()
	const date = now.toISOString().split('T')[0] // YYYY-MM-DD format
	redirect(302, `/app/${date}`)
}

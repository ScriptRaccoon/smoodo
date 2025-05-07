import { JWT_SECRET } from '$env/static/private'
import type { UserLocals } from '$lib/server/types'
import { redirect, type Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

function is_valid_locals(obj: unknown): obj is UserLocals {
	return (
		typeof obj === 'object' &&
		obj !== null &&
		'id' in obj &&
		typeof obj.id === 'number'
	)
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt')
	if (token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET)
			if (is_valid_locals(decoded)) {
				event.locals.user = decoded
			} else {
				console.error('Invalid JWT payload')
			}
		} catch {
			console.error('JWT verification failed')
		}
	}

	const path = event.url.pathname
	const is_protected = path.startsWith('/app') || path.startsWith('/api')

	if (is_protected && !event.locals.user) {
		redirect(302, '/login')
	}

	return await resolve(event)
}

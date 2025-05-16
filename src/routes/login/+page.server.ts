import { query } from '$lib/server/db'
import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import { fail, redirect } from '@sveltejs/kit'
import { RateLimiter } from '$lib/server/ratelimit'

// allow 10 login attempts per minute
const login_rate_limiter = new RateLimiter(10, 60 * 1000)

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const username = form_data.get('username') as string
		const password = form_data.get('password') as string

		const ip = event.getClientAddress()
		if (login_rate_limiter.is_rate_limited(ip)) {
			return fail(429, {
				success: false,
				error: 'Too many login attempts. Please try again later.',
				username
			})
		}

		const user_query = 'SELECT id, password_hash FROM users WHERE username = ?'

		const { rows, err } = await query<{ id: Number; password_hash: string }>(
			user_query,
			[username]
		)

		if (err) {
			return fail(500, { success: false, error: 'Database error.', username })
		}

		if (!rows.length) {
			return fail(400, {
				success: false,
				error: 'Invalid username or password.',
				username
			})
		}

		const { id, password_hash } = rows[0]

		const password_match = await bcrypt.compare(password, password_hash)

		if (!password_match) {
			return fail(400, {
				success: false,
				error: 'Invalid username or password.',
				username
			})
		}

		const token = jwt.sign({ id }, JWT_SECRET)

		event.cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 60 * 60 * 24 * 7 // 1 week
		})

		await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id])

		login_rate_limiter.reset(ip)

		redirect(302, '/app/calendar')
	}
}

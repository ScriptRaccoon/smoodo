import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import { query } from '$lib/server/db'
import { password_min_length, password_regex, username_regex } from '$lib/server/config'
import { fail } from '@sveltejs/kit'
import { RateLimiter } from '$lib/server/ratelimit'

// allow 10 register attempts per minute
const register_rate_limiter = new RateLimiter(10, 60 * 1000)

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const username = form_data.get('username') as string
		const password = form_data.get('password') as string
		const password_repeat = form_data.get('repeat_password') as string

		const ip = event.getClientAddress()
		if (register_rate_limiter.is_rate_limited(ip)) {
			return fail(429, {
				success: false,
				error: 'Too many registration attempts. Please try again later.',
				username
			})
		}

		if (!username) {
			return fail(400, { success: false, error: 'Username is required.', username })
		}

		if (!username_regex.test(username)) {
			return fail(400, {
				success: false,
				error: 'Username can only contain letters, numbers, and underscores.',
				username
			})
		}

		if (!password) {
			return fail(400, { success: false, error: 'Password is required.', username })
		}

		if (password.length < password_min_length) {
			return fail(400, {
				success: false,
				error: `Password must be at least ${password_min_length} characters long.`,
				username
			})
		}

		if (!password_regex.test(password)) {
			return fail(400, {
				success: false,
				error: 'Password must contain at least one letter and one number.',
				username
			})
		}

		if (password !== password_repeat) {
			return fail(400, {
				success: false,
				error: 'Passwords do not match.',
				username
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const insert_query = 'INSERT INTO users (username, password_hash) VALUES (?,?)'

		const { err } = await query(insert_query, [username, password_hash])

		if (err) {
			const username_taken = err.code === 'SQLITE_CONSTRAINT_UNIQUE'
			return username_taken
				? fail(400, {
						success: false,
						error: 'Username already exists.',
						username
					})
				: fail(500, { success: false, error: 'Database error.', username })
		}

		register_rate_limiter.reset(ip)

		return { success: true, username }
	}
}

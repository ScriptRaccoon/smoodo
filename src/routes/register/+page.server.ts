import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import { query } from '$lib/server/db'
import { password_min_length, password_regex, username_regex } from '$lib/server/config'

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const username = form_data.get('username') as string
		const password = form_data.get('password') as string

		if (!username) {
			return { success: false, error: 'Username is required.', username }
		}

		if (!password) {
			return { success: false, error: 'Password is required.', username }
		}

		if (!username_regex.test(username)) {
			return {
				success: false,
				error: 'Username can only contain letters, numbers, and underscores.',
				username
			}
		}

		if (password.length < password_min_length) {
			return {
				success: false,
				error: `Password must be at least ${password_min_length} characters long.`,
				username
			}
		}

		if (!password_regex.test(password)) {
			return {
				success: false,
				error: 'Password must contain at least one letter and one number.',
				username
			}
		}

		const password_hash = await bcrypt.hash(password, 10)

		const insert_query = `INSERT INTO users (username, password_hash) VALUES (?,?)`

		const { err } = await query(insert_query, [username, password_hash])

		if (err) {
			const username_taken = err.code === 'SQLITE_CONSTRAINT_UNIQUE'
			return username_taken
				? { success: false, error: 'Username already exists.', username }
				: { success: false, error: 'Database error.', username }
		}

		return { success: true, username }
	}
}

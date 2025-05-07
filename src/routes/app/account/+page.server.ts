import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import { password_min_length, password_regex, username_regex } from '$lib/server/config'
import bcrypt from 'bcryptjs'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const user_query = `SELECT username FROM users WHERE id = ?`
	const args = [user.id]

	const { rows, err } = await query<{ username: string }>(user_query, args)

	if (err) {
		error(500, 'Database error.')
	}

	if (!rows.length) {
		error(404, 'User not found.')
	}

	const { username } = rows[0]

	return { username }
}

export const actions: Actions = {
	rename: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const formData = await event.request.formData()
		const username = formData.get('username')?.toString()

		if (!username) {
			return fail(400, {
				action: 'rename',
				success: false,
				error: 'Username is required.'
			})
		}

		if (!username_regex.test(username)) {
			return fail(400, {
				action: 'rename',
				success: false,
				error: 'Username can only contain letters, numbers, and underscores.'
			})
		}

		const update_query = `UPDATE users SET username = ? WHERE id = ?`
		const args = [username, user.id]

		const { err } = await query(update_query, args)

		if (err) {
			const username_taken = err.code === 'SQLITE_CONSTRAINT_UNIQUE'
			return username_taken
				? fail(400, {
						action: 'rename',
						success: false,
						error: 'Username already taken.'
					})
				: fail(500, {
						action: 'rename',
						success: false,
						error: 'Database error.'
					})
		}

		return { success: true }
	},

	password: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()
		const password = form_data.get('password') as string
		const password_repeat = form_data.get('repeat_password') as string

		if (!password) {
			return fail(400, {
				action: 'password',
				success: false,
				error: 'Password is required.'
			})
		}

		if (password.length < password_min_length) {
			return fail(400, {
				action: 'password',
				success: false,
				error: `Password must be at least ${password_min_length} characters long.`
			})
		}

		if (!password_regex.test(password)) {
			return fail(400, {
				action: 'password',
				success: false,
				error: 'Password must contain at least one letter and one number.'
			})
		}

		if (password !== password_repeat) {
			return fail(400, {
				action: 'password',
				success: false,
				error: 'Passwords do not match.'
			})
		}

		const password_hash = await bcrypt.hash(password, 10)

		const password_query = `UPDATE users SET password_hash = ? WHERE id = ?`
		const args = [password_hash, user.id]

		const { err } = await query(password_query, args)
		if (err) {
			return fail(500, {
				action: 'password',
				success: false,
				error: 'Database error.'
			})
		}

		return { action: 'password', success: true }
	},

	delete_account: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const delete_query = `DELETE FROM users WHERE id = ?`
		const args = [user.id]

		const { err } = await query(delete_query, args)

		if (err) {
			return fail(500, {
				action: 'delete',
				success: false,
				error: 'Database error.'
			})
		}

		event.cookies.delete('jwt', { path: '/' })

		redirect(302, '/')
	}
}

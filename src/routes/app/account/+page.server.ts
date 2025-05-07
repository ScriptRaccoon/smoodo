import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import {
	password_min_length,
	password_regex,
	username_regex,
	SECURITY_QUESTIONS
} from '$lib/server/config'
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

	return { username, SECURITY_QUESTIONS }
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

		return { action: 'rename', success: true }
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
	},

	security_question: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()
		const question_index = parseInt(form_data.get('question') as string)
		const answer = form_data.get('answer') as string

		const is_valid_index =
			question_index >= 0 && question_index < SECURITY_QUESTIONS.length
		if (!is_valid_index) {
			return fail(400, {
				action: 'security_question',
				success: false,
				error: 'Invalid security question.'
			})
		}

		if (!answer) {
			return fail(400, {
				action: 'security_question',
				success: false,
				error: 'Answer is required.'
			})
		}

		const answer_hash = await bcrypt.hash(answer, 10)

		const answer_query = `
		INSERT INTO
			security_answers (user_id, question_index, answer_hash)
		VALUES
			(?, ?, ?)
		ON CONFLICT(user_id) DO UPDATE SET
			question_index = excluded.question_index,
			answer_hash = excluded.answer_hash
		`

		const args = [user.id, question_index, answer_hash]

		const { err } = await query(answer_query, args)
		if (err) {
			return fail(500, {
				action: 'security_question',
				success: false,
				error: 'Database error.'
			})
		}

		return { action: 'security_question', success: true }
	}
}

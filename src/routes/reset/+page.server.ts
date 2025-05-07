import {
	password_min_length,
	password_regex,
	SECURITY_QUESTIONS
} from '$lib/server/config'
import { query } from '$lib/server/db'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import bcrypt from 'bcryptjs'

export const load: PageServerLoad = async (event) => {
	return { SECURITY_QUESTIONS }
}

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const username = form_data.get('username') as string
		const password = form_data.get('password') as string
		const password_repeat = form_data.get('repeat_password') as string
		const question_index = parseInt(form_data.get('question') as string)
		const answer = form_data.get('answer') as string

		const user_query = 'SELECT id FROM users WHERE username = ?'
		const user_args = [username]
		const { err: err_user, rows: users } = await query<{ id: number }>(
			user_query,
			user_args
		)

		if (err_user) {
			return fail(500, { success: false, error: 'Database error.', username })
		}

		if (!users.length) {
			return fail(404, { success: false, error: 'User not found.', username })
		}

		const { id: user_id } = users[0]

		const answer_query = `
        SELECT
            answer_hash
        FROM
            security_answers
        WHERE
            user_id = ? AND question_index = ?`

		const answer_args = [user_id, question_index]
		const { err: err_answer, rows: answers } = await query<{ answer_hash: string }>(
			answer_query,
			answer_args
		)

		if (err_answer) {
			return fail(500, { success: false, error: 'Database error.', username })
		}

		if (!answers.length) {
			return fail(404, {
				success: false,
				error: 'Incorrect security question or answer.',
				username
			})
		}

		const { answer_hash } = answers[0]

		const is_answer_correct = await bcrypt.compare(answer, answer_hash)

		if (!is_answer_correct) {
			return fail(400, {
				success: false,
				error: 'Incorrect security question or answer.',
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

		const password_query = 'UPDATE users SET password_hash = ? WHERE id = ?'
		const args_password = [password_hash, user_id]

		const { err } = await query(password_query, args_password)
		if (err) {
			return fail(500, {
				success: false,
				error: 'Database error.',
				username
			})
		}

		return { success: true, username }
	}
}

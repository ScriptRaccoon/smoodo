// @ts-check

import { writeFileSync } from 'fs'

const start = new Date('2024-07-04')
const end = new Date()

/**
 * Generates a SQL file with sample data for the database.
 * Requires that a user with id = 1 has been created before.
 */
function generate_sample_data() {
	let sql = 'INSERT INTO moods (user_id, value, date)\nVALUES\n'
	const user_id = 1
	const moods = []

	for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const value = Math.floor(Math.random() * 5) + 1
		const date = d.toISOString().split('T')[0]
		moods.push({ value, date })
	}

	sql += moods.map((mood) => `(${user_id}, ${mood.value}, '${mood.date}')`).join(',\n')
	sql += ';\n'

	writeFileSync('sample.sql', sql, 'utf8')
	console.info('Sample data written to sample.sql')
}

generate_sample_data()

export const username_regex = /^[a-zA-Z0-9_]+$/
export const password_min_length = 8
export const password_regex = /^(?=.*[A-Za-z])(?=.*\d).+$/
export const date_regex = /^\d{4}-\d{2}-\d{2}$/
export const comment_max_length = 1000

export const SECURITY_QUESTIONS = [
	'What was the name of your first pet?',
	'What was the name of your first teacher?',
	'What is the title of your favorite book?',
	'What is the name of the street you grew up on?',
	'What is the name of your favorite childhood friend?',
	'What was the name of your first school?',
	'What city did you visit on your first vacation?',
	'What is the name of your favorite fictional character?'
]

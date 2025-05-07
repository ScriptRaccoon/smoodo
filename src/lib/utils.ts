/**
 * Groups an array of objects by a specified key.
 */
export function group_by<T extends Record<string, any>, K extends keyof T>(
	arr: T[],
	key: K
): Record<T[K], T> {
	return Object.fromEntries(arr.map((item) => [item[key], item]))
}

/**
 * Transforms the day index so that Monday is 0 and Sunday is 6.
 */
function transform_day(day: number): number {
	return day > 0 ? day - 1 : 6
}

/**
 * List of 12 month names in English.
 */
const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
	new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(0, i))
) as readonly string[]

/**
 * Returns information about a month given its string representation in YYYY-MM format.
 */
export function get_month_info(month_str: string) {
	const [year, number] = month_str.split('-').map(Number)
	const name = MONTH_NAMES[number - 1]
	const label = `${name} ${year}`
	const first_day_wrong = new Date(year, number - 1, 1).getDay()
	const first_day = transform_day(first_day_wrong)
	// 0th day of next month = last day of current month:
	const day_count = new Date(year, number, 0).getDate()

	return { label, year, number, day_count, first_day }
}

/**
 * Adds a number of days to a given date and returns it in YYYY-MM-DD format.
 */
export function add_days(date: string | Date, amount: number): string {
	const date_obj = new Date(date)
	date_obj.setDate(date_obj.getDate() + amount)
	return date_obj.toLocaleDateString('en-CA')
}

/**
 * Returns a date in YYYY-MM-DD format. We cannot use the native Date constructor
 * because of weird time zone issues.
 */
export function get_date_string(year: number, month: number, day: number): string {
	return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

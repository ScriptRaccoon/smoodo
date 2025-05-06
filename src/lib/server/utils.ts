import { MONTH_NAMES } from './config'

export function group_by<T extends Record<string, any>, K extends keyof T>(
	arr: T[],
	key: K
): Record<T[K], T> {
	return Object.fromEntries(arr.map((item) => [item[key], item]))
}

function transform_day_index(day_index: number) {
	return day_index > 0 ? day_index - 1 : 6
}

export function get_month_info(month_str: string) {
	const [year, month_number] = month_str.split('-').map(Number)
	const month_index = month_number - 1
	const name = MONTH_NAMES[month_index]
	const label = `${name} ${year}`
	const day_count = new Date(year, month_number, 0).getDate()
	const first_day = transform_day_index(new Date(year, month_index, 1).getDay())

	return {
		label,
		year,
		number: month_number,
		day_count,
		first_day
	}
}

export function group_by<T extends Record<string, any>, K extends keyof T>(
	arr: T[],
	key: K
): Record<T[K], T> {
	return Object.fromEntries(arr.map((item) => [item[key], item]))
}

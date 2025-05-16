type IP_Address = string

/**
 * Rate limiter class to limit the number of requests from a single IP address
 */
export class RateLimiter {
	private limit: number
	private interval: number
	private map: Map<IP_Address, { count: number; start_time: number }> = new Map()

	/**
	 * @param limit maximum number of requests allowed in the interval
	 * @param interval time in milliseconds for the rate limit
	 */
	constructor(limit: number, interval: number) {
		this.limit = limit
		this.interval = interval
	}

	public is_rate_limited(ip: IP_Address): boolean {
		const now = Date.now()
		const entry = this.map.get(ip)

		if (!entry) {
			this.map.set(ip, { count: 1, start_time: now })
			return false
		}

		const { count, start_time } = entry

		if (now - start_time > this.interval) {
			this.map.set(ip, { count: 1, start_time: now })
			return false
		}

		if (count >= this.limit) {
			return true
		}

		this.map.set(ip, { count: count + 1, start_time })

		return false
	}

	public reset(ip: IP_Address): void {
		this.map.delete(ip)
	}
}

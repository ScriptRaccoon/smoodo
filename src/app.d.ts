import type { UserLocals } from '$lib/server/types'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: UserLocals
		}
		interface PageData {
			user?: UserLocals
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}

<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<h1>Login</h1>

<form method="POST" use:enhance>
	<div>
		<label for="username">Username</label>
		<input type="text" id="username" name="username" required />
	</div>

	<div>
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<button type="submit">Login</button>
</form>

{#if form?.error}
	<p>{form.error}</p>
{/if}

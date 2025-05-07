<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<header class="header">
	<h1>Register</h1>
</header>

<form method="POST" use:enhance>
	<div class="input-group">
		<label for="username">Username</label>
		<input
			type="text"
			id="username"
			name="username"
			required
			value={form?.username ?? ''}
		/>
	</div>

	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<button class="button" type="submit">Register</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.success}
	<p>Registration successful! You can now <a href="/login">login</a>.</p>
{/if}

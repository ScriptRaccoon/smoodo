<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<header class="header">
	<h1>Login</h1>
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

	<button class="button" type="submit">Login</button>
</form>

<p>
	Forgot your password? <a href="/reset">Reset it</a>.
</p>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

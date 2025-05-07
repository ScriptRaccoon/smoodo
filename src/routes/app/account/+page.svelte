<script>
	import { enhance } from '$app/forms'
	let { data, form } = $props()

	let confirm_deletion = $state(false)
</script>

<header class="header">
	<h1>Account</h1>
</header>

<p>Hey, {data.username}!</p>

<form action="/app/logout" method="GET">
	<button class="button">Logout</button>
</form>

<form action="?/delete_account" method="POST" use:enhance>
	{#if confirm_deletion}
		<p>
			Are you sure you want to delete your account? This action cannot be undone.
			All data will be lost.
		</p>
		<menu>
			<button class="button">Yes. I want to delete my account</button>
			<button
				class="button"
				type="button"
				onclick={() => (confirm_deletion = false)}>Cancel</button
			>
		</menu>
	{:else}
		<button class="button" type="button" onclick={() => (confirm_deletion = true)}>
			Delete Acccount
		</button>
	{/if}
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	menu {
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
	}

	form {
		margin-top: 1rem;
	}
</style>

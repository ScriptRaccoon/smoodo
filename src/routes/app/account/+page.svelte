<script>
	import { enhance } from '$app/forms'
	let { data, form } = $props()

	let confirm_deletion = $state(false)
</script>

<header class="header">
	<h1>Account</h1>
	<div>
		<a href="/api/export">Export Data</a> &nbsp;
		<a href="/app/logout" data-sveltekit-preload-data="off">Logout</a>
	</div>
</header>

<p>Hey, {data.username}!</p>

<form action="?/rename" method="POST" use:enhance>
	<div class="input-group">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" value={data.username} required />
	</div>

	<button class="button">Change username</button>
</form>

{#if form?.action === 'rename' && form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.action === 'rename' && form?.success}
	<p>Username has been updated.</p>
{/if}

<form action="?/password" method="POST" use:enhance>
	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<div class="input-group">
		<label for="repeat_password">Repeat Password</label>
		<input type="password" id="repeat_password" name="repeat_password" required />
	</div>

	<button class="button">Change password</button>
</form>

{#if form?.action === 'password' && form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.action === 'password' && form?.success}
	<p>Password has been updated.</p>
{/if}

<form action="?/security_question" method="POST" use:enhance>
	<div class="input-group">
		<label for="question">Security Question (optional, for password reset)</label>
		<select name="question" id="question" required>
			{#each data.SECURITY_QUESTIONS as question, index}
				<option value={index}>
					{question}
				</option>
			{/each}
		</select>
	</div>

	<div class="input-group">
		<label for="answer">Answer</label>
		<input type="text" id="answer" name="answer" required />
	</div>

	<button class="button">Submit</button>
</form>

{#if form?.action === 'security_question' && form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.action === 'security_question' && form?.success}
	<p>Security question and answer have been saved.</p>
{/if}

<form class="form_delete" action="?/delete_account" method="POST" use:enhance>
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
			Delete Account
		</button>
	{/if}
</form>

{#if form?.action === 'delete' && form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	menu {
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
	}

	form {
		margin-top: 1rem;
	}

	.form_delete {
		margin-top: 3rem;
	}
</style>

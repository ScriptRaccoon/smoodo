<script lang="ts">
	import { enhance } from '$app/forms'

	let { form, data } = $props()
</script>

<header class="header">
	<h1>Reset your password</h1>
</header>

<p>You must have saved your security question and answer to reset your password.</p>

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
		<label for="question">Security Question</label>
		<select name="question" id="question">
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

	<div class="input-group">
		<label for="password">New Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<div class="input-group">
		<label for="repeat_password">Repeat Password</label>
		<input type="password" id="repeat_password" name="repeat_password" required />
	</div>

	<button class="button">Submit</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.success}
	<p>Password has been reset successfully. You can now <a href="/login">login</a>.</p>
{/if}

<script lang="ts">
	import { enhance } from '$app/forms'

	let { form, data } = $props()
</script>

<h1>{data.date_display}</h1>

<p>
	{#if data.mood}
		<strong>You have submitted your mood</strong>
	{:else}
		<strong>Submit your Mood</strong>
	{/if}
</p>

<form method="POST" use:enhance>
	<input type="hidden" name="date" value={data.date} />
	{#each { length: 5 } as _, i}
		<input
			class="mood"
			type="radio"
			name="mood"
			value={i + 1}
			checked={data.mood?.value === i + 1}
			data-value={i + 1}
			required
			aria-label="{i + 1} out of 5"
		/>
	{/each}

	<div>
		<label for="comment">Comment (optional)</label>
		<br />
		<textarea name="comment" id="comment" rows="4"
			>{data.mood?.comment ?? ''}</textarea
		>
	</div>

	<button type="submit">
		{#if data.mood}
			Update
		{:else}
			Submit
		{/if}
	</button>
</form>

{#if form?.error}
	<p>{form.error}</p>
{/if}

{#if form?.success}
	<p>Mood has been submitted</p>
{/if}

<style>
	.mood {
		appearance: none;
		display: inline-block;
		width: 2rem;
		height: 2rem;
		background-color: var(--color);
		border-radius: 0.5rem;
		cursor: pointer;
		outline: none;
	}

	.mood:checked {
		outline: 2px solid gray;
		outline-offset: 2px;
	}
</style>

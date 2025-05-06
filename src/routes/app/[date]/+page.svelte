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
		<label>
			<input
				type="radio"
				name="mood"
				value={i + 1}
				checked={data.mood?.value === i + 1}
				required
			/>
			{i + 1} &nbsp;
		</label>
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

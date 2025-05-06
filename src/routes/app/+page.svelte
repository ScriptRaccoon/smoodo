<script lang="ts">
	import { enhance } from '$app/forms'

	let { form, data } = $props()
</script>

<h1>App</h1>

<h2>{data.date_display}</h2>

{#if data.mood}
	<strong>You have submitted your mood for today</strong>
{:else}
	<strong>Submit your Mood for today</strong>
{/if}

<form method="POST" use:enhance>
	<input type="hidden" name="date" value={data.date} />
	<div>
		<label for="mood">Mood (1 to 5)</label>
		<select name="mood" id="mood" required>
			{#each { length: 5 } as _, i}
				<option value={i + 1} selected={data.mood.mood === i + 1}>{i + 1}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="comment">Comment (optional)</label>
		<textarea name="comment" id="comment" rows="4">{data.mood.comment}</textarea>
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
	label {
		display: block;
	}
</style>

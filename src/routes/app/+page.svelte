<script lang="ts">
	import { enhance } from '$app/forms'
	import { format } from 'date-fns'

	let { form } = $props()

	const date = format(new Date(), 'yyyy-MM-dd')
	const date_display = format(new Date(), 'EEEE dd MMMM yyyy')
</script>

<h1>App</h1>

<h2>{date_display}</h2>

<strong>Submit your Mood for today</strong>

<form method="POST" use:enhance>
	<input type="hidden" name="date" value={date} />
	<div>
		<label for="mood">Mood (1 to 5)</label>
		<select name="mood" id="mood" required>
			{#each { length: 5 } as _, i}
				<option value={i + 1}>{i + 1}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="comment">Comment (optional)</label>
		<textarea name="comment" id="comment" rows="4"></textarea>
	</div>

	<button type="submit">Submit</button>
</form>

<p>1 = Sad, 5 = Happy</p>

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

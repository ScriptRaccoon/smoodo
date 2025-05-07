<script lang="ts">
	import { enhance } from '$app/forms'
	import Legend from '$lib/components/Legend.svelte'
	import { ChevronLeft, ChevronRight } from '@lucide/svelte'

	let { form, data } = $props()
</script>

<header class="header">
	<a href="/app/{data.prev_date}" aria-label="previous day">
		<ChevronLeft strokeWidth={3} />
	</a>
	<h1>{data.date_display}</h1>
	<a href="/app/{data.next_date}" aria-label="next day">
		<ChevronRight strokeWidth={3} />
	</a>
</header>

{#if !data.mood}
	<p class="question">What was your mood this day?</p>
{/if}

<form method="POST" use:enhance>
	<div class="moods">
		{#each { length: 5 } as _, i}
			<input
				class="mood"
				type="radio"
				name="mood"
				value={i + 1}
				checked={data.mood?.value === i + 1 || form?.mood_value === i + 1}
				data-value={i + 1}
				required
				aria-label="mood {i + 1} out of 5"
			/>
		{/each}
	</div>

	<div class="input-group">
		<label for="comment">Comment (optional)</label>
		<textarea name="comment" id="comment" rows="4"
			>{data.mood?.comment ?? form?.comment ?? ''}</textarea
		>
	</div>

	<menu>
		<button formaction="?/save" class="button" type="submit">
			{#if data.mood}
				Update
			{:else}
				Save
			{/if}
		</button>

		{#if data.mood}
			<button formaction="?/delete" class="button">Delete</button>
		{/if}
	</menu>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.message}
	<p>{form.message}</p>
{/if}

<Legend />

<style>
	.header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: end;
	}

	h1 {
		text-align: center;
	}

	.question {
		font-weight: bold;
		font-size: 1.25rem;
		text-align: center;
	}

	.moods {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-block: 1rem;
	}

	.mood {
		appearance: none;
		display: inline-block;
		width: 2.5rem;
		height: 2.5rem;
		background-color: var(--color);
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		outline: none !important;
	}

	.moods:has(:checked) .mood:not(:checked) {
		opacity: 0.25;
		scale: 0.75;
	}

	menu {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
</style>

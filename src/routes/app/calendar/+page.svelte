<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import Legend from '$lib/components/Legend.svelte'
	import { get_date_string } from '$lib/utils.js'

	let { data } = $props()

	afterNavigate(() => {
		window.scrollTo(0, document.body.scrollHeight)
	})
</script>

<header class="header">
	<h1>Calendar</h1>
</header>

{#if data.months.length}
	{#each data.months as month}
		<section>
			<h2>{month.label}</h2>
			<div class="grid" style:--first_day={month.first_day}>
				{#each { length: month.day_count } as _, i}
					{@const date = get_date_string(month.year, month.number, i + 1)}
					<a
						class="date mood"
						class:first={i === 0}
						href={`/app/${date}`}
						data-value={data.moods_dictionary[date]?.value ?? 0}
						aria-label={date}
					>
						<span class="day">{i + 1}</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	<Legend />
{:else}
	<p>No entries yet</p>
{/if}

<style>
	h1 {
		text-align: center;
	}

	h2 {
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	section {
		margin-bottom: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
	}

	.date {
		aspect-ratio: 4 / 3;
		border-radius: 0.25rem;
		text-decoration: none;
		background-color: var(--color, var(--secondary-bg-color));
		position: relative;
	}

	.date.first {
		grid-column: calc(1 + var(--first_day));
	}

	.day {
		position: absolute;
		bottom: 0.2rem;
		right: 0.2rem;
		font-size: 0.75rem;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		background-color: var(--secondary-bg-color);
		border-radius: 50%;
		width: 1.125rem;
		height: 1.125rem;
		color: var(--secondary-font-color);
	}
</style>

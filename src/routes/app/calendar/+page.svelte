<script lang="ts">
	let { data } = $props()
</script>

<h1>Calendar</h1>

{#each data.months as month}
	<h2>{month.label}</h2>
	<div class="grid" style:--first_day={month.first_day}>
		{#each { length: month.day_count } as _, i}
			{@const date = `${month.year}-${month.number.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`}
			<a
				class="date mood"
				class:first={i === 0}
				href={`/app/${date}`}
				data-value={data.moods[date]?.value ?? 0}
			>
				<span class="sr-only">{date}</span>
			</a>
		{/each}
	</div>
{/each}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.4rem;
	}

	.date {
		padding: 1rem;
		border-radius: 0.5rem;
		text-align: center;
		text-decoration: none;
		color: inherit;
		background-color: var(--color, #eee);
	}

	.date.first {
		grid-column: calc(1 + var(--first_day));
	}
</style>

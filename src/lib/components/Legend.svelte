<script>
	const MOOD_LABELS = ['very bad', 'bad', 'neutral', 'good', 'very good']
</script>

<section>
	<h2>Legend</h2>
	<ol class="no-bullets">
		{#each { length: 5 } as _, i}
			<li>
				<div class="item">
					<span
						class="mood"
						data-value={i + 1}
						aria-label="mood {i + 1} out of 5"
					></span>

					{MOOD_LABELS[i]}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.mood {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: var(--color);
	}

	section {
		color: var(--secondary-font-color);
		margin-top: 2rem;
		font-size: 0.875rem;
	}

	h2 {
		font-size: 1.125rem;
		margin-bottom: 0.25rem;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>

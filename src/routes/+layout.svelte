<script>
	import './app.css'
	import Nav from '$lib/components/Nav.svelte'
	let { children } = $props()
</script>

<svelte:head>
	<title>Smoodo - Mood Tracker</title>
	<meta name="title" content="Smoodo - Mood Tracker" />
	<meta
		name="description"
		content="Smoodo is a mood tracker that helps you keep track of your daily moods and visualize them over time."
	/>
</svelte:head>

<Nav />

<main>
	{@render children()}
</main>

<style>
	main {
		max-width: 38rem;
		margin: 0 auto;
		padding-inline: 0.75rem;
		margin-bottom: 2rem;
	}
</style>

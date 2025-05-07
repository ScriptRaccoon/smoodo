<script>
	import './app.css'
	import Nav from '$lib/components/Nav.svelte'
	let { children } = $props()
</script>

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

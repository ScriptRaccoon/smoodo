<script lang="ts">
	import { page } from '$app/state'
</script>

<nav>
	<ul>
		<li>
			<a href="/">Home</a>
		</li>
		{#if page.data.user}
			<li>
				<a href="/app">App</a>
			</li>
			<li>
				<a href="/app/logout" data-sveltekit-preload-data="off">Logout</a>
			</li>
		{:else}
			<li>
				<a href="/login">Login</a>
			</li>
			<li>
				<a href="/register">Register</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	ul {
		padding: 0;
		list-style-type: none;
		gap: 1rem;
		display: flex;
	}
</style>

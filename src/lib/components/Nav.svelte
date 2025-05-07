<script lang="ts">
	import { page } from '$app/state'
	const today = new Date().toLocaleDateString('en-CA')
</script>

<nav>
	<ul class="no-bullets">
		{#if page.data.user}
			<li>
				<a href="/app/{today}">Today</a>
			</li>
			<li>
				<a href="/app/calendar">Calendar</a>
			</li>
			<li>
				<a href="/app/account">Account</a>
			</li>
		{:else}
			<li>
				<a href="/">Home</a>
			</li>
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
	nav {
		padding-block: 1rem;
		padding-inline: 0.75rem;
		position: sticky;
		top: 0;
		z-index: 1;
		background-image: var(--bg-gradient);
		background-size: 100vw 100vh;
	}

	ul {
		gap: 0.5rem 1rem;
		display: flex;
		justify-content: center;
	}
</style>

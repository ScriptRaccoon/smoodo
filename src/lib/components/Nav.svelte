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
				<a href="/app/today">Today</a>
			</li>
			<li>
				<a href="/app/calendar">Calendar</a>
			</li>
			<li>
				<a href="/app/account">Account</a>
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
	nav {
		padding-block: 1rem;
		padding-inline: 0.75rem;
		position: sticky;
		top: 0;
		background-image: var(--bg-gradient);
		background-size: 100vw 100vh;
	}

	ul {
		padding: 0;
		list-style-type: none;
		gap: 0.5rem 1rem;
		display: flex;
		justify-content: center;
	}
</style>

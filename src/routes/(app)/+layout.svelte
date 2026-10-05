<script lang="ts">
	import AppHeader from '$lib/components/organism/AppHeader.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<!-- Member-only pages: keep them out of search results. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-svh flex-col bg-background">
	<AppHeader walletAddress={data.user.walletAddress} />
	<main id="main" class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>

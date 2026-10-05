<script lang="ts">
	import { page } from '$app/state';
	import SpriteDefs from '$lib/components/decor/SpriteDefs.svelte';
	import SiteFooter from '$lib/components/organism/SiteFooter.svelte';
	import MemberHeader from '$lib/features/member/components/MemberHeader.svelte';

	let { data, children } = $props();

	// The agent is a full-height app view; other member pages scroll and end in the site footer.
	const fullscreen = $derived(page.url.pathname === '/chat');
</script>

<svelte:head>
	<!-- Member-only pages: keep them out of search results. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<SpriteDefs />
<MemberHeader walletAddress={data.user.walletAddress} />

<main id="main" class="bg-background">
	{@render children()}
</main>

{#if !fullscreen}
	<!-- Bottom padding keeps the footer clear of the phone tab bar. -->
	<div class="max-md:bg-very-tertiary max-md:pb-[68px]">
		<SiteFooter />
	</div>
{/if}

<script lang="ts">
	import SiteHeader from '$lib/components/organism/SiteHeader.svelte';
	import NavTabs from '$lib/components/molecules/NavTabs.svelte';
	import { hubNav } from '$lib/nav';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background">
	<div class="bg-linear-to-b from-secondary/40 to-background">
		<SiteHeader />

		<div class="flex justify-center px-6 pb-8">
			<NavTabs items={hubNav} />
		</div>
	</div>

	{@render children()}
</div>

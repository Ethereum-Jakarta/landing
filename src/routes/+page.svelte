<script lang="ts">
	import type { PageData } from './$types';
	import LandingPage from '$lib/features/landing/LandingPage.svelte';

	let { data }: { data: PageData } = $props();
</script>

<LandingPage events={data.events} />

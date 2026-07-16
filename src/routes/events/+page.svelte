<script lang="ts">
	import type { PageData } from './$types';
	import EventCard from '$lib/features/events/components/EventCard.svelte';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import NavTabs from '$lib/components/molecules/NavTabs.svelte';
	import Button from '$lib/components/atoms/Button.svelte';

	let { data }: { data: PageData } = $props();

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'About Us', href: '/#about' },
		{ label: 'Events', href: '/events' }
	];
</script>

<svelte:head>
	<title>Events · ETHJKT</title>
	<meta name="description" content="Upcoming and recent Ethereum Jakarta community events." />
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Gradient header band, matching the hero -->
	<section class="relative overflow-hidden bg-linear-to-b from-secondary to-background">
		<header class="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
			<a href="/"><Logo height={32} /></a>
			<NavTabs items={navItems} class="hidden md:block" />
			<div class="w-8 md:w-0"></div>
		</header>

		<div class="relative z-10 px-6 py-16 text-center md:py-24">
			<h1 class="font-montserrat text-5xl font-bold text-tertiary md:text-6xl">Events</h1>
			<p class="mx-auto mt-6 max-w-2xl font-inter text-xl font-light text-muted">
				Meetups, workshops & hackathons from the Ethereum community in Indonesia.
			</p>
		</div>
	</section>

	<main class="mx-auto max-w-6xl px-6 py-16">
		{#if data.failed}
			<p class="text-center font-inter text-muted">
				Couldn't load events right now. See them on
				<a class="text-primary underline" href="https://luma.com/ethjkt">Lu.ma</a>.
			</p>
		{:else}
			{#if data.upcoming.length}
				<section class="mb-16">
					<h2 class="mb-8 font-montserrat text-3xl font-bold text-foreground">Upcoming</h2>
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.upcoming as event (event.id)}
							<EventCard {event} />
						{/each}
					</div>
				</section>
			{/if}

			{#if data.past.length}
				<section>
					<h2 class="mb-8 font-montserrat text-3xl font-bold text-foreground">
						{data.upcoming.length ? 'Past events' : 'Recent events'}
					</h2>
					<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.past as event (event.id)}
							<EventCard {event} />
						{/each}
					</div>
				</section>
			{/if}

			{#if !data.upcoming.length && !data.past.length}
				<div class="py-16 text-center">
					<p class="font-inter text-lg text-muted">No events scheduled yet — check back soon.</p>
					<div class="mt-6">
						<Button href="https://luma.com/ethjkt" target="_blank" rel="noopener" size="lg">
							Follow us on Lu.ma
						</Button>
					</div>
				</div>
			{/if}
		{/if}
	</main>
</div>

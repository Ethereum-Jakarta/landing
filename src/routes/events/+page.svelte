<script lang="ts">
	import type { PageData } from './$types';
	import EventCard from '$lib/features/events/components/EventCard.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import SiteHeader from '$lib/components/organism/SiteHeader.svelte';
	import SiteFooter from '$lib/components/organism/SiteFooter.svelte';

	let { data }: { data: PageData } = $props();

	const PAST_SHOWN = 9;
	const LUMA = 'https://luma.com/ethjkt';
	const past = $derived(data.past.slice(0, PAST_SHOWN));
	const description =
		'Meetups, workshops and hackathons from Ethereum Jakarta (ETHJKT). Most events are free and open to builders of every level.';
</script>

<svelte:head>
	<title>Events · ETHJKT</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="Events · ETHJKT" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<SiteHeader active="events" />

<main id="main" class="min-h-svh bg-background">
	<section
		class="bg-linear-to-b from-secondary to-background px-5 pt-36 pb-14 text-center sm:pt-44"
	>
		<h1 class="font-montserrat text-h2 font-extrabold text-foreground">Events</h1>
		<p class="mx-auto mt-4 max-w-[52ch] text-body-lg text-ink-soft">
			Meetups, workshops and hackathons with the Ethereum community in Indonesia. Most are free, and
			every event is open to beginners.
		</p>
	</section>

	<div class="mx-auto max-w-[1200px] px-[clamp(20px,5vw,64px)] pb-24">
		{#if data.failed}
			<div class="mx-auto max-w-[46ch] py-16 text-center">
				<h2 class="font-montserrat text-h3 font-bold text-foreground">
					We couldn't load events right now
				</h2>
				<p class="mt-3 text-body text-muted">
					Lu.ma didn't respond. Every ETHJKT event is also listed on our Lu.ma page.
				</p>
				<Button href={LUMA} target="_blank" rel="noopener" class="mt-6">Open ETHJKT on Lu.ma</Button
				>
			</div>
		{:else}
			<section aria-labelledby="upcoming-title" class="pt-4">
				<h2 id="upcoming-title" class="font-montserrat text-h3 font-bold text-foreground">
					Upcoming
				</h2>
				{#if data.upcoming.length}
					<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each data.upcoming as event (event.id)}
							<EventCard {event} upcoming />
						{/each}
					</div>
				{:else}
					<!-- Empty state: what this is, why it's empty, what to do next. -->
					<div class="mt-6 rounded-[28px] bg-sky-wash px-6 py-10 text-center">
						<p class="font-semibold text-foreground">Nothing scheduled right now</p>
						<p class="mx-auto mt-2 max-w-[48ch] text-sm text-muted">
							New meetups and workshops are announced on Lu.ma and in our Discord first. Follow us
							to get notified.
						</p>
						<Button
							href={LUMA}
							target="_blank"
							rel="noopener"
							variant="tertiary"
							size="sm"
							class="mt-5">Follow on Lu.ma</Button
						>
					</div>
				{/if}
			</section>

			{#if past.length}
				<section aria-labelledby="past-title" class="mt-16">
					<div class="flex flex-wrap items-baseline justify-between gap-3">
						<h2 id="past-title" class="font-montserrat text-h3 font-bold text-foreground">
							Recent events
						</h2>
						{#if data.past.length > PAST_SHOWN}
							<a
								href={LUMA}
								target="_blank"
								rel="noopener"
								class="text-sm font-semibold text-foreground underline underline-offset-4"
								>See all past events on Lu.ma →</a
							>
						{/if}
					</div>
					<div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each past as event (event.id)}
							<EventCard {event} upcoming={false} />
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</div>
</main>

<SiteFooter />

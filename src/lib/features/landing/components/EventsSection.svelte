<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { CalendarEvents as EventsResult } from '$lib/features/events/luma';
	import EventCard from '$lib/features/events/components/EventCard.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import Deco from './decor/Deco.svelte';
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		/** Streamed from the page load so Lu.ma latency never blocks first paint. */
		events: Promise<EventsResult>;
		reduced: boolean;
	}

	let { events, reduced }: Props = $props();

	const SHOWN = 3;

	// Upcoming first, then the most recent past events (Lu.ma returns those newest-first) to fill the row.
	function pick(r: EventsResult) {
		const upcoming = r.upcoming.slice(0, SHOWN).map((event) => ({ event, upcoming: true }));
		const recent = r.past
			.slice(0, SHOWN - upcoming.length)
			.map((event) => ({ event, upcoming: false }));
		return [...upcoming, ...recent];
	}

	// Cards arrive after the page's scroll triggers were measured: re-measure, then reveal.
	// Tweens target the wrappers so they don't fight the card's CSS hover transition.
	const revealCards: Attachment<HTMLElement> = (grid) => {
		const tween = reduced
			? null
			: gsap.from(grid.children, {
					y: 40,
					opacity: 0,
					duration: 0.9,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: { trigger: grid, start: 'top 92%' }
				});
		const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
		return () => {
			cancelAnimationFrame(raf);
			tween?.scrollTrigger?.kill();
			tween?.kill();
		};
	};
</script>

{#snippet fallback(title: string, message: string)}
	<div class="mx-auto max-w-[46ch] rounded-[28px] bg-sky-wash px-6 py-10 text-center">
		<p class="font-semibold text-foreground">{title}</p>
		<p class="mt-2 text-sm text-muted">{message}</p>
		<Button
			href="https://luma.com/ethjkt"
			target="_blank"
			rel="noopener"
			variant="tertiary"
			size="sm"
			class="mt-5">Follow ETHJKT on Lu.ma</Button
		>
	</div>
{/snippet}

<section
	id="events"
	aria-labelledby="events-title"
	class="relative overflow-hidden bg-background pt-[clamp(72px,13vh,150px)] pb-[clamp(40px,6vh,80px)]"
>
	<Deco
		icon="d-eth-node"
		viewBox="0 0 60 40"
		depth="mid"
		amb="float-slow"
		class="top-[10%] right-[6%] w-[clamp(48px,5vw,80px)] text-foreground/40 max-md:hidden"
	/>
	<Deco
		icon="d-eth-shard"
		viewBox="0 0 24 30"
		depth="near"
		amb="rotate-slow"
		class="top-[22%] left-[7%] w-[22px] text-secondary max-md:hidden"
	/>

	<SectionHeading
		id="events-title"
		title="Community Events"
		sub="Meetups, workshops and hackathons with the Ethereum community in Indonesia. Most are free."
	>
		<Deco
			icon="d-spark-4"
			viewBox="0 0 24 24"
			depth="mid"
			amb="twinkle"
			class="-top-4 left-[calc(50%+min(270px,33vw))] w-[22px] text-primary"
		/>
	</SectionHeading>

	<div class="mx-auto mt-[clamp(32px,6vh,56px)] max-w-[1200px] px-[clamp(20px,5vw,64px)]">
		{#await events}
			<p role="status" class="sr-only">Loading events…</p>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each { length: SHOWN }, i (i)}
					<div
						aria-hidden="true"
						class="flex animate-pulse flex-col gap-4 rounded-[28px] p-3 shadow-soft-ring"
					>
						<div class="aspect-video rounded-2xl bg-sky-wash"></div>
						<div class="h-3 w-1/3 rounded-full bg-sky-wash"></div>
						<div class="h-5 w-4/5 rounded-full bg-sky-wash"></div>
						<div class="mb-3 h-4 w-1/4 rounded-full bg-sky-wash"></div>
					</div>
				{/each}
			</div>
		{:then result}
			{@const shown = pick(result)}
			{#if result.failed}
				{@render fallback(
					"We couldn't load events right now",
					'Lu.ma did not respond. Every ETHJKT event is also listed on our Lu.ma page.'
				)}
			{:else if !shown.length}
				{@render fallback(
					'Nothing scheduled yet',
					'New events are announced on Lu.ma and in our Discord first. Follow us to hear about the next one.'
				)}
			{:else}
				<div {@attach revealCards} class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each shown as { event, upcoming } (event.id)}
						<div>
							<EventCard {event} {upcoming} />
						</div>
					{/each}
				</div>
			{/if}
		{/await}

		<div class="mt-[clamp(28px,5vh,44px)] text-center">
			<Button href="/events" variant="tertiary"
				>See all events <span aria-hidden="true">→</span></Button
			>
		</div>
	</div>
</section>

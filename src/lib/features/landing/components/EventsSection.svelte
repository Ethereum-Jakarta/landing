<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { LumaEvent } from '$lib/features/events/luma';
	import Deco from './decor/Deco.svelte';

	type EventsResult = { upcoming: LumaEvent[]; past: LumaEvent[]; failed: boolean };

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

	const parts = (e: LumaEvent) => {
		const d = new Date(e.startAt);
		const f = (o: Intl.DateTimeFormatOptions) =>
			new Intl.DateTimeFormat('en-GB', { ...o, timeZone: e.timezone }).format(d);
		return {
			month: f({ month: 'short' }),
			day: f({ day: 'numeric' }),
			when: `${f({ weekday: 'short' })} · ${f({ hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`
		};
	};

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

{#snippet fallback(message: string)}
	<div class="mx-auto max-w-[46ch] py-10 text-center">
		<p class="text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-muted">{message}</p>
		<a
			href="https://luma.com/ethjkt"
			target="_blank"
			rel="noopener"
			class="mt-5 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-foreground shadow-cta transition-colors hover:bg-primary-hover"
			>Follow ETHJKT on Lu.ma</a
		>
	</div>
{/snippet}

<section
	id="events"
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

	<div class="relative px-5 text-center">
		<h2
			data-a="sec-title"
			class="m-0 font-montserrat text-[clamp(32px,4.2vw,60px)] leading-[1.1] font-extrabold tracking-[-0.02em] text-foreground"
		>
			Community Events
		</h2>
		<Deco
			icon="d-spark-4"
			viewBox="0 0 24 24"
			depth="mid"
			amb="twinkle"
			class="-top-4 left-[calc(50%+min(270px,33vw))] w-[22px] text-primary"
		/>
		<p
			data-a="sec-sub"
			class="mx-auto mt-3 text-[clamp(15px,1.25vw,18px)] leading-[1.5] text-muted"
		>
			Meetups, workshops &amp; hackathons with the Ethereum community in Indonesia.
		</p>
	</div>

	<div class="mx-auto mt-[clamp(32px,6vh,56px)] max-w-[1200px] px-[clamp(20px,5vw,64px)]">
		{#await events}
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
				{@render fallback("Couldn't load events right now. Catch them all on Lu.ma.")}
			{:else if !shown.length}
				{@render fallback('No events scheduled yet. Check back soon.')}
			{:else}
				<div {@attach revealCards} class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each shown as { event: e, upcoming } (e.id)}
						{@const d = parts(e)}
						<div>
							<a
								href={e.url}
								target="_blank"
								rel="noopener"
								class="group relative flex h-full flex-col rounded-[28px] bg-background p-3 shadow-soft-ring transition-transform duration-300 hover:-translate-y-1.5"
							>
								<div class="relative aspect-video overflow-hidden rounded-2xl bg-sky-mist">
									{#if e.coverUrl}
										<img
											src={e.coverUrl}
											alt=""
											loading="lazy"
											class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									{:else}
										<div class="size-full bg-linear-to-b from-secondary to-sky-soft"></div>
									{/if}
									<div
										class="absolute top-3 left-3 flex min-w-14 flex-col items-center rounded-2xl bg-background px-3 py-1.5 shadow-tag"
									>
										<span class="text-[11px] font-bold tracking-[.12em] text-muted uppercase"
											>{d.month}</span
										>
										<span
											class="font-montserrat text-[22px] leading-none font-extrabold text-foreground"
											>{d.day}</span
										>
									</div>
									{#if e.isSoldOut}
										<span
											class="absolute top-3 right-3 rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-tertiary-foreground"
											>Sold out</span
										>
									{:else if e.isFree}
										<span
											class="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-foreground"
											>Free</span
										>
									{/if}
								</div>
								<div class="flex flex-1 flex-col gap-2 px-2 pt-4 pb-2">
									<p class="text-xs font-semibold tracking-[.06em] text-muted uppercase">
										{upcoming ? 'Upcoming' : 'Past'} · {d.when}
									</p>
									<h3
										class="line-clamp-2 font-montserrat text-[clamp(17px,1.3vw,20px)] leading-[1.25] font-bold text-foreground"
									>
										{e.name}
									</h3>
									{#if e.location}
										<p class="text-sm text-muted">{e.location}</p>
									{/if}
									<div class="mt-auto flex items-center justify-between gap-3 pt-3">
										{#if e.guestCount}
											<div class="flex items-center gap-2">
												<div class="flex -space-x-2">
													{#each e.guests.filter((g) => g.avatarUrl).slice(0, 4) as g, gi (gi)}
														<img
															src={g.avatarUrl}
															alt=""
															loading="lazy"
															class="size-6 rounded-full border-2 border-background object-cover"
														/>
													{/each}
												</div>
												<span class="text-sm text-muted">{e.guestCount} going</span>
											</div>
										{:else}
											<span></span>
										{/if}
										<span
											class="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
										>
											{e.isSoldOut || !upcoming ? 'View event' : 'Register'}
											<span
												aria-hidden="true"
												class="transition-transform group-hover:translate-x-0.5">→</span
											>
										</span>
									</div>
								</div>
							</a>
						</div>
					{/each}
				</div>
			{/if}
		{/await}

		<div class="mt-[clamp(28px,5vh,44px)] text-center">
			<a
				href="/events"
				class="inline-flex items-center gap-2 rounded-full bg-tertiary px-6 py-3 text-sm font-semibold text-tertiary-foreground transition-colors hover:text-primary"
				>See all events <span aria-hidden="true">→</span></a
			>
		</div>
	</div>
</section>

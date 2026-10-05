<script lang="ts">
	import type { LumaEvent } from '$lib/features/events/luma';

	interface Props {
		event: LumaEvent;
		/** Past events link to the recap page instead of asking people to register. */
		upcoming: boolean;
	}

	let { event, upcoming }: Props = $props();

	const d = $derived.by(() => {
		const date = new Date(event.startAt);
		const f = (o: Intl.DateTimeFormatOptions) =>
			new Intl.DateTimeFormat('en-GB', { ...o, timeZone: event.timezone }).format(date);
		return {
			month: f({ month: 'short' }),
			day: f({ day: 'numeric' }),
			when: `${f({ weekday: 'short' })} · ${f({ hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}`,
			iso: event.startAt
		};
	});

	const cta = $derived(upcoming && !event.isSoldOut ? 'Register' : 'View event');
	const avatars = $derived(event.guests.filter((g) => g.avatarUrl).slice(0, 4));
</script>

<!-- The whole card is one link (one tab stop); the text CTA just labels where it goes. -->
<a
	href={event.url}
	target="_blank"
	rel="noopener"
	class="group relative flex h-full flex-col rounded-[28px] bg-background p-3 shadow-soft-ring transition-transform duration-300 hover:-translate-y-1.5"
>
	<div class="relative aspect-video overflow-hidden rounded-2xl bg-sky-mist">
		{#if event.coverUrl}
			<img
				src={event.coverUrl}
				alt=""
				loading="lazy"
				class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
			/>
		{:else}
			<div class="size-full bg-linear-to-b from-secondary to-sky-soft"></div>
		{/if}
		<time
			datetime={d.iso}
			class="absolute top-3 left-3 flex min-w-14 flex-col items-center rounded-2xl bg-background px-3 py-1.5 shadow-tag"
		>
			<span class="text-[11px] font-bold tracking-[.12em] text-muted uppercase">{d.month}</span>
			<span class="font-montserrat text-[22px] leading-none font-extrabold text-foreground"
				>{d.day}</span
			>
		</time>
		{#if event.isSoldOut}
			<span
				class="absolute top-3 right-3 rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-tertiary-foreground"
				>Sold out</span
			>
		{:else if event.isFree}
			<span
				class="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
				>Free</span
			>
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-2 px-2 pt-4 pb-2">
		<p class="text-label font-semibold text-muted uppercase">
			{upcoming ? 'Upcoming' : 'Past'} · {d.when}
		</p>
		<h3 class="line-clamp-2 font-montserrat text-h4 font-bold text-foreground">{event.name}</h3>
		{#if event.location}
			<p class="flex items-center gap-1.5 text-sm text-muted">
				<svg class="size-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M9.69 18.93a.75.75 0 0 0 .62 0l.04-.02c.07-.04.18-.1.31-.17a17 17 0 0 0 3.04-2.35C15.6 14.5 17 12.18 17 9.5a7 7 0 1 0-14 0c0 2.68 1.4 5 3.3 6.89a17 17 0 0 0 3.35 2.52l.04.02ZM10 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="truncate">{event.location}</span>
			</p>
		{/if}
		<div class="mt-auto flex items-center justify-between gap-3 pt-3">
			{#if event.guestCount}
				<div class="flex items-center gap-2">
					{#if avatars.length}
						<div class="flex -space-x-2">
							{#each avatars as g, i (i)}
								<img
									src={g.avatarUrl}
									alt=""
									loading="lazy"
									class="size-6 rounded-full border-2 border-background object-cover"
								/>
							{/each}
						</div>
					{/if}
					<span class="text-sm text-muted">{event.guestCount} {upcoming ? 'going' : 'went'}</span>
				</div>
			{:else}
				<span></span>
			{/if}
			<span
				class="inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 group-hover:underline"
			>
				{cta}
				<span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">→</span>
				<span class="sr-only">(opens Lu.ma)</span>
			</span>
		</div>
	</div>
</a>

<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { formatEventDate, type LumaEvent } from '$lib/features/events/luma';

	let { event }: { event: LumaEvent } = $props();
</script>

<article
	class="flex flex-col overflow-hidden rounded-3xl border border-tertiary/10 bg-white shadow-sm transition-transform hover:scale-[1.02]"
>
	<div class="relative">
		{#if event.coverUrl}
			<img
				src={event.coverUrl}
				alt={event.name}
				loading="lazy"
				class="aspect-video w-full object-cover"
			/>
		{:else}
			<div class="aspect-video w-full bg-linear-to-b from-secondary to-background"></div>
		{/if}

		{#if event.isSoldOut}
			<span
				class="absolute top-3 left-3 rounded-full bg-tertiary px-3 py-1 font-inter text-xs font-semibold text-tertiary-foreground"
			>
				Sold out
			</span>
		{:else if event.isFree}
			<span
				class="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 font-inter text-xs font-semibold text-primary-foreground"
			>
				Free
			</span>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-3 p-5">
		<p class="font-inter text-sm font-medium text-primary">
			{formatEventDate(event.startAt, event.timezone)}
		</p>
		<h3 class="font-montserrat text-lg font-bold text-foreground">{event.name}</h3>

		{#if event.location}
			<p class="font-inter text-sm text-muted">📍 {event.location}</p>
		{/if}

		<!-- Attendees: public sample + count (only when host shows the list) -->
		{#if event.guestCount}
			<div class="flex items-center gap-2">
				{#if event.guests.length}
					<div class="flex -space-x-2">
						{#each event.guests as guest (guest.name)}
							{#if guest.avatarUrl}
								<img
									src={guest.avatarUrl}
									alt={guest.name}
									loading="lazy"
									class="h-6 w-6 rounded-full border-2 border-white object-cover"
								/>
							{/if}
						{/each}
					</div>
				{/if}
				<span class="font-inter text-sm text-muted">{event.guestCount} going</span>
			</div>
		{/if}

		<div class="mt-auto pt-2">
			<Button
				href={event.url}
				target="_blank"
				rel="noopener"
				variant="primary"
				size="sm"
				class="w-full"
			>
				{event.isSoldOut ? 'View event' : 'Register'}
			</Button>
		</div>
	</div>
</article>

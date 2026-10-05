<script lang="ts">
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
	import type { ProviderId } from '../providers';

	interface Props {
		id: ProviderId;
		class?: string;
	}

	let { id, class: className = 'size-5' }: Props = $props();

	const ICONS = {
		discord: DiscordIcon,
		x: XTwitterIcon,
		instagram: InstagramIcon,
		github: GitHubIcon
	};
</script>

{#if id === 'luma'}
	<!-- Lu.ma has no icon in the set: a simple event-ticket glyph. -->
	<svg
		class={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6Z"
		/>
		<path
			d="M12 9.2l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 11.3l2-.3Z"
			fill="currentColor"
			stroke-width="1"
		/>
	</svg>
{:else}
	{@const Icon = ICONS[id]}
	<Icon class={className} />
{/if}

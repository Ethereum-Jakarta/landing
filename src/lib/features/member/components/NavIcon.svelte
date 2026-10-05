<script lang="ts">
	interface Props {
		name: 'id' | 'gas' | 'chat';
		class?: string;
	}

	let { name, class: className = 'size-5' }: Props = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'id'}
		<rect x="3" y="5" width="18" height="14" rx="3" />
		<circle cx="9" cy="11" r="2.2" />
		<path d="M5.8 16.2c.6-1.5 1.8-2.3 3.2-2.3s2.6.8 3.2 2.3M14.5 10h3.5M14.5 13.5h2.5" />
	{:else if name === 'gas'}
		<path d="M5 20V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14M4 20h12M8 8h4" />
		<path d="M15 10h1.5a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 0 3 0V8.5L18.5 6" />
	{:else}
		<path
			d="M20 12c0 4-3.6 7-8 7-1.2 0-2.3-.2-3.3-.6L4 20l1.3-3.6C4.5 15.1 4 13.6 4 12c0-4 3.6-7 8-7s8 3 8 7Z"
		/>
		<path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke-width="2.6" />
	{/if}
</svg>

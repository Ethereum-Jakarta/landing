<script lang="ts">
	interface Props {
		class?: string;
		flip?: boolean;
		/** Hero birds flap via the hero timeline (`data-a="wing"`); the rest use ambient `data-wing`. */
		hero?: boolean;
	}

	let { class: className = '', flip = false, hero = false }: Props = $props();
</script>

<svg viewBox="0 0 44 40" class="h-auto overflow-visible {flip ? '-scale-x-100' : ''} {className}">
	<use href="#bird" />
	{#if hero}
		<ellipse data-a="wing" cx="18" cy="20" rx="10" ry="5" class="fill-ink-wing" />
	{:else}
		<ellipse data-wing cx="18" cy="20" rx="10" ry="5" class="fill-ink-wing" />
	{/if}
</svg>

<script lang="ts">
	import Bird from './Bird.svelte';

	interface Props {
		/** Position/visibility utilities for the flock (e.g. `top-[17%]`). */
		class?: string;
		/** Seconds to cross the section. */
		dur: number;
		dir?: 'left' | 'right';
		/** One entry per bird: offset + width utilities. */
		birds: { class: string }[];
	}

	let { class: className = '', dur, dir = 'right', birds }: Props = $props();
</script>

<span
	aria-hidden="true"
	data-amb="cross"
	data-dur={dur}
	data-dir={dir}
	class="pointer-events-none absolute left-0 z-1 h-11 w-16 {className}"
>
	{#each birds as bird, i (i)}
		<span data-amb="bob" class="absolute {bird.class}">
			<Bird class="block w-full" flip={dir === 'left'} />
		</span>
	{/each}
</span>

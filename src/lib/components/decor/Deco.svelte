<script lang="ts">
	interface Props {
		/** Sprite symbol id, without `#`. */
		icon: string;
		viewBox: string;
		/** Position, width, and text color utilities. */
		class?: string;
		/** Scroll parallax depth. */
		depth?: 'far' | 'mid' | 'near';
		/** Ambient loop(s), e.g. `twinkle`, `drift-right`, `rotate-slow`. */
		amb?: string;
		amp?: number;
		/** Extra hook on the inner svg (e.g. `rm-shard`). */
		hook?: string;
	}

	let { icon, viewBox, class: className = '', depth, amb, amp, hook }: Props = $props();
</script>

<span aria-hidden="true" data-depth={depth} class="pointer-events-none absolute {className}">
	<svg
		data-amb={amb}
		data-amp={amp}
		data-a={hook}
		{viewBox}
		class="block h-auto w-full overflow-visible"
	>
		<use href="#{icon}" />
	</svg>
</span>

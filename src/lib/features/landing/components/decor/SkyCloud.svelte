<script lang="ts">
	interface Props {
		/** Position, width, opacity, and text color utilities. */
		class?: string;
		flip?: boolean;
	}

	let { class: className = '', flip = false }: Props = $props();
</script>

<svg data-cloud viewBox="0 0 479 97" class="absolute {className}">
	<use href="#ethjkt-cloud" transform={flip ? 'matrix(-1 0 0 1 479 0)' : undefined} />
</svg>

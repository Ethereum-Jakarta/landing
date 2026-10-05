<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** id for the heading so the section can use aria-labelledby. */
		id: string;
		title: string;
		sub?: string;
		/** Extra decoration positioned around the heading (sparkles etc.). */
		children?: Snippet;
	}

	let { id, title, sub, children }: Props = $props();
</script>

<!-- `sec-title` / `sec-sub` hooks get the shared scroll-in reveal from motion.ts. -->
<div class="relative px-5 text-center">
	<h2 {id} data-a="sec-title" class="m-0 font-montserrat text-h2 font-extrabold text-foreground">
		{title}
	</h2>
	{@render children?.()}
	{#if sub}
		<p data-a="sec-sub" class="mx-auto mt-3 max-w-[52ch] text-body-lg text-muted">{sub}</p>
	{/if}
</div>

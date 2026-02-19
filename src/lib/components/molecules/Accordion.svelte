<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import AccordionItem from '../atoms/AccordionItem.svelte';

	type AccordionItemData = {
		id: string;
		title: string;
		content: string;
	};

	interface Props {
		items?: AccordionItemData[];
		allowMultiple?: boolean;
		children?: Snippet;
		class?: string;
	}

	let { items = [], allowMultiple = false, children, class: className = '' }: Props = $props();

	let openItems = new SvelteSet<string>();

	function toggleItem(id: string) {
		if (allowMultiple) {
			if (openItems.has(id)) {
				openItems.delete(id);
			} else {
				openItems.add(id);
			}
		} else {
			if (openItems.has(id)) {
				openItems.clear();
			} else {
				openItems.clear();
				openItems.add(id);
			}
		}
	}

	function isOpen(id: string): boolean {
		return openItems.has(id);
	}
</script>

<div class="divide-y divide-foreground/10 {className}">
	{#if items.length > 0}
		{#each items as item (item.id)}
			<AccordionItem title={item.title} open={isOpen(item.id)} onToggle={() => toggleItem(item.id)}>
				{item.content}
			</AccordionItem>
		{/each}
	{:else if children}
		{@render children()}
	{/if}
</div>

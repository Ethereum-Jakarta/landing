<script lang="ts">
	import { page } from '$app/state';
	import NavLink from '$lib/components/atoms/NavLink.svelte';
	import { isActive, type NavItem } from '$lib/nav';

	interface Props {
		items: NavItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<nav class="rounded-full border border-tertiary/20 px-6 py-3 lg:px-8 {className}">
	<ul class="flex items-center justify-center gap-6 overflow-x-auto whitespace-nowrap lg:gap-8">
		{#each items as item (item.href)}
			<li>
				{#if item.soon}
					<span class="flex items-center gap-1.5 font-inter text-muted">
						{item.label}
						<span
							class="rounded-full bg-muted/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
						>
							Soon
						</span>
					</span>
				{:else}
					<NavLink href={item.href} active={isActive(item.href, page.url.pathname)}>
						{item.label}
					</NavLink>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

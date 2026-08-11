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
				<NavLink href={item.href} active={isActive(item.href, page.url.pathname)}>
					{item.label}
				</NavLink>
			</li>
		{/each}
	</ul>
</nav>

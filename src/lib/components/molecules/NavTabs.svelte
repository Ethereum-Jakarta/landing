<script lang="ts">
	import NavLink from '$lib/components/atoms/NavLink.svelte';

	interface NavItem {
		label: string;
		href: string;
	}

	interface Props {
		items: NavItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<nav class="rounded-full border border-tertiary/20 px-8 py-3 {className}">
	<ul class="flex items-center gap-8">
		{#each items as item (item.href)}
			<li>
				<NavLink href={item.href}>{item.label}</NavLink>
			</li>
		{/each}
	</ul>
</nav>

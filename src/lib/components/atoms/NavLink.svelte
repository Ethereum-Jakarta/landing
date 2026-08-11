<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		children: Snippet;
		class?: string;
		active?: boolean;
	}

	let { href, children, class: className = '', active = false }: Props = $props();
</script>

<a
	{href}
	aria-current={active ? 'page' : undefined}
	class="font-inter transition-colors hover:text-primary {active
		? 'font-semibold text-primary'
		: 'text-tertiary'} {className}"
>
	{@render children()}
</a>

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
	class="font-inter text-tertiary transition-colors hover:text-primary {active
		? 'text-primary'
		: ''} {className}"
>
	{@render children()}
</a>

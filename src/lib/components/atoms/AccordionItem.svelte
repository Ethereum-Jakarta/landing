<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		open?: boolean;
		onToggle?: () => void;
		children: Snippet;
		class?: string;
	}

	let { title, open = false, onToggle, children, class: className = '' }: Props = $props();

	function handleToggle() {
		if (onToggle) {
			onToggle();
		}
	}
</script>

<div class="border-b border-foreground/10 {className}">
	<button
		type="button"
		class="flex w-full items-center justify-between py-4 text-left font-inter font-bold text-foreground transition-colors hover:text-primary"
		onclick={handleToggle}
		aria-expanded={open}
	>
		<span>{title}</span>
		<svg
			class="h-5 w-5 shrink-0 transition-transform duration-300 {open ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>
	<div
		class="grid transition-all duration-300 ease-in-out {open
			? 'grid-rows-[1fr] opacity-100'
			: 'grid-rows-[0fr] opacity-0'}"
	>
		<div class="overflow-hidden">
			<div class="pb-4 text-muted">
				{@render children()}
			</div>
		</div>
	</div>
</div>

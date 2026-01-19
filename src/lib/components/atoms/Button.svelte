<script lang="ts">
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		children: Snippet;
		class?: string;
		href?: string;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		size = 'md',
		children,
		class: className = '',
		href,
		...rest
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-inter font-semibold rounded-full transition-transform hover:scale-105';

	const variantClasses: Record<ButtonVariant, string> = {
		primary: 'bg-primary text-primary-foreground',
		secondary: 'bg-secondary text-secondary-foreground',
		tertiary: 'bg-tertiary text-tertiary-foreground'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};
</script>

{#if href}
	<a
		{href}
		class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
		{...rest}
	>
		{@render children()}
	</a>
{:else}
	<button class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}" {...rest}>
		{@render children()}
	</button>
{/if}

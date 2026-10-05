<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * primary   — the one main action in a section (gold)
	 * tertiary  — strong secondary action (navy)
	 * secondary — soft alternative on light surfaces (sky)
	 * ghost     — low-emphasis action (text with hover wash)
	 */
	type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		/** Shows a spinner and blocks clicks while an action is in flight. */
		loading?: boolean;
		disabled?: boolean;
		children: Snippet;
		class?: string;
		href?: string;
		[key: string]: unknown;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		children,
		class: className = '',
		href,
		...rest
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center gap-2 rounded-full font-inter font-semibold transition-colors duration-200 active:translate-y-px aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50';

	const variantClasses: Record<ButtonVariant, string> = {
		primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
		secondary: 'bg-secondary text-secondary-foreground hover:bg-sky-mid',
		tertiary: 'bg-tertiary text-tertiary-foreground hover:text-primary',
		ghost: 'bg-transparent text-current hover:bg-foreground/7'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'h-9 px-4 text-sm',
		md: 'h-11 px-6 text-[15px]',
		lg: 'h-[52px] px-[30px] text-base',
		icon: 'size-11'
	};

	const classes = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

{#snippet content()}
	{#if loading}
		<span
			aria-hidden="true"
			class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
		></span>
	{/if}
	{@render children()}
{/snippet}

{#if href}
	<a {href} class={classes} aria-disabled={disabled || loading || undefined} {...rest}>
		{@render content()}
	</a>
{:else}
	<button
		type="button"
		class={classes}
		disabled={disabled || loading}
		aria-busy={loading || undefined}
		{...rest}
	>
		{@render content()}
	</button>
{/if}

<script lang="ts">
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';
	import { NAV_ITEMS } from '../data';

	interface Props {
		scrolled: boolean;
		active: string;
		menuOpen: boolean;
		/** Signed-in member (SIWE session), or null for visitors. */
		user: { walletAddress: string } | null;
		onToggleMenu: () => void;
	}

	let { scrolled, active, menuOpen, user, onToggleMenu }: Props = $props();

	const shortAddress = $derived(
		user ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}` : ''
	);
</script>

<header
	class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] {scrolled
		? 'px-4 py-3'
		: 'px-[clamp(16px,3vw,48px)] py-5'}"
>
	<nav
		aria-label="Primary"
		class="pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full transition-[max-width,padding,background-color,box-shadow] duration-[600ms,500ms,400ms,400ms] ease-[cubic-bezier(.2,.8,.2,1)] {scrolled
			? 'max-w-[980px] bg-background py-2 pr-2 pl-5 shadow-pill'
			: 'max-w-[1600px] bg-background/0 px-0 py-1 shadow-none-pill'}"
	>
		<a href="#top" aria-label="ETHJKT home" data-a="logo" class="flex flex-none items-center">
			<img src={logoSrc} alt="ETHJKT" class="block h-8 w-auto" />
		</a>
		<div
			class="flex items-center gap-0.5 rounded-full border border-foreground/25 p-1 max-md:hidden"
		>
			{#each NAV_ITEMS as item (item.label)}
				<a
					href={item.href}
					class="rounded-full px-[22px] py-2 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-foreground/7 {item.section &&
					item.section === active &&
					scrolled
						? 'bg-primary/32'
						: 'bg-foreground/0'}">{item.label}</a
				>
			{/each}
		</div>
		<div class="flex items-center gap-2">
			{#if user}
				<a
					href="/verify"
					title={user.walletAddress}
					class="flex h-10 items-center gap-2 rounded-full bg-tertiary px-4 text-sm font-semibold text-tertiary-foreground transition-colors hover:text-primary"
				>
					<span aria-hidden="true" class="size-2 rounded-full bg-primary"></span>
					<span>My Hub</span>
					<span class="font-normal opacity-70 max-lg:hidden">{shortAddress}</span>
				</a>
			{:else}
				<a
					href="/login"
					class="flex h-10 items-center rounded-full bg-tertiary px-5 text-sm font-semibold text-tertiary-foreground transition-colors hover:text-primary"
					>Sign in</a
				>
			{/if}
			<button
				type="button"
				aria-label="Menu"
				aria-expanded={menuOpen}
				onclick={onToggleMenu}
				class="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border border-foreground/25 bg-background md:hidden"
			>
				<span class="h-0.5 w-[18px] rounded-xs bg-foreground"></span>
				<span class="h-0.5 w-[18px] rounded-xs bg-foreground"></span>
			</button>
		</div>
	</nav>
</header>

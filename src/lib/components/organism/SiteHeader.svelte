<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';

	interface Props {
		/** Section currently in view on the landing page (highlights its nav item). */
		active?: string;
	}

	let { active = '' }: Props = $props();

	const NAV = [
		{ label: 'About', href: '/#about', section: 'about' },
		{ label: 'Events', href: '/events', section: 'events' },
		{ label: 'FAQ', href: '/#faq', section: 'faq' }
	];
	const MENU = [
		{ label: 'About', href: '/#about' },
		{ label: 'Events', href: '/events' },
		{ label: 'What We Run', href: '/#programs' },
		{ label: 'Team', href: '/#team' },
		{ label: 'FAQ', href: '/#faq' }
	];

	const user = $derived(page.data.user as { walletAddress: string } | null | undefined);
	const short = $derived(
		user ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}` : ''
	);
	const isCurrent = (item: (typeof NAV)[number]) =>
		item.href === page.url.pathname ||
		(page.url.pathname === '/' && scrolled && item.section === active);

	let scrolled = $state(false);
	let menuOpen = $state(false);
	let burger = $state<HTMLButtonElement>();
	let menu = $state<HTMLElement>();

	onMount(() => {
		const onScroll = () => (scrolled = window.scrollY > 40);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Open menu: lock page scroll, make the page behind it inert, focus the first link.
	$effect(() => {
		if (!menuOpen) return;
		const main = document.getElementById('main');
		const html = document.documentElement;
		const prevOverflow = html.style.overflow;
		html.style.overflow = 'hidden';
		main?.setAttribute('inert', '');
		tick().then(() => menu?.querySelector('a')?.focus());
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') close(true);
		};
		window.addEventListener('keydown', onKey);
		return () => {
			html.style.overflow = prevOverflow;
			main?.removeAttribute('inert');
			window.removeEventListener('keydown', onKey);
		};
	});

	function close(returnFocus = false) {
		menuOpen = false;
		if (returnFocus) burger?.focus();
	}
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-tertiary px-4 py-2 text-sm font-semibold text-tertiary-foreground focus:translate-y-0"
	>Skip to content</a
>

<header
	class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] {scrolled
		? 'px-4 py-3'
		: 'px-[clamp(16px,3vw,48px)] py-5'}"
>
	<nav
		aria-label="Primary"
		class="pointer-events-auto flex w-full items-center justify-between gap-4 rounded-full transition-[max-width,padding,background-color,box-shadow] duration-[600ms,500ms,400ms,400ms] ease-[cubic-bezier(.2,.8,.2,1)] {scrolled ||
		menuOpen
			? 'max-w-[980px] bg-background py-2 pr-2 pl-5 shadow-pill'
			: 'max-w-[1600px] bg-background/0 px-0 py-1 shadow-none-pill'}"
	>
		<a href="/" aria-label="ETHJKT home" data-a="logo" class="flex flex-none items-center">
			<img src={logoSrc} alt="ETHJKT" class="block h-8 w-auto" />
		</a>
		<ul
			class="flex items-center gap-0.5 rounded-full border border-foreground/25 p-1 max-md:hidden"
		>
			{#each NAV as item (item.label)}
				{@const current = isCurrent(item)}
				<li>
					<a
						href={item.href}
						aria-current={current
							? item.href === page.url.pathname
								? 'page'
								: 'location'
							: undefined}
						class="block rounded-full px-[22px] py-2 text-sm font-medium text-foreground transition-colors duration-300 {current
							? 'bg-primary/32'
							: 'hover:bg-foreground/7'}">{item.label}</a
					>
				</li>
			{/each}
		</ul>
		<div class="flex items-center gap-2">
			{#if user}
				<a
					href="/verify"
					title={user.walletAddress}
					class="flex h-10 items-center gap-2 rounded-full bg-tertiary px-4 text-sm font-semibold text-tertiary-foreground transition-colors hover:text-primary"
				>
					<span aria-hidden="true" class="size-2 rounded-full bg-primary"></span>
					<span>My Hub</span>
					<span class="font-normal opacity-70 max-lg:hidden">{short}</span>
				</a>
			{:else}
				<a
					href="/login"
					class="flex h-10 items-center rounded-full bg-tertiary px-5 text-sm font-semibold text-tertiary-foreground transition-colors hover:text-primary"
					>Sign in</a
				>
			{/if}
			<button
				bind:this={burger}
				type="button"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="site-menu"
				onclick={() => (menuOpen ? close() : (menuOpen = true))}
				class="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-foreground/25 bg-background md:hidden"
			>
				<span
					class="absolute h-0.5 w-[18px] rounded-xs bg-foreground transition-transform duration-300 {menuOpen
						? 'rotate-45'
						: '-translate-y-[3.5px]'}"
				></span>
				<span
					class="absolute h-0.5 w-[18px] rounded-xs bg-foreground transition-transform duration-300 {menuOpen
						? '-rotate-45'
						: 'translate-y-[3.5px]'}"
				></span>
			</button>
		</div>
	</nav>
</header>

{#if menuOpen}
	<nav
		bind:this={menu}
		id="site-menu"
		aria-label="Menu"
		class="fixed inset-0 z-48 flex flex-col overflow-y-auto bg-linear-to-b from-secondary to-background px-6 pt-[110px] pb-8 md:hidden"
	>
		<ul class="flex flex-col gap-1.5">
			{#each MENU as item (item.label)}
				<li>
					<a
						href={item.href}
						onclick={() => close()}
						class="block py-1 font-montserrat text-[clamp(32px,9vw,44px)] leading-[1.2] font-bold tracking-[-0.02em] text-foreground"
						>{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

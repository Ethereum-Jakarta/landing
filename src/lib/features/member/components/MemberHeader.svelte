<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import logoSrc from '$lib/assets/logo-ethjkt-light.png';
	import { MEMBER_NAV, shortAddress } from '../nav';
	import NavIcon from './NavIcon.svelte';

	interface Props {
		walletAddress: string;
	}

	let { walletAddress }: Props = $props();

	let signingOut = $state(false);

	async function signOut() {
		signingOut = true;
		const { logout } = await import('$lib/client/wallet');
		await logout();
		await goto('/', { invalidateAll: true });
	}
</script>

<a
	href="#main"
	class="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-tertiary px-4 py-2 text-sm font-semibold text-tertiary-foreground focus:translate-y-0"
	>Skip to content</a
>

<!-- Same floating pill as the landing header (scrolled state), so the hub feels like one site. -->
<header class="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-3">
	<div
		class="pointer-events-auto flex w-full max-w-[980px] items-center justify-between gap-3 rounded-full bg-background p-2 shadow-pill md:grid md:grid-cols-[1fr_auto_1fr]"
	>
		<a
			href="/"
			aria-label="ETHJKT home"
			class="flex flex-none items-center justify-self-start pl-3"
		>
			<img src={logoSrc} alt="ETHJKT" width="190" height="86" class="block h-10 w-auto" />
		</a>

		<nav aria-label="Member" class="max-md:hidden">
			<ul class="flex items-center gap-0.5 rounded-full border border-foreground/25 p-1">
				{#each MEMBER_NAV as item (item.href)}
					{@const current = page.url.pathname === item.href}
					<li>
						<a
							href={item.href}
							aria-current={current ? 'page' : undefined}
							class="flex items-center gap-2 rounded-full px-[18px] py-2 text-sm font-medium text-foreground transition-colors duration-300 {current
								? 'bg-primary/32'
								: 'hover:bg-foreground/7'}"
						>
							<NavIcon name={item.icon} class="size-4" />
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="flex items-center gap-1.5 justify-self-end">
			<span
				title={walletAddress}
				class="flex h-10 items-center gap-2 rounded-full bg-tertiary px-4 text-sm font-semibold text-tertiary-foreground"
			>
				<span aria-hidden="true" class="size-2 rounded-full bg-primary"></span>
				<span class="sr-only">Signed in as</span>
				{shortAddress(walletAddress)}
			</span>
			<button
				type="button"
				onclick={signOut}
				disabled={signingOut}
				aria-label="Sign out"
				title="Sign out"
				class="flex size-10 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/7 hover:text-foreground disabled:opacity-50"
			>
				<svg
					class="size-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
				</svg>
			</button>
		</div>
	</div>
</header>

<!-- Phones: destinations live at the bottom, within thumb reach. -->
<nav
	aria-label="Member"
	class="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
>
	<ul class="grid grid-cols-3">
		{#each MEMBER_NAV as item (item.href)}
			{@const current = page.url.pathname === item.href}
			<li>
				<a
					href={item.href}
					aria-current={current ? 'page' : undefined}
					class="flex flex-col items-center gap-1 py-2 text-[11px] font-semibold {current
						? 'text-foreground'
						: 'text-muted'}"
				>
					<span
						class="flex h-8 w-14 items-center justify-center rounded-full transition-colors {current
							? 'bg-primary/40'
							: ''}"
					>
						<NavIcon name={item.icon} />
					</span>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

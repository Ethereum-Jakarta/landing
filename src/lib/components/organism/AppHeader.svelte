<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';

	interface Props {
		walletAddress: string;
	}

	let { walletAddress }: Props = $props();

	const NAV = [
		{ label: 'Hub', href: '/verify' },
		{ label: 'Gas Tanks', href: '/faucet' },
		{ label: 'Agent', href: '/chat' }
	];

	const short = $derived(`${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`);
	let signingOut = $state(false);

	async function signOut() {
		signingOut = true;
		const { logout } = await import('$lib/client/wallet');
		await logout();
		await goto('/', { invalidateAll: true });
	}
</script>

<header class="sticky top-0 z-40 border-b border-foreground/8 bg-background/90 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
		<a href="/" aria-label="ETHJKT home" class="flex flex-none items-center">
			<img src={logoSrc} alt="ETHJKT" class="block h-8 w-auto" />
		</a>
		<nav aria-label="Member" class="max-sm:hidden">
			<ul class="flex items-center gap-1 rounded-full border border-foreground/15 p-1">
				{#each NAV as item (item.href)}
					{@const current = page.url.pathname === item.href}
					<li>
						<a
							href={item.href}
							aria-current={current ? 'page' : undefined}
							class="block rounded-full px-4 py-2 text-sm font-medium transition-colors {current
								? 'bg-primary/32 text-foreground'
								: 'text-foreground hover:bg-foreground/7'}">{item.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="flex items-center gap-2">
			<span
				title={walletAddress}
				class="hidden items-center gap-2 rounded-full bg-sky-wash px-3 py-1.5 text-xs font-medium text-foreground md:flex"
			>
				<span aria-hidden="true" class="size-2 rounded-full bg-success"></span>{short}
			</span>
			<button
				type="button"
				onclick={signOut}
				disabled={signingOut}
				class="h-9 cursor-pointer rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:bg-foreground/7 hover:text-foreground disabled:opacity-50"
			>
				{signingOut ? 'Signing out…' : 'Sign out'}
			</button>
		</div>
	</div>
	<!-- Small screens: the three destinations as a full-width tab bar. -->
	<nav aria-label="Member" class="border-t border-foreground/8 sm:hidden">
		<ul class="grid grid-cols-3">
			{#each NAV as item (item.href)}
				{@const current = page.url.pathname === item.href}
				<li>
					<a
						href={item.href}
						aria-current={current ? 'page' : undefined}
						class="flex h-11 items-center justify-center border-b-2 text-sm font-medium {current
							? 'border-primary text-foreground'
							: 'border-transparent text-muted'}">{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import NavTabs from '$lib/components/molecules/NavTabs.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import { siteNav } from '$lib/nav';

	let { class: className = '' }: { class?: string } = $props();

	// Populated for every route by the root layout load.
	const user = $derived(page.data.user as { walletAddress: string } | null | undefined);
	const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

	let busy = $state(false);

	async function connect() {
		busy = true;
		try {
			const { signIn } = await import('$lib/client/wallet');
			await signIn();
			await goto('/verify');
		} catch {
			// wallet modal dismissed or signature rejected — the full flow lives at /login
			await goto('/login?next=/verify');
		} finally {
			busy = false;
		}
	}

	async function doLogout() {
		const { logout } = await import('$lib/client/wallet');
		await logout();
		await goto('/');
	}
</script>

<!-- Wraps on mobile: logo + controls on row one, nav pill on row two. No JS drawer needed. -->
<header
	class="relative z-10 flex flex-wrap items-center justify-between gap-y-4 px-6 py-5 lg:px-16 {className}"
>
	<Logo height={32} class="md:order-1" />

	<div class="flex items-center gap-2 md:order-3">
		{#if user}
			<span class="hidden font-inter text-sm text-muted sm:inline">
				{short(user.walletAddress)}
			</span>
			<Button variant="ghost" size="sm" class="text-muted hover:text-foreground" onclick={doLogout}>
				Log out
			</Button>
		{:else}
			<Button size="sm" onclick={connect} disabled={busy}>
				{busy ? 'Connecting…' : 'Connect Wallet'}
			</Button>
		{/if}
	</div>

	<NavTabs items={siteNav} class="w-full md:order-2 md:w-auto" />
</header>

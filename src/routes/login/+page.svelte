<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/atoms/Button.svelte';

	type Wallet = typeof import('$lib/client/wallet');
	let wallet = $state<Wallet>();
	let busy = $state(false);
	let error = $state('');

	onMount(async () => {
		wallet = await import('$lib/client/wallet');
	});

	function connect() {
		error = '';
		wallet?.openWallet();
	}

	async function signIn() {
		if (!wallet) return;
		busy = true;
		error = '';
		try {
			await wallet.signIn();
			await goto(page.url.searchParams.get('next') ?? '/verify');
		} catch (e) {
			error = e instanceof Error ? e.message : 'Sign in failed';
		} finally {
			busy = false;
		}
	}
</script>

<main class="flex min-h-screen items-center justify-center bg-background px-6">
	<div class="w-full max-w-sm rounded-3xl border border-muted/20 p-8 text-center shadow-sm">
		<h1 class="font-montserrat text-2xl font-bold text-foreground">Sign in</h1>
		<p class="mt-2 font-inter text-sm text-muted">Connect your wallet to access the member hub.</p>

		<div class="mt-8 flex flex-col gap-3">
			<Button variant="secondary" onclick={connect} disabled={busy || !wallet}
				>Connect wallet</Button
			>
			<Button onclick={signIn} disabled={busy || !wallet}>
				{busy ? 'Signing in…' : 'Sign in'}
			</Button>
		</div>

		{#if error}
			<p class="mt-4 font-inter text-sm text-red-600">{error}</p>
		{/if}
	</div>
</main>

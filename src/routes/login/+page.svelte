<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import Dialog from '$lib/components/molecules/Dialog.svelte';
	import { friendlyMessage } from '$lib/utils/errors';

	type Wallet = typeof import('$lib/client/wallet');
	let wallet = $state<Wallet>();
	let busy = $state(false);
	let error = $state('');
	let open = $state(true);
	let signedIn = $state(false);

	onMount(async () => {
		wallet = await import('$lib/client/wallet');
	});

	async function signIn() {
		if (!wallet) return;
		busy = true;
		error = '';
		try {
			await wallet.signIn(); // opens the wallet modal if needed, waits, then signs
			signedIn = true;
			await goto(page.url.searchParams.get('next') ?? '/verify');
		} catch (e) {
			error = friendlyMessage(
				e instanceof Error ? e.message : '',
				"Sign in didn't complete. Please try again."
			);
		} finally {
			busy = false;
		}
	}

	function onClose() {
		if (!signedIn) goto('/'); // dismissing the login returns home
	}

	const PERKS = [
		'Link Discord, X, Lu.ma and Instagram in one Identity Hub',
		'Claim free testnet ETH on Sepolia and Base Sepolia',
		'Ask the ETHJKT agent about building on Ethereum'
	];
</script>

<svelte:head>
	<title>Sign in · ETHJKT</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	id="main"
	class="flex min-h-svh items-center justify-center bg-linear-to-b from-secondary to-background px-6"
>
	<Dialog bind:open title="Sign in to the member hub" onclose={onClose}>
		<ul class="flex flex-col gap-2 text-sm text-foreground">
			{#each PERKS as perk (perk)}
				<li class="flex gap-2">
					<svg
						class="mt-0.5 size-4 flex-none text-success"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
							clip-rule="evenodd"
						/>
					</svg>
					{perk}
				</li>
			{/each}
		</ul>

		<p class="mt-5 text-sm text-muted">
			You'll sign a message to prove you own your wallet. It's free: no gas, no transaction.
		</p>

		<Button class="mt-5 w-full" size="lg" onclick={signIn} loading={busy} disabled={!wallet}>
			{busy ? 'Check your wallet…' : 'Connect wallet'}
		</Button>

		{#if error}
			<Notice tone="danger" class="mt-4">{error}</Notice>
		{/if}

		<p class="mt-5 text-center text-sm text-muted">
			New to wallets?
			<a
				href="https://metamask.io/download/"
				target="_blank"
				rel="noopener"
				class="font-semibold text-foreground underline underline-offset-2">Get MetaMask</a
			>
		</p>
	</Dialog>
</main>

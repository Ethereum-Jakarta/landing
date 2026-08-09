<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/atoms/Button.svelte';
	import Dialog from '$lib/components/molecules/Dialog.svelte';

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
			error = e instanceof Error ? e.message : 'Sign in failed';
		} finally {
			busy = false;
		}
	}

	function onClose() {
		if (!signedIn) goto('/'); // dismissing the login returns home
	}
</script>

<main
	class="flex min-h-screen items-center justify-center bg-linear-to-b from-secondary to-background px-6"
>
	<Dialog bind:open title="Sign in" onclose={onClose}>
		<p class="font-inter text-sm text-muted">
			Connect your wallet to access the ethjkt member hub. You'll sign a message to prove ownership
			— no gas, no transaction.
		</p>

		<Button class="mt-6 w-full" onclick={signIn} disabled={busy || !wallet}>
			{busy ? 'Check your wallet…' : 'Connect wallet & sign in'}
		</Button>

		{#if error}
			<p class="mt-4 font-inter text-sm text-red-600">{error}</p>
		{/if}
	</Dialog>
</main>

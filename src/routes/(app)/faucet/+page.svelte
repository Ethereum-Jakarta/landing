<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	const chains = [
		{ chainId: 11155111, name: 'Sepolia', explorer: 'https://sepolia.etherscan.io/tx/' },
		{ chainId: 84532, name: 'Base Sepolia', explorer: 'https://sepolia.basescan.org/tx/' }
	] as const;

	type Result = { txHash: string } | { error: string; verify?: boolean };

	let pending = $state<number | null>(null);
	let results = $state<Record<number, Result>>({});

	async function claim(chainId: number) {
		pending = chainId;
		try {
			const res = await fetch('/api/faucet/claim', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ chainId, token: 'native' })
			});
			const body = await res.json().catch(() => ({}));
			if (res.ok && body.txHash) {
				results[chainId] = { txHash: body.txHash };
			} else if (res.status === 429) {
				results[chainId] = { error: 'Already claimed. Try again later.' };
			} else {
				results[chainId] = {
					error: body.message ?? 'Claim failed.',
					verify: res.status === 403 || res.status === 412
				};
			}
		} catch {
			results[chainId] = { error: 'Network error. Try again.' };
		} finally {
			pending = null;
		}
	}
</script>

<section class="mx-auto max-w-3xl px-6 py-16">
	<h1 class="font-montserrat text-3xl font-bold text-foreground">Gas Tanks</h1>
	<p class="mt-2 font-inter text-muted">Top up testnet gas for the launch chains.</p>

	<div class="mt-10 grid gap-6 sm:grid-cols-2">
		{#each chains as chain (chain.chainId)}
			{@const result = results[chain.chainId]}
			<div class="flex flex-col rounded-2xl border border-muted/20 bg-background p-6 shadow-sm">
				<h2 class="font-montserrat text-xl font-semibold text-foreground">{chain.name}</h2>
				<p class="mt-1 font-inter text-sm text-muted">Chain ID {chain.chainId}</p>

				<div class="mt-6 flex-1">
					{#if result && 'txHash' in result}
						<p class="font-inter text-sm text-foreground">Sent!</p>
						<a
							href="{chain.explorer}{result.txHash}"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-1 block truncate font-inter text-sm text-secondary underline"
						>
							{result.txHash}
						</a>
					{:else if result}
						<p class="font-inter text-sm text-foreground">{result.error}</p>
						{#if result.verify}
							<a href="/verify" class="mt-1 block font-inter text-sm text-secondary underline">
								Verify your accounts to claim
							</a>
						{/if}
					{/if}
				</div>

				<Button
					class="mt-6 w-full disabled:pointer-events-none disabled:opacity-50"
					onclick={() => claim(chain.chainId)}
					disabled={pending === chain.chainId}
				>
					{pending === chain.chainId ? 'Claiming…' : 'Claim'}
				</Button>
			</div>
		{/each}
	</div>
</section>

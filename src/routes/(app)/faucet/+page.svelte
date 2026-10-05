<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import { providerName, readError } from '$lib/utils/errors';

	let { data } = $props();

	const EXPLORERS: Record<number, string> = {
		11155111: 'https://sepolia.etherscan.io/tx/',
		84532: 'https://sepolia.basescan.org/tx/'
	};

	const linked = $derived(new Set<string>(data.links.map((l) => l.provider)));
	const missing = $derived(data.required.filter((p) => !linked.has(p)));

	type Result = { txHash: string } | { error: string; needsHub?: boolean };

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
			if (res.ok) {
				const body = await res.json().catch(() => ({}));
				results[chainId] = body.txHash
					? { txHash: body.txHash }
					: { error: "The claim didn't go through. Please try again." };
			} else {
				results[chainId] = {
					error: await readError(res, "The claim didn't go through. Please try again."),
					needsHub: res.status === 403 || res.status === 412
				};
			}
		} catch {
			results[chainId] = { error: 'Network error. Check your connection and try again.' };
		} finally {
			pending = null;
		}
	}
</script>

<svelte:head>
	<title>Gas Tanks · ETHJKT</title>
</svelte:head>

<div class="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
	<h1 class="font-montserrat text-3xl font-bold text-foreground">Gas Tanks</h1>
	<p class="mt-2 max-w-[56ch] text-body text-muted">
		Free testnet ETH for building and testing. One claim per chain per day, sent straight to your
		signed-in wallet.
	</p>

	{#if missing.length}
		<Notice tone="info" class="mt-6">
			Link {missing.map(providerName).join(', ')} to unlock claims.
			<a href="/verify" class="font-semibold underline underline-offset-2">Go to your Hub →</a>
		</Notice>
	{/if}

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		{#each data.chains as chain (chain.chainId)}
			{@const result = results[chain.chainId]}
			<section
				aria-labelledby="chain-{chain.chainId}"
				class="flex flex-col rounded-[28px] p-6 shadow-soft-ring"
			>
				<div class="flex items-baseline justify-between gap-3">
					<h2 id="chain-{chain.chainId}" class="font-montserrat text-xl font-bold text-foreground">
						{chain.name}
					</h2>
					<span class="text-xs text-muted">Chain ID {chain.chainId}</span>
				</div>
				<p class="mt-1 text-sm text-muted">{chain.amount} per claim</p>

				<div class="mt-5 flex-1" aria-live="polite">
					{#if result && 'txHash' in result}
						<Notice tone="success">
							Sent! It usually lands within a minute.
							<a
								href="{EXPLORERS[chain.chainId] ?? '#'}{result.txHash}"
								target="_blank"
								rel="noopener noreferrer"
								class="mt-1 block truncate font-semibold underline underline-offset-2"
								>View transaction</a
							>
						</Notice>
					{:else if result}
						<Notice tone="danger">
							{result.error}
							{#if result.needsHub}
								<a href="/verify" class="mt-1 block font-semibold underline underline-offset-2"
									>Finish linking in your Hub →</a
								>
							{/if}
						</Notice>
					{/if}
				</div>

				<Button
					class="mt-5 w-full"
					loading={pending === chain.chainId}
					disabled={missing.length > 0 || (!!result && 'txHash' in result)}
					onclick={() => claim(chain.chainId)}
				>
					{pending === chain.chainId ? 'Sending…' : `Claim ${chain.amount}`}
				</Button>
			</section>
		{/each}
	</div>
</div>

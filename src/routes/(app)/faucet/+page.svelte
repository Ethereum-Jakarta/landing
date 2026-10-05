<script lang="ts">
	import { onMount } from 'svelte';
	import ethCrystal from '$lib/assets/eth-crystal.webp';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import Deco from '$lib/components/decor/Deco.svelte';
	import PageHero from '$lib/features/member/components/PageHero.svelte';
	import GasTankCard from '$lib/features/member/components/GasTankCard.svelte';
	import { EXPLORERS, type TankState } from '$lib/features/member/faucet';
	import { providerName, readError } from '$lib/utils/errors';

	let { data } = $props();

	const linked = $derived(new Set<string>(data.links.map((l) => l.provider)));
	const missing = $derived(data.required.filter((p) => !linked.has(p)));

	// Per-chain UI state layered over what the server knows (locked / claimed today).
	let overrides = $state<Record<number, TankState>>({});
	const stateFor = (chain: (typeof data.chains)[number]): TankState =>
		overrides[chain.chainId] ??
		(chain.claimedToday
			? { kind: 'claimed', txHash: chain.claimedToday.txHash, fresh: false }
			: missing.length
				? { kind: 'locked' }
				: { kind: 'ready' });

	async function claim(chainId: number) {
		overrides[chainId] = { kind: 'sending' };
		try {
			const res = await fetch('/api/faucet/claim', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ chainId, token: 'native' })
			});
			if (res.ok) {
				const body = await res.json().catch(() => ({}));
				overrides[chainId] = body.txHash
					? { kind: 'claimed', txHash: body.txHash, fresh: true }
					: {
							kind: 'error',
							message: "The claim didn't go through. Please try again.",
							needsHub: false
						};
			} else {
				overrides[chainId] = {
					kind: 'error',
					message: await readError(res, "The claim didn't go through. Please try again."),
					needsHub: res.status === 403 || res.status === 412
				};
			}
		} catch {
			overrides[chainId] = {
				kind: 'error',
				message: 'Network error. Check your connection and try again.',
				needsHub: false
			};
		}
	}

	// Limits reset at 00:00 UTC; show that in the visitor's own clock (client-only).
	let resetAt = $state('');
	onMount(() => {
		const now = new Date();
		const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
		resetAt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
			next
		);
	});

	const STEPS = $derived([
		{
			title: 'Link your accounts',
			body: `${data.required.map(providerName).join(', ')}, in your Hub.`
		},
		{ title: 'Claim once a day', body: 'One claim per chain, sent straight to your wallet.' },
		{
			title: 'Build and test',
			body: 'Testnet ETH has no real value. It is for deploying and testing.'
		}
	]);
</script>

<svelte:head>
	<title>Gas Tanks · ETHJKT</title>
</svelte:head>

<PageHero
	eyebrow="Gas Tanks"
	title="Free testnet gas"
	sub="Top up Sepolia and Base Sepolia so you can deploy, test and break things without buying ETH."
>
	{#snippet aside()}
		<div class="relative flex flex-col items-center">
			<Deco icon="d-spark-4" viewBox="0 0 24 24" class="top-2 -left-6 w-6 text-primary" />
			<Deco icon="d-spark-4-thin" viewBox="0 0 24 24" class="top-16 -right-4 w-4 text-background" />
			<img
				src={ethCrystal}
				alt=""
				aria-hidden="true"
				class="w-[clamp(96px,11vw,140px)] motion-safe:animate-float"
			/>
			<div
				class="mt-5 flex items-center gap-4 rounded-full bg-background/85 px-5 py-2.5 text-sm text-foreground shadow-soft backdrop-blur"
			>
				<span><strong class="font-montserrat">{data.chains.length}</strong> chains</span>
				<span aria-hidden="true" class="h-4 w-px bg-foreground/15"></span>
				<span>
					Resets {#if resetAt}at <strong class="font-montserrat">{resetAt}</strong> your time{:else}daily{/if}
				</span>
			</div>
		</div>
	{/snippet}
</PageHero>

<div class="relative mx-auto -mt-6 flex max-w-5xl flex-col gap-10 px-5 pb-24">
	{#if missing.length}
		<Notice tone="info">
			Link {missing.map(providerName).join(', ')} to unlock claims.
			<a href="/verify" class="font-semibold underline underline-offset-2">Go to your Hub →</a>
		</Notice>
	{/if}

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each data.chains as chain (chain.chainId)}
			<GasTankCard
				name={chain.name}
				chainId={chain.chainId}
				amount={chain.amount}
				explorer={EXPLORERS[chain.chainId]}
				state={stateFor(chain)}
				onclaim={() => claim(chain.chainId)}
			/>
		{/each}
	</div>

	<section aria-labelledby="how-title">
		<h2 id="how-title" class="font-montserrat text-h3 font-bold text-foreground">How it works</h2>
		<ol class="mt-5 grid gap-4 sm:grid-cols-3">
			{#each STEPS as step, i (step.title)}
				<li class="rounded-[28px] bg-sky-mist p-5">
					<span
						class="flex size-8 items-center justify-center rounded-full bg-tertiary font-montserrat text-sm font-bold text-tertiary-foreground"
						>{i + 1}</span
					>
					<p class="mt-3 font-semibold text-foreground">{step.title}</p>
					<p class="mt-1 text-sm text-muted">{step.body}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>

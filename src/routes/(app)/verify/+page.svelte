<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import PageHero from '$lib/features/member/components/PageHero.svelte';
	import MembershipCard from '$lib/features/member/components/MembershipCard.svelte';
	import ProviderCard from '$lib/features/member/components/ProviderCard.svelte';
	import { PROVIDERS, type ProviderId } from '$lib/features/member/providers';
	import { providerName } from '$lib/utils/errors';

	let { data } = $props();

	const linked = $derived(new Map(data.links.map((l) => [l.provider as ProviderId, l])));
	const required = $derived(new Set((data.required ?? []) as ProviderId[]));
	const requiredList = $derived(PROVIDERS.filter((p) => required.has(p.id)));
	const optionalList = $derived(PROVIDERS.filter((p) => !required.has(p.id)));
	const requiredLinked = $derived(requiredList.filter((p) => linked.has(p.id)).length);
	const unlocked = $derived(requiredList.length > 0 && requiredLinked === requiredList.length);
	const nextUp = $derived(requiredList.find((p) => !linked.has(p.id)));

	const cardProviders = $derived(
		PROVIDERS.map((p) => ({
			id: p.id,
			label: p.label,
			linked: linked.has(p.id),
			required: required.has(p.id)
		}))
	);

	// OAuth callbacks redirect back with ?linked=<provider> or ?error=<provider>_taken.
	const banner = $derived.by(() => {
		const linkedQ = page.url.searchParams.get('linked');
		const errorQ = page.url.searchParams.get('error');
		if (errorQ) {
			const taken = /^(\w+)_taken$/.exec(errorQ);
			return {
				tone: 'danger' as const,
				text: taken
					? `That ${providerName(taken[1])} account is already linked to another wallet. Sign in with that wallet, or link a different account.`
					: "We couldn't link that account. Please try again."
			};
		}
		if (linkedQ) return { tone: 'success' as const, text: `${providerName(linkedQ)} linked.` };
		return null;
	});
</script>

<svelte:head>
	<title>Identity Hub · ETHJKT</title>
</svelte:head>

<PageHero
	eyebrow="Member hub"
	title="Your ETHJKT identity"
	sub="Link your community accounts in one place. Link the required ones to unlock free testnet gas."
>
	{#snippet aside()}
		<MembershipCard
			walletAddress={data.user.walletAddress}
			providers={cardProviders}
			{requiredLinked}
			requiredTotal={requiredList.length}
		/>
	{/snippet}
</PageHero>

<div class="relative mx-auto -mt-6 flex max-w-5xl flex-col gap-10 px-5 pb-24">
	{#if banner}
		<Notice tone={banner.tone}>{banner.text}</Notice>
	{/if}

	<!-- Always one obvious next action. -->
	{#if unlocked}
		<section
			aria-label="Next step"
			class="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-primary px-6 py-5 text-primary-foreground shadow-cta"
		>
			<div>
				<p class="font-montserrat text-h4 font-bold">Gas Tanks unlocked</p>
				<p class="mt-1 text-sm">
					Claim free testnet ETH on Sepolia and Base Sepolia, once per chain per day.
				</p>
			</div>
			<Button href="/faucet" variant="tertiary">Claim testnet gas →</Button>
		</section>
	{:else if nextUp}
		<section
			aria-label="Next step"
			class="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-background px-6 py-5 shadow-soft-ring"
		>
			<div>
				<p class="text-label font-bold text-muted uppercase">Next step</p>
				<p class="mt-1 font-montserrat text-h4 font-bold text-foreground">
					Link {nextUp.label}
					<span class="font-inter text-sm font-normal text-muted">
						· {requiredList.length - requiredLinked} left to unlock Gas Tanks
					</span>
				</p>
			</div>
			<Button href="#provider-{nextUp.id}">Start</Button>
		</section>
	{/if}

	<section aria-labelledby="required-title">
		<h2 id="required-title" class="font-montserrat text-h3 font-bold text-foreground">
			Required for Gas Tanks
		</h2>
		<p class="mt-1 text-sm text-muted">{requiredLinked} of {requiredList.length} linked</p>
		<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
			{#each requiredList as provider (provider.id)}
				<ProviderCard
					{provider}
					account={linked.get(provider.id)}
					required
					discordLive={data.discordLive ?? null}
				/>
			{/each}
		</div>
	</section>

	{#if optionalList.length}
		<section aria-labelledby="optional-title">
			<h2 id="optional-title" class="font-montserrat text-h3 font-bold text-foreground">
				Optional
			</h2>
			<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each optionalList as provider (provider.id)}
					<ProviderCard {provider} account={linked.get(provider.id)} required={false} />
				{/each}
			</div>
		</section>
	{/if}
</div>

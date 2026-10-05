<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import type { TankState } from '../faucet';

	interface Props {
		name: string;
		chainId: number;
		amount: string;
		explorer?: string;
		state: TankState;
		onclaim: () => void;
	}

	let { name, chainId, amount, explorer, state, onclaim }: Props = $props();

	// Gauge level: full when there's gas to claim, low once today's claim is used.
	const level = $derived(
		state.kind === 'claimed'
			? 14
			: state.kind === 'locked'
				? 0
				: state.kind === 'sending'
					? 55
					: 100
	);
	const status = $derived(
		{
			ready: { text: 'Ready to claim', cls: 'bg-success/10 text-success' },
			sending: { text: 'Sending…', cls: 'bg-info/10 text-info' },
			claimed: { text: 'Claimed today', cls: 'bg-foreground/7 text-muted' },
			locked: { text: 'Locked', cls: 'bg-primary/30 text-foreground' },
			error: { text: 'Try again', cls: 'bg-danger/10 text-danger' }
		}[state.kind]
	);
</script>

<article
	aria-labelledby="tank-{chainId}"
	class="flex gap-5 rounded-[28px] bg-background p-5 shadow-soft-ring sm:p-6"
>
	<!-- Tank gauge -->
	<div
		aria-hidden="true"
		class="relative h-40 w-16 flex-none overflow-hidden rounded-full border-2 border-foreground/10 bg-sky-mist"
	>
		<div
			class="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary to-primary-hover transition-[height] duration-700 ease-out"
			style="height: {level}%"
		>
			<div class="absolute inset-x-2 top-2 h-1 rounded-full bg-background/50"></div>
		</div>
		<div class="absolute inset-x-0 top-1/4 h-px bg-foreground/8"></div>
		<div class="absolute inset-x-0 top-1/2 h-px bg-foreground/8"></div>
		<div class="absolute inset-x-0 top-3/4 h-px bg-foreground/8"></div>
		{#if state.kind === 'locked'}
			<svg
				class="absolute top-1/2 left-1/2 size-6 -translate-1/2 text-muted"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<rect x="5" y="11" width="14" height="9" rx="2" />
				<path d="M8 11V8a4 4 0 0 1 8 0v3" />
			</svg>
		{/if}
	</div>

	<div class="flex min-w-0 flex-1 flex-col">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h2 id="tank-{chainId}" class="font-montserrat text-h4 font-bold text-foreground">{name}</h2>
			<span
				class="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase {status.cls}"
				>{status.text}</span
			>
		</div>
		<p class="text-xs text-muted">Chain ID {chainId} · testnet</p>

		<p
			class="mt-4 font-montserrat text-[clamp(26px,3vw,34px)] leading-none font-extrabold text-foreground"
		>
			{amount}
		</p>
		<p class="mt-1 text-sm text-muted">per claim, sent to your wallet</p>

		<div class="mt-auto pt-5" aria-live="polite">
			{#if state.kind === 'claimed'}
				<Notice tone="success">
					{state.fresh ? 'Sent! It usually lands within a minute.' : "You've claimed today."}
					{#if explorer}
						<a
							href="{explorer}{state.txHash}"
							target="_blank"
							rel="noopener noreferrer"
							class="mt-1 block font-semibold underline underline-offset-2">View transaction</a
						>
					{/if}
				</Notice>
			{:else if state.kind === 'error'}
				<Notice tone="danger" class="mb-3">
					{state.message}
					{#if state.needsHub}
						<a href="/verify" class="mt-1 block font-semibold underline underline-offset-2"
							>Finish linking in your Hub →</a
						>
					{/if}
				</Notice>
				<Button class="w-full" onclick={onclaim}>Try again</Button>
			{:else}
				<Button
					class="w-full"
					loading={state.kind === 'sending'}
					disabled={state.kind === 'locked'}
					onclick={onclaim}
				>
					{state.kind === 'sending'
						? 'Sending…'
						: state.kind === 'locked'
							? 'Link accounts to unlock'
							: `Claim ${amount}`}
				</Button>
			{/if}
		</div>
	</div>
</article>

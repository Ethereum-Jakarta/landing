<script lang="ts">
	import logoAlt from '$lib/assets/logo-ethjkt-2.png';
	import ethCrystal from '$lib/assets/eth-crystal.webp';
	import { shortAddress } from '../nav';
	import ProviderIcon from './ProviderIcon.svelte';
	import type { ProviderId } from '../providers';

	interface Props {
		walletAddress: string;
		providers: { id: ProviderId; label: string; linked: boolean; required: boolean }[];
		requiredLinked: number;
		requiredTotal: number;
	}

	let { walletAddress, providers, requiredLinked, requiredTotal }: Props = $props();

	const complete = $derived(requiredTotal > 0 && requiredLinked === requiredTotal);
</script>

<!-- A member card in the landing's principle-card language: tilted, navy, gold accents. -->
<div class="relative w-full max-w-[380px]">
	<img
		src={ethCrystal}
		alt=""
		aria-hidden="true"
		class="absolute -top-9 -right-2 z-10 w-[clamp(56px,6vw,76px)] rotate-12 motion-safe:animate-float md:-right-5"
	/>
	<article
		aria-label="Your ETHJKT member card"
		class="relative -rotate-2 overflow-hidden rounded-[28px] bg-tertiary p-6 text-tertiary-foreground shadow-flip transition-transform duration-500 hover:rotate-0"
	>
		<div
			aria-hidden="true"
			class="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1.5px,transparent_1.5px)] bg-size-[16px_16px]"
		></div>
		<div class="relative flex items-start justify-between">
			<img src={logoAlt} alt="ETHJKT" class="-ml-3 h-12 w-auto" />
			<span
				class="rounded-full px-3 py-1 text-label font-bold uppercase {complete
					? 'bg-primary text-primary-foreground'
					: 'bg-background/12 text-tertiary-foreground'}"
			>
				{complete ? 'Verified member' : 'Member'}
			</span>
		</div>

		<p class="relative mt-8 text-label font-semibold text-footer-muted uppercase">Wallet</p>
		<p class="relative mt-1 font-montserrat text-2xl font-bold tracking-wide" title={walletAddress}>
			{shortAddress(walletAddress)}
		</p>

		<div class="relative mt-6 flex items-end justify-between gap-4">
			<ul class="flex -space-x-1.5" aria-label="Linked accounts">
				{#each providers as p (p.id)}
					<li
						title="{p.label}: {p.linked ? 'linked' : 'not linked'}"
						class="flex size-9 items-center justify-center rounded-full border-2 border-tertiary {p.linked
							? 'bg-primary text-primary-foreground'
							: 'bg-background/12 text-tertiary-foreground/50'}"
					>
						<ProviderIcon id={p.id} class="size-4" />
						<span class="sr-only">{p.label} {p.linked ? 'linked' : 'not linked'}</span>
					</li>
				{/each}
			</ul>
			<p class="text-right text-sm leading-tight">
				<span class="font-montserrat text-2xl font-extrabold">{requiredLinked}</span><span
					class="text-footer-muted">/{requiredTotal}</span
				>
				<span class="block text-xs text-footer-muted">required linked</span>
			</p>
		</div>

		<div
			class="relative mt-4 h-1.5 overflow-hidden rounded-full bg-background/15"
			role="progressbar"
			aria-label="Required accounts linked"
			aria-valuemin={0}
			aria-valuemax={requiredTotal}
			aria-valuenow={requiredLinked}
		>
			<div
				class="h-full rounded-full bg-primary transition-[width] duration-700"
				style="width: {requiredTotal ? (requiredLinked / requiredTotal) * 100 : 0}%"
			></div>
		</div>
	</article>
</div>

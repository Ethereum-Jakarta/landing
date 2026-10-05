<script lang="ts">
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';
	import aboutBlob from '../assets/about/about_left.svg';
	import ethCrystal from '../assets/shared/eth-crystal.webp';
	import EthArt from '../assets/EthArt.svelte';
	import { ROADMAP } from '../data';
	import Deco from './decor/Deco.svelte';

	interface Props {
		/** Desktop: sticky row that splits into cards and flips them as you scroll. */
		pinned: boolean;
	}

	let { pinned }: Props = $props();

	const faceClass = 'absolute inset-0 rounded-3xl backface-hidden';
	const frontClass = `${faceClass} flex flex-col items-center justify-center gap-3 border border-foreground/8 bg-background bg-[radial-gradient(color-mix(in_srgb,var(--color-foreground)_8%,transparent)_2px,transparent_2px)] bg-size-[22px_22px] p-6 text-center`;
	const backClass = `${faceClass} flex rotate-y-180 flex-col items-center overflow-hidden bg-background text-center shadow-flip`;
	const headingClass = 'm-0 font-montserrat text-h2 font-extrabold text-foreground';
</script>

{#snippet artFrame(r: (typeof ROADMAP)[number])}
	<div class="relative aspect-[1.35] w-full flex-none overflow-hidden rounded-2xl bg-sky-mist">
		<img
			src={aboutBlob}
			alt=""
			aria-hidden="true"
			class="absolute top-[16%] left-[5%] h-[70%] w-[90%] opacity-85"
		/>
		<img
			data-a="rm-art"
			src={r.img}
			alt={r.alt}
			loading="lazy"
			class="absolute top-[3%] left-[3%] block size-[94%] object-contain"
		/>
	</div>
{/snippet}

<section
	id="programs"
	aria-labelledby="programs-title"
	class="relative overflow-clip bg-background"
>
	<div
		data-a="ethart"
		aria-hidden="true"
		class="pointer-events-none absolute top-[28%] -right-[4%] w-[clamp(120px,14vw,220px)]"
	>
		<EthArt class="block h-auto w-full -scale-x-100" />
	</div>

	{#if pinned}
		<div data-a="rm-track" class="relative h-[240vh]">
			<div
				class="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden pt-[84px] pb-7"
			>
				<div
					data-a="rm-crystal"
					aria-hidden="true"
					class="pointer-events-none absolute top-[20%] left-[4%] w-[clamp(44px,4.4vw,70px)]"
				>
					<img data-a="crystal-float" src={ethCrystal} alt="" class="block h-auto w-full" />
				</div>
				<div
					data-a="rm-crystal"
					aria-hidden="true"
					class="pointer-events-none absolute right-[4.5%] bottom-[9%] w-[clamp(36px,3.4vw,56px)]"
				>
					<img
						data-a="crystal-float"
						src={ethCrystal}
						alt=""
						style="transform: rotate(14deg)"
						class="block h-auto w-full"
					/>
				</div>
				<Deco
					icon="d-eth-shard"
					viewBox="0 0 24 30"
					depth="mid"
					amb="rotate-slow"
					hook="rm-shard"
					class="top-[14%] left-[13%] w-[22px] text-primary"
				/>
				<Deco
					icon="d-eth-facet"
					viewBox="0 0 40 64"
					depth="far"
					amb="rotate-slow"
					hook="rm-shard"
					class="top-[12%] right-[14%] w-[30px] text-foreground/50"
				/>
				<Deco
					icon="d-eth-half"
					viewBox="0 0 40 46"
					depth="near"
					amb="rotate-slow"
					hook="rm-shard"
					class="right-[30%] bottom-[2%] w-[26px] text-secondary"
				/>
				<div data-a="rm-head" class="px-5 text-center">
					<h2 id="programs-title" class={headingClass}>What We Run</h2>
					<p class="mt-2.5 text-[clamp(15px,1.25vw,18px)] leading-[1.5] text-muted">
						Four ways to learn and build with us, all year round.
					</p>
				</div>
				<div
					data-a="rm-row"
					class="mt-[clamp(20px,4vh,40px)] flex h-[min(62vh,560px)] w-[min(92vw,1400px)] gap-0 perspective-[1800px]"
				>
					{#each ROADMAP as r (r.num)}
						<div data-a="rm-card" class="relative h-full min-w-0 flex-1">
							<div data-a="rm-inner" class="absolute inset-0 transform-3d">
								<div data-a="rm-front" class={frontClass}>
									<span
										class="absolute top-5 left-[22px] font-montserrat text-sm font-bold text-muted"
										>{r.num}</span
									>
									<img src={logoSrc} alt="" class="h-auto w-[clamp(72px,8vw,128px)]" />
									<h3
										class="m-0 font-montserrat text-[clamp(20px,2vw,28px)] font-bold text-foreground"
									>
										{r.title}
									</h3>
								</div>
								<div class="{backClass} p-[clamp(12px,1.1vw,18px)]">
									{@render artFrame(r)}
									<h3
										class="mt-[clamp(12px,1.6vh,20px)] flex-none font-montserrat text-[clamp(20px,1.8vw,26px)] leading-[1.2] font-bold text-foreground"
									>
										{r.title}
									</h3>
									<p
										class="mt-2.5 max-w-[34ch] text-[clamp(14px,1.05vw,16px)] leading-[1.55] text-muted"
									>
										{r.desc}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-[1100px] px-5 pt-[clamp(64px,10vh,110px)] pb-[clamp(40px,6vh,80px)]">
			<div class="text-center">
				<h2 id="programs-title" class={headingClass}>What We Run</h2>
				<p class="mt-2.5 text-body-lg text-muted">
					Four ways to learn and build with us, all year round.
				</p>
			</div>
			<div class="mt-9 grid gap-5 sm:grid-cols-2">
				{#each ROADMAP as r (r.num)}
					<div data-a="rm-card" class="relative h-[500px] perspective-[1600px]">
						<div data-a="rm-inner" class="absolute inset-0 transform-3d">
							<div class={frontClass}>
								<span
									class="absolute top-5 left-[22px] font-montserrat text-sm font-bold text-muted"
									>{r.num}</span
								>
								<img src={logoSrc} alt="" class="h-auto w-[100px]" />
								<h3 class="m-0 font-montserrat text-2xl font-bold text-foreground">{r.title}</h3>
							</div>
							<div class="{backClass} p-4">
								{@render artFrame(r)}
								<h3
									class="mt-[18px] flex-none font-montserrat text-2xl leading-[1.2] font-bold text-foreground"
								>
									{r.title}
								</h3>
								<p class="mt-2.5 text-[15px] leading-[1.55] text-muted">{r.desc}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>

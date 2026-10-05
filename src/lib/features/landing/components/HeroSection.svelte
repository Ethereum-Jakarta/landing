<script lang="ts">
	import { SOCIAL_LINKS } from '$lib/constants';
	import heroSkyline from '$lib/assets/hero-skyline-haze.webp';
	import Bird from '$lib/components/decor/Bird.svelte';
	import BirdFlock from '$lib/components/decor/BirdFlock.svelte';
	import Deco from '$lib/components/decor/Deco.svelte';
	import SkyCloud from '$lib/components/decor/SkyCloud.svelte';

	interface Props {
		headWord?: 'WEB3' | 'Ethereum';
	}

	let { headWord = 'WEB3' }: Props = $props();

	const wordMask = 'inline-block overflow-hidden px-[0.03em] pt-[0.08em] pb-[0.1em]';
</script>

<svelte:head>
	<link rel="preload" as="image" href={heroSkyline} />
</svelte:head>

<section
	id="top"
	data-a="hero"
	class="relative h-svh min-h-[640px] overflow-hidden bg-[linear-gradient(180deg,var(--color-secondary)_0%,var(--color-sky-mid)_40%,var(--color-sky-soft)_72%,var(--color-background)_100%)]"
>
	<div
		data-a="layer-bg"
		data-layer="bg"
		class="pointer-events-none absolute inset-0 will-change-transform"
	>
		<SkyCloud class="top-[12%] left-[17%] w-[clamp(90px,10vw,150px)] text-background" />
		<SkyCloud flip class="top-[19%] right-[5%] w-[clamp(110px,12vw,180px)] text-background" />
		<SkyCloud class="top-[8%] left-[58%] w-[clamp(60px,6vw,90px)] text-background opacity-60" />
	</div>
	<div
		data-a="layer-mid"
		data-layer="mid"
		class="pointer-events-none absolute inset-0 will-change-transform"
	>
		<SkyCloud class="top-[31%] -left-[2%] w-[clamp(160px,19vw,280px)] text-background" />
		<SkyCloud
			flip
			class="top-[56%] right-[3%] w-[clamp(120px,13vw,200px)] text-background opacity-85"
		/>
	</div>

	<div data-a="hero-details" aria-hidden="true" class="pointer-events-none absolute inset-0 z-2">
		<BirdFlock
			class="top-[17%]"
			dur={54}
			birds={[{ class: 'top-0 left-0 w-7' }, { class: 'top-[18px] left-[34px] w-[19px]' }]}
		/>
		<BirdFlock
			class="top-[38%] max-md:hidden"
			dur={72}
			dir="left"
			birds={[{ class: 'top-0 left-0 w-[17px]' }]}
		/>
		<Deco
			icon="d-cloud-wisp"
			viewBox="0 0 160 24"
			depth="far"
			amb="drift-right"
			amp={30}
			class="top-[45%] left-[11%] w-[clamp(80px,10vw,150px)] text-background opacity-75"
		/>
		<Deco
			icon="d-eth-facet"
			viewBox="0 0 40 64"
			depth="near"
			amb="rotate-slow"
			class="top-[60%] -right-4 w-[clamp(34px,3.2vw,52px)] text-background max-md:hidden"
		/>
	</div>

	<div
		data-a="hero-content"
		class="relative z-3 flex h-full flex-col items-center justify-center px-5 pt-[84px] pb-[7vh] text-center"
	>
		<div class="relative">
			<Deco
				icon="d-cloud-puff-02"
				viewBox="0 0 90 40"
				depth="far"
				amb="drift-right"
				amp={14}
				class="-top-[16%] -right-[7%] -z-1 w-[clamp(80px,9vw,140px)] text-background"
			/>
			<Deco
				icon="d-spark-4"
				viewBox="0 0 24 24"
				depth="mid"
				amb="twinkle"
				class="-top-[8%] -left-[4%] w-[clamp(18px,1.8vw,28px)] text-primary"
			/>
			<Deco
				icon="d-spark-4-thin"
				viewBox="0 0 24 24"
				depth="mid"
				amb="twinkle"
				class="top-[12%] left-[0.5%] w-[clamp(11px,1vw,15px)] text-background"
			/>
			<Deco
				icon="d-ring"
				viewBox="0 0 20 20"
				depth="near"
				amb="twinkle"
				class="top-1/2 -right-[3%] w-3.5 text-background max-md:hidden"
			/>
			<h1
				aria-label="Build the Future of {headWord} at ETHJKT"
				class="m-0 font-montserrat text-display font-light text-foreground"
			>
				<span aria-hidden="true" class="flex flex-wrap items-end justify-center gap-x-[0.24em]">
					<span class={wordMask}
						><span data-a="w-build" class="inline-block font-extrabold">Build</span></span
					>
					<span class="relative inline-block">
						<span
							data-a="carrier1"
							class="pointer-events-none absolute -top-[0.62em] -left-[0.46em] z-2"
						>
							<span data-a="bob" class="flex flex-col items-start">
								<Bird hero class="ml-[0.06em] w-[0.4em]" />
								<span
									data-a="tag1"
									style="transform: rotate(-12deg); transform-origin: 50% 0%"
									class="-mt-[0.05em] inline-block rounded-[0.4em] bg-primary px-[0.5em] pt-[0.28em] pb-[0.32em] font-inter text-[0.24em] leading-none font-bold tracking-normal text-foreground"
									>the</span
								>
							</span>
						</span>
						<span class={wordMask}
							><span data-a="w-future" class="inline-block font-light">Future</span></span
						>
					</span>
				</span>
				<span aria-hidden="true" class="flex flex-wrap items-end justify-center gap-x-[0.22em]">
					<span class="relative ml-[0.42em] inline-block">
						<span
							data-a="carrier2"
							class="pointer-events-none absolute bottom-[0.14em] -left-[0.66em] z-2"
						>
							<span data-a="bob" class="flex flex-col items-end">
								<Bird hero flip class="mr-[0.04em] w-[0.34em]" />
								<span
									data-a="tag2"
									style="transform: rotate(8deg); transform-origin: 50% 0%"
									class="-mt-[0.05em] inline-block rounded-[0.4em] bg-background px-[0.5em] pt-[0.3em] pb-[0.34em] font-inter text-[0.18em] leading-none font-bold tracking-normal text-foreground shadow-tag"
									>of</span
								>
							</span>
						</span>
						<span data-a="w-web3" class="inline-block pt-[0.08em] pb-[0.1em] font-light"
							>{headWord}</span
						>
					</span>
					<span class={wordMask}><span data-a="w-at" class="inline-block font-light">at</span></span
					>
					<span class={wordMask}
						><span data-a="w-ethjkt" class="inline-block font-extrabold">ETHJKT</span></span
					>
				</span>
			</h1>
		</div>
		<p
			data-a="hero-sub"
			class="mt-[clamp(14px,2.2vh,24px)] max-w-[46ch] text-body-lg text-balance text-ink-soft"
		>
			Jakarta's Ethereum community. Free meetups, workshops and hackathons for builders at every
			level.
		</p>
		<div
			data-a="hero-cta"
			class="relative mt-[clamp(24px,4.5vh,44px)] flex flex-col items-center gap-4"
		>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute -top-11 right-full mr-1.5 w-[clamp(70px,6.4vw,100px)] text-foreground max-md:hidden"
			>
				<svg data-a="cta-arrow" viewBox="0 0 120 80" class="block h-auto w-full overflow-visible">
					<g
						fill="none"
						stroke="currentColor"
						stroke-width="2.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path data-draw="load" d="M6 10C40 4 86 18 104 62" />
						<path data-draw="load" data-draw-delay="0.7" d="M92 54L104 62L106 47" />
					</g>
				</svg>
			</span>
			<!-- Lowest-friction next step for a newcomer: a real, dated event (no wallet needed). -->
			<a
				href="#events"
				data-magnetic
				class="inline-flex items-center gap-2.5 rounded-full bg-primary px-[30px] py-[15px] text-[clamp(15px,1.15vw,17px)] font-semibold text-primary-foreground shadow-cta transition-colors duration-250 hover:bg-primary-hover"
				>See upcoming events</a
			>
			<a
				href={SOCIAL_LINKS.discord}
				target="_blank"
				rel="noopener"
				class="text-sm font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
				>or join our Discord</a
			>
		</div>
	</div>

	<div
		data-a="hero-skyline"
		aria-hidden="true"
		class="pointer-events-none absolute -right-[2%] -bottom-[9.6vw] -left-[2%] z-2 aspect-[1344/327] will-change-transform"
	>
		<img src={heroSkyline} alt="" class="block size-full" />
	</div>
	<div
		aria-hidden="true"
		class="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-[18%] bg-[linear-gradient(180deg,transparent_0%,var(--color-background)_92%)]"
	></div>
	<div
		data-a="layer-fg"
		data-layer="fg"
		class="pointer-events-none absolute inset-x-0 bottom-0 z-4 h-[30%] will-change-transform"
	>
		<SkyCloud class="bottom-[22%] -left-[6%] w-[clamp(220px,30vw,460px)] text-background" />
		<SkyCloud flip class="-right-[8%] bottom-[4%] w-[clamp(240px,32vw,500px)] text-background" />
	</div>

	<div
		data-a="hero-cue"
		class="pointer-events-none absolute inset-x-0 bottom-[22px] z-5 flex flex-col items-center gap-2 text-[11px] font-semibold tracking-[.2em] text-muted"
	>
		SCROLL
		<span data-a="hero-cue-line" class="h-7 w-[1.5px] bg-muted"></span>
	</div>
</section>

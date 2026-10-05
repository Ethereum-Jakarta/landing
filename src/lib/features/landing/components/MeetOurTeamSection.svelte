<script lang="ts">
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';
	import EthArt from '../assets/EthArt.svelte';
	import { TEAM } from '../data';
	import BirdFlock from './decor/BirdFlock.svelte';
	import Deco from './decor/Deco.svelte';
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		/** Native horizontal scrolling (mobile / reduced motion) instead of the scroll-scrubbed track. */
		scrollable: boolean;
	}

	let { scrollable }: Props = $props();

	const faceClass = 'absolute inset-0 overflow-hidden rounded-[14px] shadow-photo backface-hidden';
</script>

<section
	id="team"
	aria-labelledby="team-title"
	class="relative overflow-hidden bg-background pt-[clamp(72px,13vh,150px)] pb-[clamp(56px,9vh,110px)]"
>
	<BirdFlock class="top-[5%] max-md:hidden" dur={62} birds={[{ class: 'top-0 left-0 w-[22px]' }]} />
	<Deco
		icon="d-eth-node"
		viewBox="0 0 60 40"
		depth="mid"
		amb="float-slow"
		class="top-[16%] left-[4%] w-[clamp(48px,5vw,80px)] text-foreground/40 max-md:hidden"
	/>
	<Deco
		icon="d-chain"
		viewBox="0 0 56 24"
		depth="near"
		amb="float-mid"
		class="top-[20%] right-[5%] w-[clamp(40px,4vw,64px)] text-secondary max-md:hidden"
	/>
	<div
		data-a="ethart"
		aria-hidden="true"
		class="pointer-events-none absolute top-[46%] -left-[4%] w-[clamp(120px,14vw,220px)]"
	>
		<EthArt class="block h-auto w-full" />
	</div>

	<SectionHeading
		id="team-title"
		title="Meet Our Team"
		sub="Say hi to the team making ETHJKT happen."
	>
		<Deco
			icon="d-spark-4"
			viewBox="0 0 24 24"
			depth="mid"
			amb="twinkle"
			class="-top-[18px] left-[calc(50%+min(220px,27vw))] w-[22px] text-primary"
		/>
		<Deco
			icon="d-spark-4-thin"
			viewBox="0 0 24 24"
			depth="mid"
			amb="twinkle"
			class="top-1.5 left-[calc(50%+min(250px,31vw))] w-[13px] text-foreground"
		/>
	</SectionHeading>

	<div
		data-a="team-viewport"
		class="relative mt-[clamp(28px,5vh,52px)] snap-x snap-proximity overflow-y-hidden pt-7 pb-11 [scrollbar-width:none] {scrollable
			? 'overflow-x-auto'
			: 'overflow-x-hidden'}"
	>
		<div
			data-a="team-track"
			class="mx-auto flex w-max gap-[clamp(14px,1.6vw,24px)] px-[clamp(20px,8vw,120px)] will-change-transform"
		>
			{#each TEAM as m (m.name)}
				<div
					data-a="tm"
					class="aspect-[3/4] w-[clamp(150px,15vw,220px)] flex-none snap-center perspective-[900px]"
				>
					<!-- Focusable so keyboard users get the same tilt/spread as pointer hover. -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<div
						data-a="tm-tilt"
						role="group"
						tabindex="0"
						aria-label="{m.name}, {m.role}"
						class="relative size-full cursor-pointer rounded-[14px] transform-3d"
					>
						<div data-a="tm-inner" class="absolute inset-0 transform-3d">
							<div class="{faceClass} bg-sky-wash">
								{#if m.image}
									<img src={m.image} alt={m.name} class="absolute inset-0 size-full object-cover" />
								{:else}
									<div class="absolute inset-0 flex items-center justify-center">
										<img src={logoSrc} alt="" class="w-1/2 opacity-25" />
									</div>
								{/if}
								<div
									class="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.45)_50%,rgb(0_0_0/0.8)_100%)]"
								></div>
								<div
									data-a="tm-shine"
									class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
								></div>
								<div class="pointer-events-none absolute inset-x-3 bottom-3 text-background">
									<div
										class="font-montserrat text-[clamp(14px,1.2vw,18px)] leading-[1.2] font-bold"
									>
										{m.name}
									</div>
									<div class="mt-0.5 text-[clamp(11px,0.85vw,13px)] leading-[1.3] opacity-92">
										{m.role}
									</div>
								</div>
							</div>
							<div
								aria-hidden="true"
								class="{faceClass} flex rotate-y-180 items-end justify-center bg-secondary bg-[radial-gradient(rgb(255_255_255/0.35)_2px,transparent_2px)] bg-size-[18px_18px]"
							>
								<img src="/team/card-back.png" alt="" class="block h-auto w-[86%]" />
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

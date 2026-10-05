<script lang="ts">
	import type { Snippet } from 'svelte';
	import skyline from '$lib/assets/hero-skyline-haze.webp';
	import Deco from '$lib/components/decor/Deco.svelte';
	import SkyCloud from '$lib/components/decor/SkyCloud.svelte';

	interface Props {
		eyebrow: string;
		title: string;
		sub: string;
		/** Right-hand visual (membership card, tank, …). */
		aside?: Snippet;
	}

	let { eyebrow, title, sub, aside }: Props = $props();
</script>

<!-- The landing hero's sky, calmer: static sparkles, slow CSS cloud drift, skyline at the base. -->
<section
	class="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-secondary)_0%,var(--color-sky-mid)_42%,var(--color-sky-soft)_76%,var(--color-background)_100%)] pt-[clamp(108px,14vh,140px)] pb-[clamp(64px,9vh,96px)]"
>
	<div aria-hidden="true" class="pointer-events-none absolute inset-0">
		<SkyCloud
			class="top-[18%] left-[4%] w-[clamp(90px,10vw,150px)] text-background motion-safe:animate-drift"
		/>
		<SkyCloud
			flip
			class="top-[30%] right-[3%] w-[clamp(110px,12vw,190px)] text-background opacity-90 motion-safe:animate-drift motion-safe:[animation-delay:-6s]"
		/>
		<SkyCloud
			class="top-[11%] left-[48%] w-[clamp(60px,6vw,90px)] text-background opacity-60 motion-safe:animate-drift motion-safe:[animation-delay:-11s]"
		/>
		<img
			src={skyline}
			alt=""
			class="absolute -bottom-[3vw] left-1/2 w-[max(1100px,104%)] max-w-none -translate-x-1/2 opacity-45"
		/>
		<div
			class="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,var(--color-background))]"
		></div>
	</div>

	<div
		class="relative mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
	>
		<div class="relative">
			<Deco
				icon="d-spark-4"
				viewBox="0 0 24 24"
				class="-top-6 -left-2 w-5 text-primary max-md:hidden"
			/>
			<p class="text-label font-bold text-ink-soft uppercase">{eyebrow}</p>
			<h1 class="mt-3 font-montserrat text-h2 font-extrabold text-foreground">{title}</h1>
			<p class="mt-4 max-w-[46ch] text-body-lg text-ink-soft">{sub}</p>
		</div>
		{#if aside}
			<div class="relative flex justify-center md:justify-end">
				{@render aside()}
			</div>
		{/if}
	</div>
</section>

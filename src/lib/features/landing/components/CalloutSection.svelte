<script lang="ts">
	import ctaSkyline from '../assets/cta/cta-skyline-white.webp';
	import Fly from '../assets/Fly.svelte';
	import Monas from '../assets/Monas.svelte';
	import Run1 from '../assets/Run1.svelte';
	import Run2 from '../assets/Run2.svelte';
	import Run3 from '../assets/Run3.svelte';
	import { SOCIALS } from '../data';
	import BirdFlock from './decor/BirdFlock.svelte';
	import Deco from './decor/Deco.svelte';
	import SkyCloud from './decor/SkyCloud.svelte';
</script>

<section
	id="join"
	aria-labelledby="join-title"
	data-a="join"
	class="relative flex min-h-[max(100svh,760px)] flex-col items-center overflow-hidden bg-[linear-gradient(180deg,var(--color-background)_0%,var(--color-sky-pale)_38%,var(--color-secondary)_100%)]"
>
	<div data-a="join-clouds" class="pointer-events-none absolute inset-0">
		<BirdFlock
			class="top-[15%]"
			dur={58}
			birds={[{ class: 'top-0 left-0 w-6' }, { class: 'top-4 left-[30px] w-4' }]}
		/>
		<span
			aria-hidden="true"
			data-reveal-x
			class="absolute top-[clamp(70px,13vh,150px)] left-[7%] w-[clamp(170px,19vw,290px)] text-foreground max-md:hidden"
		>
			<svg viewBox="0 0 280 120" class="block h-auto w-full overflow-visible">
				<path
					d="M4 112C70 104 128 40 238 22"
					fill="none"
					stroke="currentColor"
					stroke-opacity="0.35"
					stroke-width="2.4"
					stroke-dasharray="10 8"
					stroke-linecap="round"
				/>
				<use
					href="#d-plane-mini"
					x="236"
					y="6"
					width="30"
					height="30"
					transform="rotate(-14 251 21)"
				/>
			</svg>
		</span>
		<SkyCloud class="top-[26%] -left-[3%] w-[clamp(110px,11vw,170px)] text-background opacity-95" />
		<SkyCloud class="top-[33%] left-[7%] w-[clamp(70px,7vw,110px)] text-background opacity-75" />
		<SkyCloud class="top-[28%] left-[17%] w-[clamp(60px,6vw,90px)] text-background opacity-55" />
		<SkyCloud
			flip
			class="top-[44%] right-[6%] w-[clamp(90px,9vw,140px)] text-background opacity-70"
		/>
		<SkyCloud
			flip
			class="top-[32%] -right-[2%] w-[clamp(90px,9vw,140px)] text-background opacity-50"
		/>
	</div>

	<div class="relative z-4 px-5 pt-[clamp(110px,20vh,210px)] text-center">
		<div class="relative inline-block max-w-full">
			<Deco
				icon="d-star-5"
				viewBox="0 0 24 24"
				depth="mid"
				amb="twinkle"
				class="-top-[16%] -left-[5%] w-[clamp(20px,2vw,30px)] text-primary"
			/>
			<Deco
				icon="d-spark-4"
				viewBox="0 0 24 24"
				depth="mid"
				amb="twinkle"
				class="top-[8%] -right-[4%] w-[22px] text-background"
			/>
			<Deco
				icon="d-spark-4-thin"
				viewBox="0 0 24 24"
				depth="near"
				amb="twinkle"
				class="-top-[18%] right-[3%] w-3.5 text-foreground max-md:hidden"
			/>
			<h2
				data-a="join-title"
				id="join-title"
				class="mx-auto max-w-[18ch] font-montserrat text-h2 font-extrabold text-balance text-foreground"
			>
				Curious About Web3? Let's Learn It Together
			</h2>
		</div>
		<div
			class="mt-[clamp(24px,4vh,40px)] flex flex-wrap justify-center gap-[clamp(10px,1.2vw,16px)]"
		>
			{#each SOCIALS as s (s.href)}
				<a
					href={s.href}
					target="_blank"
					rel="noopener"
					data-a="join-btn"
					data-magnetic
					data-spark-host
					class="relative inline-flex items-center gap-3 rounded-full py-2.5 pr-6 pl-2.5 text-foreground shadow-social transition-colors duration-250 {s.primary
						? 'bg-primary hover:bg-primary-hover'
						: 'bg-background hover:bg-sky-wash'}"
				>
					<span
						aria-hidden="true"
						data-spark
						style="transform: scale(0)"
						class="pointer-events-none absolute -top-[9px] -right-[5px] w-[18px] text-foreground"
					>
						<svg viewBox="0 0 24 24" class="block h-auto w-full"><use href="#d-spark-4" /></svg>
					</span>
					<span
						class="flex size-[38px] flex-none items-center justify-center rounded-full bg-tertiary text-tertiary-foreground"
					>
						<svg width="20" height="20" aria-hidden="true"><use href={s.icon} /></svg>
					</span>
					<span class="text-left text-sm leading-[1.2] font-semibold">
						<span class="block">{s.l1}</span>
						<span class="block">{s.l2}</span>
					</span>
				</a>
			{/each}
		</div>
	</div>

	<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]">
		<div
			data-a="sil"
			data-speed="0.35"
			class="absolute -right-[3%] -bottom-[2vw] -left-[3%] z-0 aspect-[1344/327] opacity-55"
		>
			<img src={ctaSkyline} alt="" loading="lazy" class="block size-full" />
		</div>
		<div
			data-a="sil"
			data-speed="0.6"
			class="absolute bottom-[clamp(36px,4vw,56px)] left-1/2 z-1 ml-[calc(clamp(110px,12.6vw,181px)/-2)] w-[clamp(110px,12.6vw,181px)]"
		>
			<Monas class="block h-auto w-full" />
		</div>
		<svg
			viewBox="0 0 1440 96"
			preserveAspectRatio="none"
			class="absolute bottom-0 left-0 z-2 block h-[clamp(56px,6.7vw,96px)] w-full"
		>
			<path
				d="M362 26C284 29 239 41.5 239 41.5V74.5H1440.5V24L1382.5 41.5C1382.5 41.5 1309 48 1268 48.5C1227 49 1214.5 41.5 1172.5 41.5H1083C1060 41.5 1054 34.5 979.5 34C905 33.5 890 41.5 857 41.5C824 41.5 814.5 37.5 801 37.5C787.5 37.5 769.5 41.5 769.5 41.5C769.5 41.5 704.5 34.5 667.5 34.5C630.5 34.5 599 41.5 541 41.5C483 41.5 440 23 362 26Z"
				class="fill-hill"
			/>
			<path
				d="M155.5 12.5C105.5 6 0 0 0 0V192H1440V71.5C1440 71.5 1358 57.5 1322.61 58C1287.21 58.5 1247.5 65.5 1221.62 64.5C1195.73 63.5 1094.88 71.5 1073.5 71.5C1052.12 71.5 900.909 58 858 58C815.091 58 732.161 64 687.5 64.5C642.839 65 540.451 43.5 512 43.5C483.549 43.5 360.5 36 334.753 36C309.005 36 205.5 19 155.5 12.5Z"
				class="fill-very-tertiary"
			/>
		</svg>
		<div
			data-a="sil"
			data-speed="1"
			class="absolute bottom-[clamp(14px,1.6vw,24px)] left-[3%] z-3 w-[clamp(110px,15vw,275px)]"
		>
			<div data-a="runner"><Run1 class="block h-auto w-full" /></div>
		</div>
		<div
			data-a="sil"
			data-speed="0.8"
			class="absolute bottom-[clamp(18px,2vw,30px)] left-[27%] z-3 w-[clamp(80px,9vw,153px)] max-md:hidden"
		>
			<div data-a="runner"><Run3 class="block h-auto w-full" /></div>
		</div>
		<div
			data-a="sil"
			data-speed="0.9"
			class="absolute right-[21%] bottom-[clamp(14px,1.6vw,24px)] z-3 w-[clamp(90px,10.5vw,182px)] max-md:hidden"
		>
			<div data-a="runner"><Run2 class="block h-auto w-full" /></div>
		</div>
		<div
			data-a="sil"
			data-speed="1.3"
			class="absolute right-[2%] bottom-[clamp(40px,7vw,110px)] z-3 w-[clamp(100px,14vw,234px)]"
		>
			<div data-a="fly"><Fly class="block h-auto w-full" /></div>
		</div>
	</div>
</section>

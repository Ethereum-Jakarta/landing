<script lang="ts">
	import aboutBlob from '../assets/about/about_left.svg';
	import aboutPeople from '../assets/about-community.webp';
	import { PRINCIPLES } from '../data';
	import Deco from '$lib/components/decor/Deco.svelte';

	interface Props {
		/** Desktop: sticky stage where scroll lights the four principle cards in turn. */
		pinned: boolean;
	}

	let { pinned }: Props = $props();

	const peopleAlt = 'ETHJKT community characters gathered around the Ethereum diamond';
	const stackColors: Record<string, string> = {
		secondary: 'bg-secondary text-foreground shadow-soft',
		tertiary: 'bg-tertiary text-tertiary-foreground shadow-soft',
		background: 'bg-background text-foreground shadow-soft-ring',
		primary: 'bg-primary text-foreground shadow-soft'
	};
</script>

{#snippet heading()}
	<h2
		id="about-title"
		class="m-0 flex flex-wrap justify-center gap-x-[0.26em] font-montserrat text-h2 font-extrabold text-foreground"
	>
		{#each ['Welcome', 'to', 'ETHJKT'] as word (word)}
			<span class="inline-block overflow-hidden pb-[0.08em]"
				><span data-a="about-w" class="inline-block">{word}</span></span
			>
		{/each}
	</h2>
	<p
		data-a="about-sub"
		class="mx-auto mt-2.5 max-w-[44ch] text-[clamp(15px,1.3vw,19px)] leading-[1.5] text-muted"
	>
		Let's learn, build, and grow in the Web3 space together. Four things you get from the community:
	</p>
{/snippet}

{#snippet halo()}
	<div
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[128%] -translate-1/2 rounded-full bg-[radial-gradient(circle,var(--color-sky-halo)_0%,var(--color-sky-haze)_42%,transparent_68%)]"
	></div>
	<img data-a="about-blob" src={aboutBlob} alt="" class="absolute inset-0 size-full" />
	<img
		data-a="about-people"
		src={aboutPeople}
		alt={peopleAlt}
		class="absolute top-0 left-[4.46%] h-full w-[94.6%] object-contain"
	/>
{/snippet}

{#snippet numberPill(num: string)}
	<span
		class="inline-flex items-center rounded-full bg-current/12 px-[11px] py-1.5 text-xs font-bold tracking-[.08em]"
		>{num}</span
	>
{/snippet}

<section id="about" aria-labelledby="about-title" class="relative bg-background">
	{#if pinned}
		<!-- ~0.5 viewport of scroll per card: enough to read, short enough not to feel hijacked. -->
		<div data-a="pr-track" class="relative h-[300vh]">
			<div
				data-a="pr-stage"
				class="sticky top-0 flex h-svh flex-col overflow-hidden px-[clamp(24px,4vw,64px)] pt-[clamp(84px,11vh,104px)] pb-[clamp(24px,4vh,44px)]"
			>
				<div class="flex-none text-center">
					{@render heading()}
				</div>
				<div
					data-a="pr-board"
					class="relative mx-auto mt-[clamp(28px,5vh,56px)] grid min-h-0 w-full max-w-[1320px] flex-auto grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-x-[clamp(28px,3.4vw,56px)] gap-y-[clamp(44px,7vh,80px)]"
				>
					<svg
						aria-hidden="true"
						class="pointer-events-none absolute inset-0 z-0 size-full overflow-visible"
					>
						<defs>
							<mask
								id="pr-mask"
								maskUnits="userSpaceOnUse"
								x="-2000"
								y="-2000"
								width="6000"
								height="6000"
							>
								<path
									data-a="pr-mpath"
									d=""
									fill="none"
									stroke="white"
									stroke-width="10"
									stroke-linecap="round"
								/>
							</mask>
						</defs>
						<path
							data-a="pr-ghost"
							d=""
							fill="none"
							class="stroke-foreground/10"
							stroke-width="2.5"
							stroke-dasharray="14 10"
							stroke-linecap="round"
						/>
						<path
							data-a="pr-path"
							d=""
							fill="none"
							class="stroke-foreground"
							stroke-width="2.5"
							stroke-dasharray="14 10"
							stroke-linecap="round"
							mask="url(#pr-mask)"
						/>
					</svg>
					<div
						data-a="pr-art"
						class="relative z-1 col-start-2 row-span-2 row-start-1 aspect-[628/397] w-full self-center"
					>
						{@render halo()}
						<Deco
							icon="d-spark-4"
							viewBox="0 0 24 24"
							amb="twinkle"
							class="top-[2%] left-[4%] w-[clamp(18px,1.8vw,26px)] text-primary"
						/>
						<Deco
							icon="d-spark-4-thin"
							viewBox="0 0 24 24"
							amb="twinkle"
							class="top-[8%] right-[5%] w-[clamp(11px,1vw,16px)] text-foreground"
						/>
					</div>
					{#each PRINCIPLES as p (p.num)}
						<article
							data-a="pc"
							data-bg={p.bg}
							data-fg={p.fg}
							data-rot={p.rot}
							style="grid-column: {p.col}; grid-row: {p.row}; transform: rotate({p.rot}deg)"
							class="relative z-2 rounded-[32px] bg-background p-[clamp(20px,1.8vw,28px)] text-foreground shadow-soft-ring {p.row ===
							1
								? 'self-end'
								: 'self-start'}"
						>
							<span
								aria-hidden="true"
								data-a="pc-spark"
								style="transform: scale(0)"
								class="pointer-events-none absolute -bottom-3 -left-3 z-3 w-[26px] {p.bg ===
								'primary'
									? 'text-foreground'
									: 'text-primary'}"
							>
								<svg viewBox="0 0 24 24" class="block h-auto w-full"><use href="#d-star-5" /></svg>
							</span>
							<img
								data-a="pc-art"
								src={p.art}
								alt=""
								class="pointer-events-none absolute top-[clamp(-72px,-5vw,-48px)] right-[clamp(-26px,-1.6vw,-14px)] h-auto w-[clamp(96px,8.6vw,136px)]"
							/>
							{@render numberPill(p.num)}
							<h3
								class="mt-3.5 pr-[clamp(56px,5.4vw,90px)] font-montserrat text-[clamp(20px,1.7vw,26px)] leading-[1.15] font-bold"
							>
								{p.title}
							</h3>
							<p class="mt-2.5 text-[clamp(14px,1.05vw,16px)] leading-[1.55]">{p.body}</p>
						</article>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-[1100px] px-5 pt-[clamp(56px,9vh,100px)] pb-[clamp(24px,4vh,48px)]">
			<div class="text-center">
				{@render heading()}
			</div>
			<div data-a="reveal" class="relative mx-auto mt-8 aspect-[628/397] w-full max-w-[560px]">
				{@render halo()}
			</div>
			<div class="mt-[72px] grid gap-x-5 gap-y-[72px] sm:grid-cols-2">
				{#each PRINCIPLES as p (p.num)}
					<article
						data-a="reveal"
						class="relative rounded-[28px] px-6 pt-6 pb-[26px] {stackColors[p.bg]}"
					>
						<img
							src={p.art}
							alt=""
							loading="lazy"
							class="pointer-events-none absolute -top-[58px] -right-2 h-auto w-28"
						/>
						{@render numberPill(p.num)}
						<h3 class="mt-3.5 pr-[72px] font-montserrat text-[21px] leading-[1.2] font-bold">
							{p.title}
						</h3>
						<p class="mt-2.5 text-[15px] leading-[1.55]">{p.body}</p>
					</article>
				{/each}
			</div>
		</div>
	{/if}
</section>

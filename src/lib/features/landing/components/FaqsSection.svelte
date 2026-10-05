<script lang="ts">
	import faqArt from '../assets/faq/faq-art.svg';
	import EthArt from '../assets/EthArt.svelte';
	import { FAQS } from '../data';

	interface Props {
		/** Fired after an item toggles (spins the star, re-measures scroll triggers). */
		onToggle?: () => void;
	}

	let { onToggle }: Props = $props();

	let open = $state(0);

	function toggle(i: number) {
		open = open === i ? -1 : i;
		onToggle?.();
	}
</script>

<section
	id="faq"
	class="relative overflow-hidden bg-background pt-[clamp(72px,13vh,150px)] pb-[clamp(80px,14vh,160px)]"
>
	<div
		data-a="ethart"
		aria-hidden="true"
		class="pointer-events-none absolute top-[24%] -left-[5%] w-[clamp(120px,14vw,220px)]"
	>
		<EthArt class="block h-auto w-full" />
	</div>
	<div
		data-a="ethart"
		aria-hidden="true"
		class="pointer-events-none absolute top-[6%] -right-[5%] w-[clamp(120px,14vw,220px)]"
	>
		<EthArt class="block h-auto w-full -scale-x-100" />
	</div>

	<div class="relative px-5 text-center">
		<h2
			data-a="sec-title"
			class="m-0 font-montserrat text-[clamp(32px,4.2vw,60px)] leading-[1.1] font-extrabold tracking-[-0.02em] text-foreground"
		>
			ETHJKT — FAQs
		</h2>
		<p
			data-a="sec-sub"
			class="mx-auto mt-3 text-[clamp(15px,1.25vw,18px)] leading-[1.5] text-muted"
		>
			Answers to the most common questions about ETHJKT.
		</p>
	</div>

	<div
		class="relative mx-auto mt-[clamp(40px,7vh,72px)] flex max-w-[1200px] flex-wrap-reverse items-center justify-center gap-[clamp(32px,6vw,96px)] px-[clamp(20px,5vw,64px)]"
	>
		<div class="max-w-[600px] min-w-0 flex-[1_1_420px]">
			{#each FAQS as f, i (f.title)}
				{@const isOpen = open === i}
				<div class="border-b border-foreground/12">
					<h3 class="m-0">
						<button
							type="button"
							id="faq-btn-{i}"
							aria-expanded={isOpen}
							aria-controls="faq-panel-{i}"
							onclick={() => toggle(i)}
							class="flex w-full cursor-pointer items-center justify-between gap-4 px-0.5 py-[18px] text-left font-montserrat text-[clamp(16px,1.3vw,19px)] leading-[1.35] font-bold text-foreground"
						>
							<span>{f.title}</span>
							<svg
								aria-hidden="true"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								class="flex-none transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] {isOpen
									? 'rotate-90'
									: 'rotate-0'}"
							>
								<path
									d="M9 5l7 7-7 7"
									class="stroke-foreground"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</h3>
					<div
						id="faq-panel-{i}"
						role="region"
						aria-labelledby="faq-btn-{i}"
						inert={!isOpen}
						class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] {isOpen
							? 'grid-rows-[1fr]'
							: 'grid-rows-[0fr]'}"
					>
						<div class="overflow-hidden">
							<p
								class="m-0 pr-10 pb-5 pl-0.5 text-[clamp(14px,1.1vw,16px)] leading-[1.6] text-muted"
							>
								{f.content}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="relative flex max-w-[440px] min-w-0 flex-[1_1_300px] justify-center">
			<span
				aria-hidden="true"
				class="pointer-events-none absolute top-[2%] right-[6%] w-[26px] text-primary"
			>
				<svg data-a="faq-spark" viewBox="0 0 24 24" class="block h-auto w-full overflow-visible">
					<use href="#d-star-5" />
				</svg>
			</span>
			<img
				data-a="faq-art"
				src={faqArt}
				alt="ETH Jakarta's sign: what is, how?"
				class="block h-auto w-full max-w-[426px]"
			/>
		</div>
	</div>
</section>

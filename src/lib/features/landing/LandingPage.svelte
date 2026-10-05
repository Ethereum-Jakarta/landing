<script lang="ts">
	import { onMount } from 'svelte';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { LumaEvent } from '$lib/features/events/luma';
	import ethCrystal from './assets/shared/eth-crystal.webp';
	import { breakpointOf, SECTION_IDS } from './data';
	import { initLandingMotion } from './motion';
	import SpriteDefs from './components/SpriteDefs.svelte';
	import PaperPlane from './components/PaperPlane.svelte';
	import HeaderSection from './components/HeaderSection.svelte';
	import MobileMenu from './components/MobileMenu.svelte';
	import HeroSection from './components/HeroSection.svelte';
	import AboutSection from './components/AboutSection.svelte';
	import MeetOurTeamSection from './components/MeetOurTeamSection.svelte';
	import RoadMapSection from './components/RoadMapSection.svelte';
	import EventsSection from './components/EventsSection.svelte';
	import FaqsSection from './components/FaqsSection.svelte';
	import CalloutSection from './components/CalloutSection.svelte';
	import FooterSection from './components/FooterSection.svelte';

	interface Props {
		user: { walletAddress: string } | null;
		events: Promise<{ upcoming: LumaEvent[]; past: LumaEvent[]; failed: boolean }>;
		headlineWord?: 'WEB3' | 'Ethereum';
		showAirplane?: boolean;
		reduceMotion?: boolean;
	}

	let {
		user,
		events,
		headlineWord = 'WEB3',
		showAirplane = true,
		reduceMotion = false
	}: Props = $props();

	let root: HTMLElement;
	let ready = $state(false);
	// Server render assumes a desktop viewport; the real size is read on mount.
	let w = $state(1440);
	let h = $state(900);
	let sysReduced = $state(false);
	let scrolled = $state(false);
	let active = $state('top');
	let menuOpen = $state(false);
	let faqSpin: (() => void) | null = null;
	let faqRefresh: ReturnType<typeof setTimeout> | undefined;

	const bp = $derived(breakpointOf(w));
	const tall = $derived(h >= 740);
	const reduced = $derived(reduceMotion || sysReduced);
	const planeOn = $derived(showAirplane && !reduced);
	const aboutPinned = $derived(bp === 'l' && !reduced && tall);
	const roadmapPinned = $derived(bp === 'l' && !reduced);
	const layoutKey = $derived([bp, tall, reduced, planeOn].join('|'));

	function readScroll() {
		scrolled = window.scrollY > 40;
		const mid = window.innerHeight * 0.4;
		let next = 'top';
		for (const id of SECTION_IDS) {
			const el = document.getElementById(id);
			if (el && el.getBoundingClientRect().top <= mid) next = id;
		}
		active = next;
	}

	function onFaqToggle() {
		faqSpin?.();
		clearTimeout(faqRefresh);
		faqRefresh = setTimeout(() => ScrollTrigger.refresh(), 560);
	}

	onMount(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const onMq = () => (sysReduced = mq.matches);
		mq.addEventListener('change', onMq);

		let scrollRaf = 0;
		const onScroll = () => {
			if (scrollRaf) return;
			scrollRaf = requestAnimationFrame(() => {
				scrollRaf = 0;
				readScroll();
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		// Only re-render when the layout bucket changes; otherwise just re-measure triggers.
		let resizeT: ReturnType<typeof setTimeout> | undefined;
		const onResize = () => {
			clearTimeout(resizeT);
			resizeT = setTimeout(() => {
				const nw = window.innerWidth;
				const nh = window.innerHeight;
				if (breakpointOf(nw) !== bp || nh >= 740 !== tall) {
					w = nw;
					h = nh;
				} else ScrollTrigger.refresh();
			}, 160);
		};
		window.addEventListener('resize', onResize);

		w = window.innerWidth;
		h = window.innerHeight;
		sysReduced = mq.matches;
		ready = true;
		readScroll();

		return () => {
			mq.removeEventListener('change', onMq);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			cancelAnimationFrame(scrollRaf);
			clearTimeout(resizeT);
			clearTimeout(faqRefresh);
		};
	});

	// (Re)build all motion whenever the rendered layout variant changes.
	$effect(() => {
		if (!ready || !layoutKey) return;
		const opts = {
			bp,
			reduced,
			planeOn,
			onFaqSpin: (fn: (() => void) | null) => (faqSpin = fn)
		};
		// Pinned/stacked variants swap in the same flush; wait a frame so layout is measurable.
		let cleanup: (() => void) | undefined;
		const raf = requestAnimationFrame(() => (cleanup = initLandingMotion(root, opts)));
		return () => {
			cancelAnimationFrame(raf);
			cleanup?.();
		};
	});
</script>

<svelte:head>
	<title>ETHJKT — Build the Future of Web3</title>
</svelte:head>

<div
	bind:this={root}
	class="relative overflow-x-clip bg-background font-inter text-foreground antialiased"
>
	<SpriteDefs />

	{#if planeOn && ready}
		<PaperPlane />
	{/if}

	<HeaderSection
		{scrolled}
		{active}
		{menuOpen}
		{user}
		onToggleMenu={() => (menuOpen = !menuOpen)}
	/>

	{#if menuOpen}
		<MobileMenu onClose={() => (menuOpen = false)} />
	{/if}

	<HeroSection headWord={headlineWord} />

	<div
		data-a="crystal-travel"
		aria-hidden="true"
		class="pointer-events-none absolute top-[calc(max(100svh,640px)-clamp(150px,24vh,240px))] left-[clamp(16px,9vw,150px)] z-5 w-[clamp(52px,5.6vw,92px)] will-change-transform"
	>
		<img data-a="crystal-float" src={ethCrystal} alt="" class="block h-auto w-full" />
	</div>

	<AboutSection pinned={aboutPinned} />
	<MeetOurTeamSection scrollable={bp === 's' || reduced} />
	<RoadMapSection pinned={roadmapPinned} />
	<EventsSection {events} {reduced} />
	<FaqsSection onToggle={onFaqToggle} />
	<CalloutSection />
	<FooterSection />
</div>

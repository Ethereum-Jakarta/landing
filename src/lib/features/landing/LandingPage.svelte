<script lang="ts">
	import { onMount } from 'svelte';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { page } from '$app/state';
	import type { CalendarEvents } from '$lib/features/events/luma';
	import SiteHeader from '$lib/components/organism/SiteHeader.svelte';
	import SiteFooter from '$lib/components/organism/SiteFooter.svelte';
	import ethCrystal from './assets/shared/eth-crystal.webp';
	import { breakpointOf, SECTION_IDS } from './data';
	import { initLandingMotion } from './motion';
	import SpriteDefs from './components/SpriteDefs.svelte';
	import PaperPlane from './components/PaperPlane.svelte';
	import HeroSection from './components/HeroSection.svelte';
	import AboutSection from './components/AboutSection.svelte';
	import MeetOurTeamSection from './components/MeetOurTeamSection.svelte';
	import RoadMapSection from './components/RoadMapSection.svelte';
	import EventsSection from './components/EventsSection.svelte';
	import FaqsSection from './components/FaqsSection.svelte';
	import CalloutSection from './components/CalloutSection.svelte';

	interface Props {
		events: Promise<CalendarEvents>;
		headlineWord?: 'WEB3' | 'Ethereum';
		showAirplane?: boolean;
		reduceMotion?: boolean;
	}

	let {
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
	let active = $state('top');
	let faqSpin: (() => void) | null = null;
	let faqRefresh: ReturnType<typeof setTimeout> | undefined;

	const bp = $derived(breakpointOf(w));
	const tall = $derived(h >= 740);
	const reduced = $derived(reduceMotion || sysReduced);
	const planeOn = $derived(showAirplane && !reduced);
	const aboutPinned = $derived(bp === 'l' && !reduced && tall);
	const roadmapPinned = $derived(bp === 'l' && !reduced);
	const layoutKey = $derived([bp, tall, reduced, planeOn].join('|'));

	const DESCRIPTION =
		'ETHJKT (Ethereum Jakarta) runs free meetups, workshops and hackathons for anyone building on Ethereum in Indonesia, from first wallet to first mainnet deploy.';

	function readScroll() {
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
	<title>ETHJKT · Ethereum Jakarta community</title>
	<meta name="description" content={DESCRIPTION} />
	<link rel="canonical" href={page.url.origin + '/'} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="ETHJKT" />
	<meta property="og:title" content="ETHJKT · Ethereum Jakarta community" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:url" content={page.url.origin + '/'} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@ethjkt" />
</svelte:head>

<div
	bind:this={root}
	class="relative overflow-x-clip bg-background font-inter text-foreground antialiased"
>
	<SpriteDefs />

	{#if planeOn && ready}
		<PaperPlane />
	{/if}

	<SiteHeader {active} />

	<main id="main">
		<HeroSection headWord={headlineWord} />

		<div
			data-a="crystal-travel"
			aria-hidden="true"
			class="pointer-events-none absolute top-[calc(max(100svh,640px)-clamp(150px,24vh,240px))] left-[clamp(16px,9vw,150px)] z-5 w-[clamp(52px,5.6vw,92px)] will-change-transform"
		>
			<img data-a="crystal-float" src={ethCrystal} alt="" class="block h-auto w-full" />
		</div>

		<!-- Order: what it is → proof it's active (events) → what we run → who → questions → join. -->
		<AboutSection pinned={aboutPinned} />
		<EventsSection {events} {reduced} />
		<RoadMapSection pinned={roadmapPinned} />
		<MeetOurTeamSection scrollable={bp === 's' || reduced} />
		<FaqsSection onToggle={onFaqToggle} />
		<CalloutSection />
	</main>

	<SiteFooter />
</div>

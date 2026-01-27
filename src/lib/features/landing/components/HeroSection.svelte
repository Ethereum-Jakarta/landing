<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Button from '$lib/components/atoms/Button.svelte';
	import Cloud from '$lib/components/atoms/Cloud.svelte';
	import Logo from '$lib/components/atoms/Logo.svelte';
	import NavTabs from '$lib/components/molecules/NavTabs.svelte';

	const navItems = [
		{ label: 'About Us', href: '#about' },
		{ label: 'Events', href: '#events' },
		{ label: 'Docs', href: '#docs' }
	];

	let heroSection: HTMLElement;
	let buildText: HTMLSpanElement;
	let futureText: HTMLSpanElement;
	let web3Text: HTMLSpanElement;
	let ethjktText: HTMLSpanElement;
	let subtitle: HTMLParagraphElement;
	let ctaButton: HTMLDivElement;

	// Bird and sign elements
	let theSign: HTMLSpanElement;
	let ofSign: HTMLSpanElement;
	let bird1: SVGSVGElement;
	let bird2: SVGSVGElement;
	let bird3: SVGSVGElement;

	// Cloud elements for animation
	let cloudContainer: HTMLDivElement;

	// Paper airplane elements
	let paperAirplane: SVGSVGElement;
	let trailPath: SVGPathElement;

	// Cloud configuration - position, size, opacity, speed (depth-based)
	const cloudConfigs = [
		// Far clouds (slower, smaller, more transparent)
		{ top: '5%', left: '-3%', size: 'w-48 md:w-56', opacity: 0.4, speed: 0.3, flip: false },
		{ top: '22%', right: '-5%', size: 'w-44 md:w-52', opacity: 0.35, speed: 0.25, flip: true },
		{ top: '55%', left: '8%', size: 'w-40 md:w-48', opacity: 0.3, speed: 0.2, flip: false },
		// Mid clouds (medium speed)
		{ top: '10%', left: '-12%', size: 'w-64 md:w-80', opacity: 0.7, speed: 0.5, flip: false },
		{ top: '15%', right: '-10%', size: 'w-56 md:w-72', opacity: 0.6, speed: 0.45, flip: true },
		{ top: '40%', right: '-5%', size: 'w-52 md:w-64', opacity: 0.5, speed: 0.4, flip: true },
		// Near clouds (faster, larger, more opaque)
		{ bottom: '8%', left: '-18%', size: 'w-72 md:w-96', opacity: 0.95, speed: 0.8, flip: false },
		{ bottom: '12%', right: '-12%', size: 'w-64 md:w-80', opacity: 0.9, speed: 0.7, flip: true },
		{ bottom: '20%', left: '5%', size: 'w-56 md:w-72', opacity: 0.8, speed: 0.6, flip: false },
		// Extra large clouds
		{
			bottom: '5%',
			right: '20%',
			size: 'w-80 md:w-[28rem]',
			opacity: 0.95,
			speed: 0.85,
			flip: true
		},
		{ top: '30%', left: '-20%', size: 'w-72 md:w-96', opacity: 0.6, speed: 0.5, flip: false }
	];

	// Split text into individual letter spans
	function splitText(element: HTMLElement) {
		const text = element.textContent || '';
		element.innerHTML = text
			.split('')
			.map((char) =>
				char === ' '
					? '<span class="inline-block">&nbsp;</span>'
					: `<span class="inline-block">${char}</span>`
			)
			.join('');
		return element.querySelectorAll('span');
	}

	// Animation types for variety
	type AnimationType = 'spin' | 'spring' | 'typewriter';

	function getRandomAnimationType(): AnimationType {
		const types: AnimationType[] = ['spin', 'spring', 'typewriter'];
		return types[Math.floor(Math.random() * types.length)];
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		startAnimations();

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});

	function startAnimations() {
		// Split all text elements into letters
		const buildLetters = splitText(buildText);
		const futureLetters = splitText(futureText);
		const web3Letters = splitText(web3Text);
		const ethjktLetters = splitText(ethjktText);
		const subtitleLetters = splitText(subtitle);

		// Combine all letters for animation (title letters)
		const titleLetters = [
			...Array.from(buildLetters),
			...Array.from(futureLetters),
			...Array.from(web3Letters),
			...Array.from(ethjktLetters)
		];

		// All letters including subtitle
		const allLetters = [...titleLetters, ...Array.from(subtitleLetters)];

		// Assign random animation type to each letter
		const letterAnimations = allLetters.map(() => getRandomAnimationType());

		// Create scroll-linked animation for letter spreading
		gsap.to(allLetters, {
			scrollTrigger: {
				trigger: heroSection,
				start: 'top top',
				end: 'bottom top',
				scrub: 1
			},
			y: (i) => (i % 2 === 0 ? -30 : 30) * Math.random(),
			x: (i) => (i - allLetters.length / 2) * 8,
			opacity: 0.3,
			rotateZ: (i) => (i % 2 === 0 ? 10 : -10),
			ease: 'none'
		});

		// Button fade out on scroll
		gsap.to(ctaButton, {
			scrollTrigger: {
				trigger: heroSection,
				start: 'top top',
				end: '50% top',
				scrub: 1
			},
			y: -50,
			opacity: 0,
			ease: 'none'
		});

		// Initial entrance animation with varied effects per letter
		const entranceTl = gsap.timeline();

		// Set initial states based on animation type
		allLetters.forEach((letter, i) => {
			const type = letterAnimations[i];
			switch (type) {
				case 'spin':
					gsap.set(letter, {
						opacity: 0,
						rotateZ: Math.random() > 0.5 ? 180 : -180,
						rotateY: Math.random() > 0.5 ? 90 : -90,
						scale: 0.5,
						y: -50
					});
					break;
				case 'spring':
					gsap.set(letter, {
						opacity: 0,
						scale: 0,
						y: -100
					});
					break;
				case 'typewriter':
					gsap.set(letter, {
						opacity: 0,
						x: -20,
						scaleX: 0
					});
					break;
			}
		});

		// Animate each letter with its assigned animation type
		allLetters.forEach((letter, i) => {
			const type = letterAnimations[i];
			const delay = i * 0.04;

			switch (type) {
				case 'spin':
					entranceTl.to(
						letter,
						{
							opacity: 1,
							rotateZ: 0,
							rotateY: 0,
							scale: 1,
							y: 0,
							duration: 0.8,
							ease: 'back.out(1.7)'
						},
						delay
					);
					break;
				case 'spring':
					entranceTl.to(
						letter,
						{
							opacity: 1,
							scale: 1,
							y: 0,
							duration: 0.6,
							ease: 'elastic.out(1, 0.5)'
						},
						delay
					);
					break;
				case 'typewriter':
					entranceTl.to(
						letter,
						{
							opacity: 1,
							x: 0,
							scaleX: 1,
							duration: 0.15,
							ease: 'power2.out'
						},
						delay
					);
					break;
			}
		});

		// Bird animation starts after title letters finish
		const titleEndTime = titleLetters.length * 0.04 + 0.8;
		const birdTl = gsap.timeline();
		entranceTl.add(birdTl, titleEndTime);

		// Calculate off-screen positions
		const bird1Rect = bird1.getBoundingClientRect();
		const bird2Rect = bird2.getBoundingClientRect();
		const bird1OffscreenX = -(bird1Rect.left + bird1Rect.width + 100);
		const bird2OffscreenX = window.innerWidth - bird2Rect.left + 100;

		// Initial states
		gsap.set(bird1, { x: bird1OffscreenX, y: -100, opacity: 1 });
		gsap.set(bird2, { x: bird2OffscreenX, y: -80, opacity: 1 });
		gsap.set(theSign, { x: bird1OffscreenX, y: -60, opacity: 1, scale: 0.9 });
		gsap.set(ofSign, { x: bird2OffscreenX, y: -50, opacity: 1, scale: 0.9 });

		// Bird 1 animation
		birdTl
			.to(bird1, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' })
			.to(theSign, { x: 0, y: -20, duration: 1.2, ease: 'power2.out' }, '<')
			.to(
				bird1.querySelector('.wing'),
				{ rotateZ: -20, duration: 0.1, repeat: 11, yoyo: true, ease: 'power1.inOut' },
				'<'
			)
			.to(theSign, { y: 0, scale: 1, duration: 0.4, ease: 'bounce.out' })
			.to(
				bird1,
				{
					x: window.innerWidth - bird1Rect.left + 100,
					y: -200,
					opacity: 0,
					duration: 1.2,
					ease: 'power2.in'
				},
				'+=0.1'
			)
			.to(
				bird1.querySelector('.wing'),
				{ rotateZ: -20, duration: 0.1, repeat: 9, yoyo: true, ease: 'power1.inOut' },
				'<'
			);

		// Bird 2 animation
		birdTl
			.to(bird2, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' }, 0.5)
			.to(ofSign, { x: 0, y: -15, duration: 1.2, ease: 'power2.out' }, '<')
			.to(
				bird2.querySelector('.wing'),
				{ rotateZ: 20, duration: 0.1, repeat: 11, yoyo: true, ease: 'power1.inOut' },
				'<'
			)
			.to(ofSign, { y: 0, scale: 1, duration: 0.4, ease: 'bounce.out' }, 1.7)
			.to(
				bird2,
				{
					x: -(bird2Rect.left + bird2Rect.width + 100),
					y: -180,
					opacity: 0,
					duration: 1.2,
					ease: 'power2.in'
				},
				'+=0.1'
			)
			.to(
				bird2.querySelector('.wing'),
				{ rotateZ: 20, duration: 0.1, repeat: 9, yoyo: true, ease: 'power1.inOut' },
				'<'
			);

		// Bird 3 carries the CTA button (comes from bottom)
		const ctaRect = ctaButton.getBoundingClientRect();
		const bird3OffscreenY = window.innerHeight - ctaRect.top + 150;

		// Initial state - button starts off-screen (bird moves with it as child)
		gsap.set(ctaButton, { y: bird3OffscreenY, opacity: 1 });

		// Bird 3 animation - button flies up, bird is carried along as child element
		const bird3StartTime = 1.0;
		birdTl
			.to(ctaButton, { y: 0, duration: 1.4, ease: 'power2.out' }, bird3StartTime)
			.to(
				bird3.querySelector('.wing'),
				{ rotateZ: -20, duration: 0.1, repeat: 13, yoyo: true, ease: 'power1.inOut' },
				'<'
			)
			// Bird flies away to right bottom
			.to(
				bird3,
				{
					x: window.innerWidth,
					y: 200,
					opacity: 0,
					duration: 0.8,
					ease: 'power2.in'
				},
				bird3StartTime + 1.4
			)
			.to(
				bird3.querySelector('.wing'),
				{ rotateZ: -20, duration: 0.1, repeat: 7, yoyo: true, ease: 'power1.inOut' },
				'<'
			)
			// Button bounce happens simultaneously
			.to(ctaButton, { y: 5, duration: 0.15, ease: 'power2.out' }, bird3StartTime + 1.4)
			.to(ctaButton, { y: 0, duration: 0.3, ease: 'bounce.out' });

		// Cloud animations
		const cloudElements = cloudContainer.querySelectorAll('.cloud-item');
		const viewportWidth = window.innerWidth;

		cloudElements.forEach((cloud, i) => {
			const config = cloudConfigs[i];
			if (!config) return;

			const duration = 30 + (1 - config.speed) * 40;
			const yRange = 10 + config.speed * 20;
			const delay = Math.random() * 10;
			const goingRight = config.left !== undefined;

			gsap.fromTo(
				cloud,
				{ x: goingRight ? -300 : 300 },
				{
					x: goingRight ? viewportWidth + 100 : -(viewportWidth + 100),
					duration: duration,
					ease: 'none',
					repeat: -1,
					delay: delay
				}
			);

			gsap.to(cloud, {
				y: yRange,
				duration: 4 + Math.random() * 3,
				ease: 'sine.inOut',
				repeat: -1,
				yoyo: true,
				delay: Math.random() * 2
			});
		});

		// Paper airplane (disabled on mobile for better performance)
		const isMobile = window.innerWidth < 768;

		if (!isMobile) {
			const trailPoints: { x: number; y: number }[] = [];
			const maxPoints = 80;
			let airplaneX = window.innerWidth + 100;
			let airplaneY = -100;
			let mouseX = airplaneX;
			let mouseY = airplaneY;
			let currentRotation = 0;

			for (let i = 0; i < maxPoints; i++) {
				trailPoints.push({ x: airplaneX, y: airplaneY });
			}

			function createSmoothPath(points: { x: number; y: number }[]): string {
				if (points.length < 4) return '';
				let path = `M ${points[0].x} ${points[0].y}`;
				for (let i = 0; i < points.length - 3; i += 3) {
					const p0 = points[Math.max(0, i - 1)];
					const p1 = points[i];
					const p2 = points[Math.min(points.length - 1, i + 3)];
					const p3 = points[Math.min(points.length - 1, i + 6)];
					const cp1x = p1.x + (p2.x - p0.x) / 6;
					const cp1y = p1.y + (p2.y - p0.y) / 6;
					const cp2x = p2.x - (p3.x - p1.x) / 6;
					const cp2y = p2.y - (p3.y - p1.y) / 6;
					path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
				}
				return path;
			}

			function animate() {
				const ease = 0.06;
				airplaneX += (mouseX - airplaneX) * ease;
				airplaneY += (mouseY - airplaneY) * ease;

				const dx = mouseX - airplaneX;
				const dy = mouseY - airplaneY;
				if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
					const targetRotation = Math.atan2(dy, dx) * (180 / Math.PI);
					currentRotation += (targetRotation - currentRotation) * 0.08;
				}

				if (paperAirplane) {
					paperAirplane.style.left = `${airplaneX - 24}px`;
					paperAirplane.style.top = `${airplaneY - 24}px`;
					paperAirplane.style.transform = `rotate(${currentRotation}deg)`;
				}

				trailPoints.unshift({ x: airplaneX, y: airplaneY });
				if (trailPoints.length > maxPoints) trailPoints.pop();

				if (trailPath && trailPoints.length > 4) {
					trailPath.setAttribute('d', createSmoothPath(trailPoints));
				}

				requestAnimationFrame(animate);
			}

			animate();

			const onMouseMove = (e: MouseEvent) => {
				mouseX = e.clientX;
				mouseY = e.clientY;
			};

			window.addEventListener('mousemove', onMouseMove, { passive: true });
		} else {
			// Hide paper airplane on mobile
			if (paperAirplane) paperAirplane.style.display = 'none';
			if (trailPath) trailPath.style.display = 'none';
		}
	}
</script>

<section
	bind:this={heroSection}
	class="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-secondary to-background"
>
	<!-- Header -->
	<header class="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
		<!-- Logo -->
		<Logo height={32} />

		<!-- Navigation -->
		<NavTabs items={navItems} class="hidden md:block" />

		<!-- Language/Settings -->
		<div class="flex items-center gap-2 rounded-full bg-tertiary px-4 py-2">
			<button aria-label="Select region" class="text-white hover:text-primary">
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<button aria-label="Change language" class="text-white hover:text-primary">
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</header>

	<!-- Cloud decorations - GPU accelerated with will-change -->
	<div bind:this={cloudContainer} class="pointer-events-none absolute inset-0 overflow-hidden">
		{#each cloudConfigs as config (config)}
			<div
				class="cloud-item absolute will-change-transform"
				style="
					{config.top ? `top: ${config.top};` : ''}
					{config.bottom ? `bottom: ${config.bottom};` : ''}
					{config.left ? `left: ${config.left};` : ''}
					{config.right ? `right: ${config.right};` : ''}
					opacity: {config.opacity};
				"
			>
				<Cloud class={config.size} flip={config.flip} />
			</div>
		{/each}
	</div>

	<!-- Paper airplane trail (smooth curved path) -->
	<svg class="pointer-events-none fixed inset-0 z-40 h-screen w-screen">
		<path
			bind:this={trailPath}
			d=""
			stroke="white"
			stroke-width="3"
			stroke-dasharray="16,10"
			stroke-linecap="round"
			fill="none"
			opacity="0.6"
		/>
	</svg>

	<!-- Paper airplane -->
	<svg
		bind:this={paperAirplane}
		class="pointer-events-none fixed top-0 left-0 z-50"
		width="48"
		height="48"
		viewBox="0 0 32 32"
		fill="none"
	>
		<!-- Paper airplane shape -->
		<path
			d="M2 16 L30 2 L18 16 L30 30 Z"
			fill="white"
			stroke="white"
			stroke-width="1"
			stroke-linejoin="round"
		/>
		<!-- Fold line -->
		<path d="M2 16 L18 16" stroke="#d0d0d0" stroke-width="1" />
		<!-- Shadow/depth -->
		<path d="M18 16 L30 30 L30 2 Z" fill="#f5f5f5" />
	</svg>

	<!-- Hero Content -->
	<div
		class="relative z-10 flex flex-col items-center justify-center px-4 pt-16 text-center lg:pt-24"
	>
		<!-- Main Heading Line 1 -->
		<h1
			class="font-montserrat text-5xl leading-tight font-bold text-tertiary md:text-6xl lg:text-7xl"
		>
			<span bind:this={buildText}>Build</span>
			<span class="relative ml-4 inline-block font-light">
				<!-- Bird 1 carrying "the" sign -->
				<svg
					bind:this={bird1}
					class="absolute -top-14 -left-8 h-10 w-10 md:-top-12"
					viewBox="0 0 40 40"
					fill="none"
				>
					<!-- Bird body -->
					<ellipse cx="20" cy="22" rx="12" ry="8" fill="#5a5d79" />
					<!-- Bird head -->
					<circle cx="30" cy="18" r="6" fill="#5a5d79" />
					<!-- Bird eye -->
					<circle cx="32" cy="17" r="1.5" fill="white" />
					<circle cx="32.5" cy="16.5" r="0.8" fill="#131740" />
					<!-- Bird beak -->
					<path d="M36 18 L42 17 L36 20 Z" fill="#f2b42d" />
					<!-- Bird wing -->
					<ellipse class="wing origin-left" cx="18" cy="20" rx="10" ry="5" fill="#3a3d59" />
					<!-- Bird tail -->
					<path d="M8 22 L2 18 L2 26 Z" fill="#3a3d59" />
				</svg>
				<span
					bind:this={theSign}
					class="absolute -top-6 -left-4 inline-block -rotate-12 rounded-md bg-primary px-2 py-0.5 text-lg font-semibold text-tertiary md:-top-4 md:-left-4 md:text-xl"
					>the</span
				>
				<span bind:this={futureText}>Future</span>
			</span>
		</h1>

		<!-- Main Heading Line 2 -->
		<h1
			class="font-montserrat text-5xl leading-tight font-bold text-tertiary md:text-6xl lg:text-7xl"
		>
			<span class="relative -mr-2 inline-block">
				<!-- Bird 2 carrying "of" sign -->
				<svg
					bind:this={bird2}
					class="absolute top-0 -left-4 h-10 w-10 -scale-x-100"
					viewBox="0 0 40 40"
					fill="none"
				>
					<!-- Bird body -->
					<ellipse cx="20" cy="22" rx="12" ry="8" fill="#5a5d79" />
					<!-- Bird head -->
					<circle cx="30" cy="18" r="6" fill="#5a5d79" />
					<!-- Bird eye -->
					<circle cx="32" cy="17" r="1.5" fill="white" />
					<circle cx="32.5" cy="16.5" r="0.8" fill="#131740" />
					<!-- Bird beak -->
					<path d="M36 18 L42 17 L36 20 Z" fill="#f2b42d" />
					<!-- Bird wing -->
					<ellipse class="wing origin-left" cx="18" cy="20" rx="10" ry="5" fill="#3a3d59" />
					<!-- Bird tail -->
					<path d="M8 22 L2 18 L2 26 Z" fill="#3a3d59" />
				</svg>
				<span
					bind:this={ofSign}
					class="relative inline-block rotate-6 rounded-md bg-white px-2 py-0.5 text-lg font-normal text-tertiary shadow-sm md:text-xl"
					>of</span
				>
			</span>
			<span class="font-light"><span bind:this={web3Text}>Ethereum at</span></span>
			<span bind:this={ethjktText} class="font-black tracking-wide">ETHJKT</span>
		</h1>

		<!-- Subtitle -->
		<p
			bind:this={subtitle}
			class="mt-8 max-w-2xl font-inter text-2xl font-light text-muted md:text-xl"
		>
			Build, Innovate, and Connect with the Ethereum Community in Indonesia.
		</p>

		<!-- CTA Button with Bird -->
		<div bind:this={ctaButton} class="relative mt-10">
			<!-- Bird 3 carrying the button -->
			<svg
				bind:this={bird3}
				class="absolute -top-12 left-1/2 h-12 w-12 -translate-x-1/2"
				viewBox="0 0 40 40"
				fill="none"
			>
				<!-- Bird body -->
				<ellipse cx="20" cy="22" rx="12" ry="8" fill="#5a5d79" />
				<!-- Bird head -->
				<circle cx="30" cy="18" r="6" fill="#5a5d79" />
				<!-- Bird eye -->
				<circle cx="32" cy="17" r="1.5" fill="white" />
				<circle cx="32.5" cy="16.5" r="0.8" fill="#131740" />
				<!-- Bird beak -->
				<path d="M36 18 L42 17 L36 20 Z" fill="#f2b42d" />
				<!-- Bird wing -->
				<ellipse class="wing origin-left" cx="18" cy="20" rx="10" ry="5" fill="#3a3d59" />
				<!-- Bird tail -->
				<path d="M8 22 L2 18 L2 26 Z" fill="#3a3d59" />
			</svg>
			<Button href="#start" size="lg">Start Your Ethereum Journey</Button>
		</div>
	</div>
</section>

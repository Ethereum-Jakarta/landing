<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	// Inner ring first (7), then outer ring (12) — see the ring config below.
	const teamMembers = [
		{ name: 'Revo', role: 'Developer Ecosystem Lead', image: '/team/revo.webp' },
		{ name: 'Rustacle', role: 'Growth & Ecosystem Lead', image: '/team/rustacle.webp' },
		{ name: 'Zexoverz', role: 'Protocol Research Lead', image: '/team/zexoverz.webp' },
		{ name: 'Meli', role: 'Lead Marketing', image: '/team/meli.webp' },
		{ name: 'Wildan', role: 'Co-Lead Developer', image: '/team/wildan.webp' },
		{ name: 'Nabil', role: 'Co-Lead Business Operation', image: '/team/nabil.webp' },
		{ name: 'Catherine', role: 'Co-Lead Marketing', image: '/team/catherine.webp' },
		{ name: 'Bima Jadiva', role: 'Developer Advocate', image: '/team/bima.webp' },
		{ name: 'Adz', role: 'Developer', image: '/team/adz.webp' },
		{ name: 'Andrew', role: 'Developer', image: '/team/andrew-dev.webp' },
		{ name: 'Fulvian', role: 'Developer', image: '/team/fulvian.webp' },
		{ name: 'Louis', role: 'Developer', image: '/team/louis.webp' },
		{ name: 'Riko', role: 'Developer', image: '/team/riko.webp' },
		{ name: 'Riyan', role: 'Developer', image: '/team/riyan.webp' },
		{ name: 'Maulana', role: 'Protocol Research', image: '/team/maulana.webp' },
		{ name: 'Zidan', role: 'Protocol Research', image: '/team/zidan.webp' },
		{ name: 'Andrew', role: 'Graphic Designer', image: '/team/andrew-designer.webp' },
		{ name: 'Arya', role: 'Business Operation', image: '/team/arya.webp' },
		{ name: 'Hansel', role: 'Business Operation', image: '/team/hansel.webp' }
	];

	// Scatter cards over concentric ellipses around the centered heading.
	// Each ring is [count, radiusX, radiusY]; counts must sum to teamMembers.length.
	// Radii are to the card *centre*, so each ring must clear the heading by half a card.
	function scatter(rings: [number, number, number][]) {
		return rings.flatMap(([count, rx, ry], ring) => {
			// Stepping by equal angle bunches cards at the ends of a wide ellipse — the
			// wider the ellipse the worse it gets. Walk the perimeter by arc length instead.
			const SAMPLES = 720;
			const at = (t: number) => [Math.sin(t) * rx, -Math.cos(t) * ry];
			const cum = [0];
			for (let i = 1; i <= SAMPLES; i++) {
				const [x0, y0] = at(((i - 1) / SAMPLES) * Math.PI * 2);
				const [x1, y1] = at((i / SAMPLES) * Math.PI * 2);
				cum.push(cum[i - 1] + Math.hypot(x1 - x0, y1 - y0));
			}
			const total = cum[SAMPLES];
			return Array.from({ length: count }, (_, i) => {
				// Offset alternate rings so cards don't line up radially.
				const target = (((i + ring * 0.5) / count) * total) % total;
				let k = cum.findIndex((c) => c >= target);
				if (k < 0) k = SAMPLES;
				const angle = (k / SAMPLES) * Math.PI * 2;
				const [x, y] = at(angle);
				return {
					x: Math.round(x),
					y: Math.round(y),
					rotate: Math.round(Math.sin(angle * 2 + ring) * 16)
				};
			});
		});
	}

	// Sized so the outer ring stays inside a 1440x800 viewport (card is 200x266 at lg,
	// so |x| <= 620 and |y| <= 267 keep every card fully on screen) and the inner ring
	// clears the centred heading.
	const desktopPositions = scatter([
		[7, 400, 250],
		[12, 620, 267]
	]);

	const mobilePositions = scatter([
		[7, 100, 150],
		[12, 132, 292]
	]);

	function getScaledPositions(): { x: number; y: number; rotate: number }[] {
		if (typeof window === 'undefined') return desktopPositions;
		const width = window.innerWidth;

		if (width < 768) {
			return mobilePositions;
		}

		let scale = 1;
		if (width < 1024) scale = 0.55;
		else if (width < 1440) scale = 0.75;

		return desktopPositions.map((pos) => ({
			x: pos.x * scale,
			y: pos.y * scale,
			rotate: pos.rotate
		}));
	}

	let sectionEl: HTMLElement;
	let pinContainerEl: HTMLDivElement;
	let textContainerEl: HTMLDivElement;
	let headingEl: HTMLHeadingElement;
	let subtitleEl: HTMLParagraphElement;
	let cardEls: HTMLDivElement[] = [];
	let frontFaces: HTMLDivElement[] = [];
	let cardInners: HTMLDivElement[] = [];
	let textContents: HTMLDivElement[] = [];
	let shineOverlays: HTMLDivElement[] = [];
	let floatTweens: gsap.core.Tween[] = [];

	const rotateAmplitude = 14;
	const scaleOnHover = 1.1;
	const textDepth = 50;

	let currentRotations: { x: number; y: number }[] = teamMembers.map(() => ({ x: 0, y: 0 }));
	let targetRotations: { x: number; y: number }[] = teamMembers.map(() => ({ x: 0, y: 0 }));
	let animationFrames: number[] = [];

	function handleMouseMove(e: MouseEvent | TouchEvent, index: number) {
		const card = cardInners[index];
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

		const offsetX = clientX - rect.left - rect.width / 2;
		const offsetY = clientY - rect.top - rect.height / 2;

		targetRotations[index] = {
			x: (offsetY / (rect.height / 2)) * -rotateAmplitude,
			y: (offsetX / (rect.width / 2)) * rotateAmplitude
		};

		if (shineOverlays[index]) {
			const shineX = ((clientX - rect.left) / rect.width) * 100;
			const shineY = ((clientY - rect.top) / rect.height) * 100;
			shineOverlays[index].style.background =
				`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
		}
	}

	function handleMouseEnter(index: number) {
		const card = cardInners[index];
		const textContent = textContents[index];
		const shine = shineOverlays[index];
		if (!card) return;

		startSpringAnimation(index);

		gsap.to(card, {
			scale: scaleOnHover,
			duration: 0.4,
			ease: 'power2.out',
			overwrite: 'auto'
		});

		if (textContent) {
			gsap.to(textContent, {
				z: textDepth,
				duration: 0.4,
				ease: 'power2.out'
			});
		}

		if (shine) {
			gsap.to(shine, {
				opacity: 1,
				duration: 0.3
			});
		}
	}

	function handleMouseLeave(index: number) {
		const card = cardInners[index];
		const textContent = textContents[index];
		const shine = shineOverlays[index];
		if (!card) return;

		if (animationFrames[index]) {
			cancelAnimationFrame(animationFrames[index]);
		}

		targetRotations[index] = { x: 0, y: 0 };

		gsap.to(card, {
			rotateX: 0,
			rotateY: 0,
			scale: 1,
			duration: 0.8,
			ease: 'elastic.out(1, 0.4)',
			overwrite: 'auto'
		});

		if (textContent) {
			gsap.to(textContent, {
				z: 0,
				duration: 0.5,
				ease: 'power2.out'
			});
		}

		if (shine) {
			gsap.to(shine, {
				opacity: 0,
				duration: 0.3
			});
		}

		currentRotations[index] = { x: 0, y: 0 };
	}

	function startSpringAnimation(index: number) {
		const card = cardInners[index];
		if (!card) return;

		const stiffness = 0.08;
		const damping = 0.85;

		let velocityX = 0;
		let velocityY = 0;

		function animate() {
			const target = targetRotations[index];
			const current = currentRotations[index];

			const forceX = (target.x - current.x) * stiffness;
			const forceY = (target.y - current.y) * stiffness;

			velocityX = velocityX * damping + forceX;
			velocityY = velocityY * damping + forceY;

			current.x += velocityX;
			current.y += velocityY;

			gsap.set(card, {
				rotateX: current.x,
				rotateY: current.y
			});

			animationFrames[index] = requestAnimationFrame(animate);
		}

		animate();
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		let scatteredPositions = getScaledPositions();

		ScrollTrigger.refresh();

		gsap.set(headingEl, {
			opacity: 0,
			y: 60,
			scale: 0.9
		});

		gsap.set(subtitleEl, {
			opacity: 0,
			y: 40
		});

		const tcaScrollTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: pinContainerEl,
				start: '50% 50%',
				end: '400% 50%',
				scrub: 0.5,
				pin: true,
				markers: false,
				invalidateOnRefresh: true
			}
		});

		tcaScrollTimeline.to(
			headingEl,
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.5,
				ease: 'power2.out'
			},
			0
		);

		tcaScrollTimeline.to(
			subtitleEl,
			{
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: 'power2.out'
			},
			0.15
		);

		cardEls.forEach((card, index) => {
			const finalPos = scatteredPositions[index];

			gsap.set(card, {
				opacity: 1,
				visibility: 'visible',
				x: finalPos.x,
				y: finalPos.y,
				rotate: finalPos.rotate
			});

			const isFirstInPair = index % 2 === 0;
			const pairIndex = Math.floor(index / 2);

			floatTweens[index] = gsap.to(cardInners[index], {
				y: 12,
				duration: 3,
				yoyo: true,
				repeat: -1,
				ease: 'sine.inOut',
				paused: true
			});

			tcaScrollTimeline.from(
				card,
				{
					y: '120vh',
					rotate: index % 2 === 0 ? '40deg' : '-40deg',
					ease: 'power4.out',
					duration: 1,
					onComplete: () => {
						floatTweens[index]?.play();
					},
					onReverseComplete: () => {
						floatTweens[index]?.pause();
						gsap.set(cardInners[index], { y: 0 });
					}
				},
				isFirstInPair ? `pair${pairIndex}` : `pair${pairIndex}+=0`
			);
		});

		const handleResize = () => {
			scatteredPositions = getScaledPositions();
			cardEls.forEach((card, index) => {
				const finalPos = scatteredPositions[index];
				gsap.set(card, {
					x: finalPos.x,
					y: finalPos.y,
					rotate: finalPos.rotate
				});
			});
			ScrollTrigger.refresh();
		};

		window.addEventListener('resize', handleResize);

		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);

		return () => {
			window.removeEventListener('resize', handleResize);
			ScrollTrigger.getAll().forEach((t) => t.kill());
			animationFrames.forEach((frame) => cancelAnimationFrame(frame));
			floatTweens.forEach((tween) => tween && tween.kill());
		};
	});
</script>

<section bind:this={sectionEl} class="relative overflow-hidden bg-background px-4">
	<div
		bind:this={pinContainerEl}
		class="tca-scroll-card-wrapper flex min-h-screen items-center justify-center"
	>
		<div
			class="relative mx-auto flex h-[400px] w-full items-center justify-center sm:h-[500px] md:h-[600px] lg:h-[800px]"
		>
			<div
				bind:this={textContainerEl}
				class="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-background/70 px-6 py-4 text-center backdrop-blur-sm"
			>
				<h2
					bind:this={headingEl}
					class="font-montserrat text-2xl font-bold text-tertiary md:text-4xl lg:text-6xl"
				>
					Meet Our Team
				</h2>
				<p
					bind:this={subtitleEl}
					class="mt-2 font-inter text-sm text-muted md:mt-4 md:text-base lg:text-lg"
				>
					Say hi to the team making ETHJKT happen.
				</p>
			</div>
			{#each teamMembers as member, i (member.image)}
				<div
					bind:this={cardEls[i]}
					class="tca-scroll-card absolute top-1/2 left-1/2 h-[150px] w-[112px] -translate-x-1/2 -translate-y-1/2 sm:h-[170px] sm:w-[128px] md:h-[200px] md:w-[150px] lg:h-[266px] lg:w-[200px]"
				>
					<div
						class="relative h-full w-full cursor-pointer touch-manipulation"
						role="button"
						tabindex="0"
						onmousemove={(e) => handleMouseMove(e, i)}
						onmouseenter={() => handleMouseEnter(i)}
						onmouseleave={() => handleMouseLeave(i)}
						ontouchmove={(e) => handleMouseMove(e, i)}
						ontouchstart={() => handleMouseEnter(i)}
						ontouchend={() => handleMouseLeave(i)}
					>
						<div
							bind:this={cardInners[i]}
							class="h-full w-full"
							style="transform-style: preserve-3d;"
						>
							<div
								bind:this={frontFaces[i]}
								class="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-xl"
							>
								<div class="relative h-full w-full overflow-hidden">
									<img
										src={member.image}
										alt={member.name}
										loading="lazy"
										class="h-full w-full object-cover"
									/>
									<div
										bind:this={shineOverlays[i]}
										class="pointer-events-none absolute inset-0 opacity-0"
									></div>
									<div
										class="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/80 via-black/40 to-transparent sm:h-16 md:h-20 lg:h-28"
									></div>
									<div
										bind:this={textContents[i]}
										class="absolute bottom-2 left-2 text-white md:bottom-3 md:left-3 lg:bottom-4 lg:left-4"
										style="transform-style: preserve-3d; transform: translateZ(0px);"
									>
										<h3
											class="font-montserrat text-xs font-bold drop-shadow-lg md:text-base lg:text-xl"
										>
											{member.name}
										</h3>
										<p
											class="font-inter text-[10px] opacity-90 drop-shadow-md md:text-xs lg:text-sm"
										>
											{member.role}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.tca-scroll-card,
	.tca-scroll-card-wrapper {
		transition: none !important;
	}

	.tca-scroll-card {
		opacity: 0;
		visibility: hidden;
	}

	.touch-manipulation {
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}
</style>

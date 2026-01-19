<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	const teamMembers = [
		{
			name: 'Revo',
			role: 'Community Lead',
			image: '/team/revo.png'
		},
		{
			name: 'Faisal',
			role: 'Developer Relations',
			image: '/team/faisal.png'
		},
		{
			name: 'Wildan',
			role: 'Developer Advocate',
			image: '/team/wildan.png'
		},
		{
			name: 'Rusty',
			role: 'Community Manager',
			image: '/team/rusty.png'
		}
	];

	let sectionEl: HTMLElement;
	let pinContainerEl: HTMLDivElement;
	let carouselEl: HTMLDivElement;
	let cardEls: HTMLDivElement[] = [];
	let frontFaces: HTMLDivElement[] = [];
	let billboardWrappers: HTMLDivElement[] = [];
	let cardInners: HTMLDivElement[] = [];
	let textContents: HTMLDivElement[] = [];
	let shineOverlays: HTMLDivElement[] = [];

	const radius = 350;
	const totalCards = teamMembers.length;

	// Tilt settings - matching React spring feel
	const rotateAmplitude = 14;
	const scaleOnHover = 1.1;
	const textDepth = 50; // translateZ for text in pixels

	// Store current rotation values for smooth interpolation
	let currentRotations: { x: number; y: number }[] = teamMembers.map(() => ({ x: 0, y: 0 }));
	let targetRotations: { x: number; y: number }[] = teamMembers.map(() => ({ x: 0, y: 0 }));
	let animationFrames: number[] = [];

	function handleMouseMove(e: MouseEvent, index: number) {
		const card = cardInners[index];
		if (!card) return;

		const rect = card.getBoundingClientRect();
		const offsetX = e.clientX - rect.left - rect.width / 2;
		const offsetY = e.clientY - rect.top - rect.height / 2;

		targetRotations[index] = {
			x: (offsetY / (rect.height / 2)) * -rotateAmplitude,
			y: (offsetX / (rect.width / 2)) * rotateAmplitude
		};

		// Update shine position
		if (shineOverlays[index]) {
			const shineX = ((e.clientX - rect.left) / rect.width) * 100;
			const shineY = ((e.clientY - rect.top) / rect.height) * 100;
			shineOverlays[index].style.background =
				`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
		}
	}

	function handleMouseEnter(index: number) {
		const card = cardInners[index];
		const textContent = textContents[index];
		const shine = shineOverlays[index];
		if (!card) return;

		// Start spring animation loop
		startSpringAnimation(index);

		gsap.to(card, {
			scale: scaleOnHover,
			duration: 0.4,
			ease: 'power2.out',
			overwrite: 'auto'
		});

		// Animate text forward in Z
		if (textContent) {
			gsap.to(textContent, {
				z: textDepth,
				duration: 0.4,
				ease: 'power2.out'
			});
		}

		// Show shine
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

		// Stop spring animation
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

		// Reset text Z
		if (textContent) {
			gsap.to(textContent, {
				z: 0,
				duration: 0.5,
				ease: 'power2.out'
			});
		}

		// Hide shine
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

		// Spring physics constants (similar to React spring)
		const stiffness = 0.08;
		const damping = 0.85;

		let velocityX = 0;
		let velocityY = 0;

		function animate() {
			const target = targetRotations[index];
			const current = currentRotations[index];

			// Spring physics
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

		// Wait for other ScrollTriggers to initialize first
		ScrollTrigger.refresh();

		// Position cards in a circle
		cardEls.forEach((card, i) => {
			const angle = (i / totalCards) * Math.PI * 2;
			const x = Math.sin(angle) * radius;
			const z = Math.cos(angle) * radius;
			const rotateY = (i / totalCards) * 360;

			gsap.set(card, {
				x: x,
				z: z,
				rotateY: -rotateY,
				transformOrigin: 'center center'
			});
		});

		// Initial face visibility update
		updateFaceVisibility(0);

		// Create pinned scroll animation
		const scrollDistance = window.innerHeight * 2;

		ScrollTrigger.create({
			trigger: sectionEl,
			start: 'top top',
			end: `+=${scrollDistance}`,
			pin: pinContainerEl,
			pinSpacing: true,
			scrub: 1,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				const rotation = self.progress * 360;
				gsap.set(carouselEl, { rotateY: rotation });
				updateFaceVisibility(rotation);
			}
		});

		function updateFaceVisibility(rotation: number) {
			cardEls.forEach((card, i) => {
				const cardAngle = (i / totalCards) * Math.PI * 2 + (rotation * Math.PI) / 180;
				const zPos = Math.cos(cardAngle);

				// Scale based on z position
				const scale = gsap.utils.mapRange(-1, 1, 0.6, 1.1, zPos);

				// Opacity based on z position
				const cardOpacity = gsap.utils.mapRange(-1, 1, 0.4, 1, zPos);

				// Shadow intensity
				const shadowBlur = gsap.utils.mapRange(-1, 1, 5, 30, zPos);
				const shadowOpacity = gsap.utils.mapRange(-1, 1, 0.1, 0.4, zPos);

				gsap.set(card, {
					scale: scale,
					opacity: cardOpacity,
					boxShadow: `0 ${shadowBlur / 2}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`
				});

				// Counter-rotate to always face the camera (billboard effect)
				// Card's base rotateY is -(i/totalCards)*360, carousel adds rotation
				// To face camera, counter with: baseAngle - rotation
				const baseAngle = (i / totalCards) * 360;
				const counterRotation = baseAngle - rotation;

				if (billboardWrappers[i]) {
					gsap.set(billboardWrappers[i], {
						rotateY: counterRotation
					});
				}
			});
		}

		// Entrance animation
		gsap.from(cardEls, {
			opacity: 0,
			scale: 0.5,
			stagger: 0.1,
			duration: 0.8,
			ease: 'back.out(1.7)',
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top 80%',
				toggleActions: 'play none none reverse'
			}
		});

		// Refresh after all triggers are set up to ensure proper ordering
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
			animationFrames.forEach((frame) => cancelAnimationFrame(frame));
		};
	});
</script>

<section bind:this={sectionEl} class="relative overflow-hidden bg-background">
	<!-- Pin container - this gets pinned -->
	<div bind:this={pinContainerEl} class="flex min-h-screen flex-col items-center justify-center">
		<!-- Section Header -->
		<div class="mb-12 text-center">
			<h2 class="font-montserrat text-4xl font-bold text-tertiary md:text-5xl">Meet Our Team</h2>
			<p class="mt-4 font-inter text-lg text-muted">Say hi to the team making ETHJKT happen.</p>
		</div>

		<!-- 3D Carousel Container -->
		<div
			class="relative flex h-[450px] w-full items-center justify-center"
			style="perspective: 1200px;"
		>
			<div
				bind:this={carouselEl}
				class="relative h-[350px] w-[280px]"
				style="transform-style: preserve-3d;"
			>
				{#each teamMembers as member, i (member.name)}
					<div
						bind:this={cardEls[i]}
						class="absolute top-0 left-0 h-[350px] w-[280px]"
						style="transform-style: preserve-3d;"
					>
						<!-- Hover trigger wrapper - stays static -->
						<div
							class="relative h-full w-full cursor-pointer"
							role="button"
							tabindex="0"
							onmousemove={(e) => handleMouseMove(e, i)}
							onmouseenter={() => handleMouseEnter(i)}
							onmouseleave={() => handleMouseLeave(i)}
						>
							<!-- Billboard wrapper - counter-rotates to face camera -->
							<div
								bind:this={billboardWrappers[i]}
								class="pointer-events-none h-full w-full"
								style="transform-style: preserve-3d;"
							>
								<!-- Card Inner - gets tilt/scale animated -->
								<div
									bind:this={cardInners[i]}
									class="h-full w-full"
									style="transform-style: preserve-3d;"
								>
									<!-- Front Face -->
									<div
										bind:this={frontFaces[i]}
										class="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-xl"
									>
										<div class="relative h-full w-full overflow-hidden">
											<img
												src={member.image}
												alt={member.name}
												class="h-full w-full object-cover"
											/>
											<!-- Dynamic shine effect overlay -->
											<div
												bind:this={shineOverlays[i]}
												class="pointer-events-none absolute inset-0 opacity-0"
											></div>
											<!-- Gradient overlay for text -->
											<div
												class="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/40 to-transparent"
											></div>
											<!-- Name and role - with 3D depth -->
											<div
												bind:this={textContents[i]}
												class="absolute bottom-6 left-6 text-white"
												style="transform-style: preserve-3d; transform: translateZ(0px);"
											>
												<h3 class="font-montserrat text-2xl font-bold drop-shadow-lg">
													{member.name}
												</h3>
												<p class="font-inter text-base opacity-90 drop-shadow-md">{member.role}</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="mt-8 flex flex-col items-center gap-2">
			<p class="font-inter text-sm text-muted">Scroll to explore</p>
			<div class="h-8 w-5 rounded-full border-2 border-muted/50 p-1">
				<div class="scroll-indicator h-2 w-full rounded-full bg-muted/50"></div>
			</div>
		</div>
	</div>
</section>

<style>
	.scroll-indicator {
		animation: scrollBounce 1.5s ease-in-out infinite;
	}

	@keyframes scrollBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(12px);
		}
	}
</style>

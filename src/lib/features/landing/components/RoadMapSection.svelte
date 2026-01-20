<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let stickySection: HTMLElement;
	let stickyHeader: HTMLDivElement;
	let cardContainer: HTMLDivElement;
	let card1: HTMLDivElement;
	let card2: HTMLDivElement;
	let card3: HTMLDivElement;
	let card4: HTMLDivElement;

	let isGapAnimationCompleted = false;
	let isFlipAnimationCompleted = false;

	const roadmapCards = [
		{
			number: '01',
			title: 'Meetups',
			bgColor: '#FFA6BF',
			img: '/src/lib/features/landing/assets/roadmap/placeholder.svg',
			alt: 'Meetups',
			description:
				'We regularly organise meetups that feature engaging discussions, presentations, and workshops on Ethereum and related topics, both in-person and online.'
		},
		{
			number: '02',
			title: 'Workshops',
			bgColor: '#7977DD',
			img: '/src/lib/features/landing/assets/roadmap/placeholder.svg',
			alt: 'Workshops',
			description:
				'We offer workshops for Ethereum development, smart contracts, and DApps. Suitable for all skill levels.'
		},
		{
			number: '03',
			title: 'Study Groups',
			bgColor: '#9FDDFF',
			img: '/src/lib/features/landing/assets/roadmap/placeholder.svg',
			alt: 'Study Groups',
			description:
				'We facilitate small study groups for individuals interested in Ethereum development, smart contracts, and decentralized applications (DApps).'
		},
		{
			number: '04',
			title: 'Hackathon',
			bgColor: '#9CFFFD',
			img: '/src/lib/features/landing/assets/roadmap/placeholder.svg',
			alt: 'Hackathon',
			description:
				'We organize hackathons centered around Ethereum development, smart contracts, and decentralized applications (DApps) for builders.'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const cards = [card1, card2, card3, card4];

		ScrollTrigger.create({
			trigger: stickySection,
			start: 'top top',
			end: () => `+=${window.innerHeight * 4}`,
			scrub: 1,
			pin: true,
			pinSpacing: true,
			onUpdate: (self) => {
				const progress = self.progress;

				if (progress >= 0.1 && progress <= 0.25) {
					const headerProgress = gsap.utils.mapRange(0.1, 0.25, 0, 1, progress);
					const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
					const opacityValue = gsap.utils.mapRange(0, 1, 0, 1, headerProgress);

					gsap.set(stickyHeader, {
						y: yValue,
						opacity: opacityValue
					});
				} else if (progress < 0.1) {
					gsap.set(stickyHeader, {
						y: 40,
						opacity: 0
					});
				} else if (progress > 0.25) {
					gsap.set(stickyHeader, {
						y: 0,
						opacity: 1
					});
				}

				if (progress >= 0.35 && !isGapAnimationCompleted) {
					gsap.to(cardContainer, {
						gap: '24px',
						duration: 0.5,
						ease: 'power3.out'
					});

					cards.forEach((card) => {
						gsap.to(card, {
							borderRadius: '24px',
							duration: 0.5,
							ease: 'power3.out'
						});
					});

					isGapAnimationCompleted = true;
				} else if (progress < 0.35 && isGapAnimationCompleted) {
					gsap.to(cardContainer, {
						gap: '0px',
						duration: 0.5,
						ease: 'power3.out'
					});

					gsap.to(card1, {
						borderRadius: '24px 0 0 24px',
						duration: 0.5,
						ease: 'power3.out'
					});

					gsap.to([card2, card3], {
						borderRadius: '0px',
						duration: 0.5,
						ease: 'power3.out'
					});

					gsap.to(card4, {
						borderRadius: '0 24px 24px 0',
						duration: 0.5,
						ease: 'power3.out'
					});

					isGapAnimationCompleted = false;
				}

				if (progress >= 0.7 && !isFlipAnimationCompleted) {
					cards.forEach((card, i) => {
						gsap.to(card, {
							rotationY: 180,
							duration: 0.75,
							ease: 'power3.inOut',
							delay: i * 0.1
						});
					});

					// Increase gap between cards when flipped
					gsap.to(cardContainer, {
						gap: '48px',
						duration: 0.75,
						ease: 'power3.inOut'
					});

					// Move card1 left and up, card4 slightly left and up for better balance
					gsap.to(card1, {
						y: 30,
						x: -40,
						rotationZ: -8,
						duration: 0.75,
						ease: 'power3.inOut'
					});

					gsap.to(card4, {
						y: 30,
						x: -5,
						rotationZ: 8,
						duration: 0.75,
						ease: 'power3.inOut'
					});

					isFlipAnimationCompleted = true;
				} else if (progress < 0.7 && isFlipAnimationCompleted) {
					cards.forEach((card, i) => {
						gsap.to(card, {
							rotationY: 0,
							duration: 0.75,
							ease: 'power3.inOut',
							delay: (cards.length - 1 - i) * 0.1
						});
					});

					// Reset gap
					gsap.to(cardContainer, {
						gap: '24px',
						duration: 0.75,
						ease: 'power3.inOut'
					});

					// Reset card1 and card4 positions
					gsap.to([card1, card4], {
						y: 0,
						x: 0,
						rotationZ: 0,
						duration: 0.75,
						ease: 'power3.inOut'
					});

					isFlipAnimationCompleted = false;
				}
			}
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section bind:this={stickySection} class="sticky-section bg-background">
	<div bind:this={stickyHeader} class="sticky-header">
		<h1 class="font-montserrat text-4xl font-bold text-tertiary md:text-5xl lg:text-6xl">
			Our Roadmap
		</h1>
		<p class="mx-auto mt-3 max-w-xl font-inter text-lg text-muted md:text-xl">
			Journey through our milestones and future plans.
		</p>
	</div>

	<div class="sticky-content">
		<div bind:this={cardContainer} class="card-container">
			<div bind:this={card1} class="roadmap-card" id="card-1">
				<div class="card-front"></div>
				<div class="card-back">
					<div class="card-back-content">
						<div class="card-image-container" style="background-color: {roadmapCards[0].bgColor};">
							<img src={roadmapCards[0].img} alt={roadmapCards[0].alt} />
						</div>
						<h3 class="card-title">{roadmapCards[0].title}</h3>
						<p class="card-description">{roadmapCards[0].description}</p>
					</div>
				</div>
			</div>

			<div bind:this={card2} class="roadmap-card" id="card-2">
				<div class="card-front"></div>
				<div class="card-back">
					<div class="card-back-content">
						<div class="card-image-container" style="background-color: {roadmapCards[1].bgColor};">
							<img src={roadmapCards[1].img} alt={roadmapCards[1].alt} />
						</div>
						<h3 class="card-title">{roadmapCards[1].title}</h3>
						<p class="card-description">{roadmapCards[1].description}</p>
					</div>
				</div>
			</div>

			<div bind:this={card3} class="roadmap-card" id="card-3">
				<div class="card-front"></div>
				<div class="card-back">
					<div class="card-back-content">
						<div class="card-image-container" style="background-color: {roadmapCards[2].bgColor};">
							<img src={roadmapCards[2].img} alt={roadmapCards[2].alt} />
						</div>
						<h3 class="card-title">{roadmapCards[2].title}</h3>
						<p class="card-description">{roadmapCards[2].description}</p>
					</div>
				</div>
			</div>

			<div bind:this={card4} class="roadmap-card" id="card-4">
				<div class="card-front"></div>
				<div class="card-back">
					<div class="card-back-content">
						<div class="card-image-container" style="background-color: {roadmapCards[3].bgColor};">
							<img src={roadmapCards[3].img} alt={roadmapCards[3].alt} />
						</div>
						<h3 class="card-title">{roadmapCards[3].title}</h3>
						<p class="card-description">{roadmapCards[3].description}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.sticky-section {
		position: relative;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		overflow: hidden;
	}

	.sticky-header {
		position: absolute;
		top: 15%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		will-change: transform, opacity;
		opacity: 0;
		z-index: 10;
	}

	.sticky-header h1 {
		margin: 0;
	}

	.sticky-header p {
		margin-top: 1rem;
	}

	.sticky-content {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-container {
		position: relative;
		width: 92%;
		max-width: 2200px;
		height: 70vh;
		max-height: 650px;
		display: flex;
		gap: 0px;
		perspective: 1000px;
		will-change: width, gap;
		margin: 0 auto;
	}

	.roadmap-card {
		position: relative;
		flex: 1;
		height: 100%;
		min-width: 380px;
		max-width: 550px;
		transform-style: preserve-3d;
		transform-origin: top;
	}

	#card-1 {
		border-radius: 24px 0 0 24px;
	}

	#card-2,
	#card-3 {
		border-radius: 0;
	}

	#card-4 {
		border-radius: 0 24px 24px 0;
	}

	.card-front,
	.card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		border-radius: inherit;
		overflow: hidden;
	}

	.card-front {
		background: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-back {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		transform: rotateY(180deg);
		padding: 1.25rem 0.5rem;
		background: white;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	}

	.card-back-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.card-image-container {
		width: 90%;
		max-width: none;
		aspect-ratio: 1.2;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		margin-bottom: 1.25rem;
	}

	.card-image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 1rem 0;
		line-height: 1.2;
		text-align: center;
	}

	.card-description {
		font-family: 'Inter', sans-serif;
		font-size: clamp(1rem, 1.4vw, 1.2rem);
		line-height: 1.6;
		color: #666;
		margin: 0;
		text-align: center;
		max-width: 90%;
	}

	@media (max-width: 1024px) {
		.card-container {
			width: 85%;
		}

		.card-title {
			font-size: 1.5rem;
		}

		.card-description {
			font-size: 1.05rem;
		}
	}

	@media (max-width: 768px) {
		.sticky-section {
			height: auto;
			padding: 4rem 2rem;
		}

		.card-container {
			flex-direction: column;
			width: 100%;
			max-width: 400px;
			gap: 2rem !important;
			transform: none;
		}

		.roadmap-card {
			width: 100%;
			border-radius: 20px !important;
		}

		.card-title {
			font-size: 1.25rem;
		}

		.card-description {
			font-size: 1rem;
		}
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import brandIcon from '$lib/assets/logo-ethjkt-1.png';

	let stickySection: HTMLElement;
	let stickyHeader: HTMLDivElement;
	let cardContainer: HTMLDivElement;
	let cardEls: HTMLDivElement[] = [];

	let isGapAnimationCompleted = false;
	let isFlipAnimationCompleted = false;

	const roadmapCards = [
		{
			number: '01',
			title: 'Meetups',
			bgColor: '#FFA6BF',
			description:
				'We regularly organise meetups that feature engaging discussions, presentations, and workshops on Ethereum and related topics, both in-person and online.'
		},
		{
			number: '02',
			title: 'Workshops',
			bgColor: '#7977DD',
			description:
				'We offer workshops for Ethereum development, smart contracts, and DApps. Suitable for all skill levels.'
		},
		{
			number: '03',
			title: 'Study Groups',
			bgColor: '#9FDDFF',
			description:
				'We facilitate small study groups for individuals interested in Ethereum development, smart contracts, and decentralized applications (DApps).'
		},
		{
			number: '04',
			title: 'Hackathon',
			bgColor: '#9CFFFD',
			description:
				'We organize hackathons centered around Ethereum development, smart contracts, and decentralized applications (DApps) for builders.'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Below this the cards are stacked by CSS; pinning and flipping them there just
		// fought the layout with inline transforms and left cards mid-rotation.
		const desktop = window.matchMedia('(min-width: 1025px)');
		if (!desktop.matches) {
			const onChange = () => desktop.matches && window.location.reload();
			desktop.addEventListener('change', onChange);
			return () => desktop.removeEventListener('change', onChange);
		}

		const cards = cardEls;

		ScrollTrigger.create({
			trigger: stickySection,
			start: 'top top',
			end: () => `+=${window.innerHeight * 2}`,
			scrub: 0.5,
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

					gsap.to(cardEls[0], {
						borderRadius: '24px 0 0 24px',
						duration: 0.5,
						ease: 'power3.out'
					});

					gsap.to([cardEls[1], cardEls[2]], {
						borderRadius: '0px',
						duration: 0.5,
						ease: 'power3.out'
					});

					gsap.to(cardEls[3], {
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
					gsap.to(cardEls[0], {
						y: 30,
						x: -40,
						rotationZ: -8,
						duration: 0.75,
						ease: 'power3.inOut'
					});

					gsap.to(cardEls[3], {
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
					gsap.to([cardEls[0], cardEls[3]], {
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
			{#each roadmapCards as card, i (card.number)}
				<div bind:this={cardEls[i]} class="roadmap-card" id="card-{i + 1}">
					<div class="card-front">
						<img class="card-brand-icon" src={brandIcon} alt="ETHJKT" />
						<h3 class="card-front-title">{card.title}</h3>
					</div>
					<div class="card-back">
						<div class="card-back-content">
							<div class="card-image-container" style="background-color: {card.bgColor};">
								<span class="card-image-number">{card.number}</span>
							</div>
							<h3 class="card-title">{card.title}</h3>
							<p class="card-description">{card.description}</p>
						</div>
					</div>
				</div>
			{/each}
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
		flex: 1 1 0;
		height: 100%;
		min-width: 0;
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
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1.5rem;
		text-align: center;
		background-color: var(--color-background);
		background-image: radial-gradient(
			color-mix(in srgb, var(--color-foreground) 8%, transparent) 2px,
			transparent 2px
		);
		background-size: 22px 22px;
		border: 1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent);
	}

	.card-brand-icon {
		width: clamp(4rem, 12vw, 8rem);
		height: auto;
	}

	.card-front-title {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 700;
		margin: 0;
		color: var(--color-foreground);
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

	.card-image-number {
		font-family: 'Montserrat', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1;
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

	/* Below 1025px four cards can't be read side by side, so stack them and skip the
	   flip choreography entirely (onMount bails at the same breakpoint). */
	@media (max-width: 1024px) {
		.sticky-section {
			/* The section is a centring flex row; once the header is in flow it must stack. */
			flex-direction: column;
			height: auto;
			min-height: 0;
			padding: 3rem 1rem;
			overflow: visible;
		}

		.sticky-header {
			position: static;
			transform: none;
			opacity: 1;
			margin-bottom: 2.5rem;
		}

		.sticky-content {
			height: auto;
		}

		.card-container {
			flex-direction: column;
			width: 100%;
			max-width: min(420px, 100%);
			height: auto;
			max-height: none;
			gap: 1.5rem;
			perspective: none;
		}

		.roadmap-card {
			width: 100%;
			max-width: none;
			height: auto;
			border-radius: 20px;
			transform: none !important;
			transform-style: flat;
		}

		/* Show the informative face directly instead of the flip target. */
		.card-front {
			display: none;
		}

		.card-back {
			position: relative;
			height: auto;
			transform: none;
			backface-visibility: visible;
			border-radius: 20px;
			padding: 1.25rem;
		}

		.card-image-container {
			width: 100%;
			aspect-ratio: 1.8;
			margin-bottom: 1rem;
		}

		.card-title {
			font-size: 1.25rem;
		}

		.card-description {
			font-size: 1rem;
			max-width: 100%;
		}
	}
</style>

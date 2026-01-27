<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import AboutLeftImage from '$lib/features/landing/assets/about/about_left.svg';
	import AboutGlobal from '$lib/features/landing/assets/about/about_global.svg';
	import AboutInnovation from '$lib/features/landing/assets/about/about_innovation.svg';
	import AboutLearn from '$lib/features/landing/assets/about/about_learn.svg';
	import AboutNetworking from '$lib/features/landing/assets/about/about_networking.svg';

	let aboutSection: HTMLElement;
	let titleContainer: HTMLDivElement;
	let subtitleElement: HTMLParagraphElement;
	let pinnedContent: HTMLDivElement;
	let cardsWrapper: HTMLDivElement;
	let cardElements: HTMLDivElement[] = [];
	let imageElements: HTMLImageElement[] = [];
	let imageContainer: HTMLDivElement;
	let cardsContainer: HTMLDivElement;

	const cards = [
		{
			icon: AboutGlobal,
			title: 'Global Exposures',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			bgColor: 'bg-secondary',
			textColor: 'text-tertiary',
			image: AboutLeftImage
		},
		{
			icon: AboutInnovation,
			title: 'Innovation & Building',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			bgColor: 'bg-tertiary',
			textColor: 'text-white',
			image: AboutLeftImage
		},
		{
			icon: AboutLearn,
			title: 'Learn From Industry Experts',
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			bgColor: 'bg-white',
			textColor: 'text-tertiary',
			image: AboutLeftImage
		},
		{
			icon: AboutNetworking,
			title: 'Networking Opportunities',
			description:
				'ETHJKT will gather the brightest minds in blockchain, offering you a chance to connect with developers, entrepreneurs, and Web3 enthusiasts.',
			bgColor: 'bg-primary',
			textColor: 'text-tertiary',
			image: AboutLeftImage
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const titleWords = titleContainer.querySelectorAll('.title-word');
		const subtitleWords = subtitleElement.querySelectorAll('.subtitle-word');

		titleWords.forEach((word, i) => {
			gsap.set(word, {
				y: 100,
				opacity: 0,
				rotateX: -90,
				rotateZ: i % 2 === 0 ? -15 : 15,
				scale: 0.5,
				filter: 'blur(10px)'
			});
		});

		subtitleWords.forEach((word) => {
			gsap.set(word, {
				y: 50,
				opacity: 0,
				rotateX: -45,
				scale: 0.8,
				filter: 'blur(12px)'
			});
		});

		const titleTl = gsap.timeline({
			scrollTrigger: {
				trigger: aboutSection,
				start: 'top 85%',
				end: 'top 0%',
				scrub: 4,
				toggleActions: 'play reverse play reverse'
			}
		});

		titleWords.forEach((word, i) => {
			titleTl.to(
				word,
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					rotateZ: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: 1,
					ease: 'power3.out'
				},
				i * 0.15
			);
		});

		subtitleWords.forEach((word, i) => {
			titleTl.to(
				word,
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					scale: 1,
					filter: 'blur(0px)',
					duration: 0.8,
					ease: 'power2.out'
				},
				0.5 + i * 0.08
			);
		});

		gsap.to(titleContainer, {
			scrollTrigger: {
				trigger: aboutSection,
				start: 'top 60%',
				end: 'bottom top',
				scrub: 5
			},
			y: -50,
			rotateX: 5,
			scale: 0.95,
			ease: 'none'
		});

		gsap.to(subtitleElement, {
			scrollTrigger: {
				trigger: aboutSection,
				start: 'top 60%',
				end: 'bottom top',
				scrub: 5
			},
			y: -25,
			opacity: 0.7,
			scale: 0.98,
			ease: 'none'
		});

		const cardCount = cardElements.length;
		const scrollPerCard = 1200;
		const peekHeight = window.innerWidth >= 1024 ? 82 : 60;

		gsap.set(imageContainer, {
			x: -400,
			y: 100,
			rotateY: -75,
			rotateZ: -15,
			opacity: 0,
			scale: 0.6
		});

		gsap.set(cardsContainer, {
			x: 400,
			y: 100,
			rotateY: 75,
			rotateZ: 15,
			opacity: 0,
			scale: 0.6
		});

		gsap.to(imageContainer, {
			scrollTrigger: {
				trigger: pinnedContent,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 3,
				toggleActions: 'play reverse play reverse'
			},
			x: 0,
			y: 0,
			rotateY: 0,
			rotateZ: 0,
			opacity: 1,
			scale: 1,
			ease: 'power3.out'
		});

		gsap.to(cardsContainer, {
			scrollTrigger: {
				trigger: pinnedContent,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 3,
				toggleActions: 'play reverse play reverse'
			},
			x: 0,
			y: 0,
			rotateY: 0,
			rotateZ: 0,
			opacity: 1,
			scale: 1,
			ease: 'power3.out'
		});

		cardElements.forEach((card, i) => {
			gsap.set(card, {
				y: i * peekHeight,
				x: 0,
				rotation: 0,
				scale: 1,
				opacity: 1,
				zIndex: i
			});
		});

		imageElements.forEach((img, i) => {
			gsap.set(img, {
				opacity: i === cardCount - 1 ? 1 : 0,
				scale: i === cardCount - 1 ? 1 : 0.8,
				rotateY: i === cardCount - 1 ? 0 : -25,
				x: i === cardCount - 1 ? 0 : -100,
				zIndex: i === cardCount - 1 ? 1 : 0,
				filter: i === cardCount - 1 ? 'blur(0px)' : 'blur(10px)'
			});
		});

		const cardsTl = gsap.timeline({
			scrollTrigger: {
				trigger: pinnedContent,
				start: 'top 20%',
				end: `+=${(cardCount - 1) * scrollPerCard}`,
				pin: true,
				pinSpacing: true,
				scrub: 2,
				anticipatePin: 1,
				invalidateOnRefresh: true
			}
		});

		for (let step = 0; step < cardCount - 1; step++) {
			const flyingCardIndex = cardCount - 1 - step;
			const flyingCard = cardElements[flyingCardIndex];

			const flyDirection = step % 2 === 0 ? 1 : -1;
			const flyX = flyDirection * 400;
			const flyRotation = flyDirection * 15;

			const currentImageIndex = cardCount - 1 - step;
			const nextImageIndex = cardCount - 2 - step;

			if (currentImageIndex >= 0 && currentImageIndex < imageElements.length) {
				cardsTl.to(
					imageElements[currentImageIndex],
					{
						opacity: 0,
						scale: 0.7,
						rotateY: 25,
						x: 100,
						filter: 'blur(15px)',
						zIndex: 0,
						duration: 0.7,
						ease: 'power2.in'
					},
					step
				);
			}

			if (nextImageIndex >= 0 && nextImageIndex < imageElements.length) {
				cardsTl.set(
					imageElements[nextImageIndex],
					{
						opacity: 0,
						scale: 0.8,
						rotateY: -25,
						x: -100,
						filter: 'blur(10px)',
						zIndex: 0
					},
					step
				);

				cardsTl.to(
					imageElements[nextImageIndex],
					{
						opacity: 1,
						scale: 1,
						rotateY: 0,
						x: 0,
						filter: 'blur(0px)',
						zIndex: 1,
						duration: 0.8,
						ease: 'power2.out'
					},
					step + 0.3
				);
			}

			cardsTl.to(
				flyingCard,
				{
					x: flyX,
					y: -80,
					rotation: flyRotation,
					scale: 0.85,
					opacity: 0.3,
					duration: 0.5,
					ease: 'power2.in'
				},
				step
			);

			cardsTl.to(
				flyingCard,
				{
					x: 0,
					y: 0,
					rotation: 0,
					scale: 1,
					opacity: 1,
					zIndex: 0,
					duration: 0.5,
					ease: 'power2.out'
				},
				step + 0.5
			);

			for (let i = 0; i < flyingCardIndex; i++) {
				const card = cardElements[i];
				const newY = (i + 1) * peekHeight + step * peekHeight;

				cardsTl.to(
					card,
					{
						y: newY,
						zIndex: i + 1,
						duration: 1,
						ease: 'power2.inOut'
					},
					step
				);
			}

			for (let i = flyingCardIndex + 1; i < cardCount; i++) {
				const card = cardElements[i];
				cardsTl.to(
					card,
					{
						y: `+=${peekHeight}`,
						duration: 1,
						ease: 'power2.inOut'
					},
					step
				);
			}
		}

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section
	bind:this={aboutSection}
	class="relative z-10 overflow-hidden bg-background py-16 lg:py-24"
>
	<div class="container mx-auto px-4 lg:px-16">
		<div class="mb-12 text-center lg:mb-16">
			<div
				bind:this={titleContainer}
				class="title-wrapper font-montserrat text-4xl font-bold text-tertiary md:text-5xl lg:text-6xl"
				style="perspective: 1000px;"
			>
				<h2 class="flex flex-wrap items-center justify-center gap-x-4">
					<span class="title-word inline-block">Welcome</span>
					<span class="title-word inline-block">to</span>
					<span class="title-word inline-block">ETHJKT</span>
				</h2>
			</div>
			<p
				bind:this={subtitleElement}
				class="mx-auto mt-3 max-w-xl font-inter text-lg text-muted md:text-xl"
			>
				<span class="subtitle-word inline-block">Let's</span>
				<span class="subtitle-word inline-block">learn,</span>
				<span class="subtitle-word inline-block">build,</span>
				<span class="subtitle-word inline-block">and</span>
				<span class="subtitle-word inline-block">grow</span>
				<span class="subtitle-word inline-block">in</span>
				<span class="subtitle-word inline-block">the</span>
				<span class="subtitle-word inline-block">Web3</span>
				<span class="subtitle-word inline-block">space</span>
				<span class="subtitle-word inline-block">together.</span>
			</p>
		</div>

		<div
			bind:this={pinnedContent}
			class="content-section flex flex-col items-center gap-8 bg-background lg:flex-row lg:items-center lg:justify-center lg:gap-12"
		>
			<div
				bind:this={imageContainer}
				class="image-container relative mx-auto w-full max-w-[400px] sm:max-w-[500px] lg:mx-0 lg:w-[45%] lg:max-w-[628px] lg:shrink"
			>
				{#each cards as card, index (card.title)}
					<img
						bind:this={imageElements[index]}
						src={card.image}
						alt="{card.title} illustration"
						class="about-image absolute top-0 left-0 h-auto w-full"
					/>
				{/each}
			</div>

			<div
				bind:this={cardsContainer}
				class="cards-container relative w-full max-w-[400px] sm:max-w-[500px] lg:w-[45%] lg:max-w-[638px] lg:shrink"
			>
				<div
					bind:this={cardsWrapper}
					class="cards-wrapper relative mx-auto h-[380px] w-full lg:h-[518px]"
					style="perspective: 1200px;"
				>
					{#each cards as card, index (card.title)}
						<div
							bind:this={cardElements[index]}
							class="{card.bgColor} card-item absolute top-0 right-0 left-0 flex h-[200px] flex-col rounded-[28px] px-6 pt-5 lg:h-[272px] lg:rounded-[54px] lg:px-8 lg:pt-7"
						>
							<div class="flex items-center gap-3 lg:gap-4">
								<img
									src={card.icon}
									alt={card.title}
									class="h-8 w-8 shrink-0 md:h-10 md:w-10 lg:h-11 lg:w-11"
								/>
								<h3
									class="font-montserrat text-xl font-bold {card.textColor} md:text-2xl lg:text-3xl"
								>
									{card.title}
								</h3>
							</div>

							<p
								class="mt-4 pb-5 font-inter text-base leading-relaxed {card.textColor} md:text-lg lg:mt-5 lg:pb-0 lg:text-xl lg:leading-relaxed"
							>
								{card.description}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.title-wrapper {
		overflow: visible;
		perspective: 1500px;
		transform-style: preserve-3d;
	}

	.title-word,
	.subtitle-word {
		transform-style: preserve-3d;
		will-change: transform, opacity, filter;
		backface-visibility: hidden;
		display: inline-block;
	}

	.subtitle-word {
		margin-right: 0.3em;
	}

	.subtitle-word:last-child {
		margin-right: 0;
	}

	.content-section {
		perspective: 2500px;
		perspective-origin: center center;
	}

	.image-container {
		aspect-ratio: 628 / 397;
		overflow: visible;
		transform-style: preserve-3d;
		will-change: transform, opacity;
		backface-visibility: hidden;
		min-width: 0;
	}

	@media (min-width: 1024px) {
		.content-section {
			max-width: 1400px;
			margin-left: auto;
			margin-right: auto;
		}
	}

	.cards-container {
		transform-style: preserve-3d;
		will-change: transform, opacity;
		backface-visibility: hidden;
		min-width: 0;
	}

	.cards-wrapper {
		transform-style: preserve-3d;
		overflow: visible;
	}

	.card-item {
		transform-style: preserve-3d;
		transform-origin: center center;
		will-change: transform, opacity;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.about-image {
		will-change: opacity, transform, filter;
		object-fit: contain;
		transform-style: preserve-3d;
		backface-visibility: hidden;
	}

	@media (max-width: 1023px) {
		.image-container {
			aspect-ratio: 1 / 1;
		}
	}
</style>

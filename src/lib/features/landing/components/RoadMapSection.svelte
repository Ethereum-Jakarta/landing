<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let roadmapSection: HTMLElement;
	let titleContainer: HTMLDivElement;
	let subtitleElement: HTMLParagraphElement;

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
				trigger: roadmapSection,
				start: 'top 85%',
				end: 'top 40%',
				scrub: 1.5,
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
				trigger: roadmapSection,
				start: 'top 60%',
				end: 'bottom top',
				scrub: 2
			},
			y: -50,
			rotateX: 5,
			scale: 0.95,
			ease: 'none'
		});

		gsap.to(subtitleElement, {
			scrollTrigger: {
				trigger: roadmapSection,
				start: 'top 60%',
				end: 'bottom top',
				scrub: 2
			},
			y: -25,
			opacity: 0.7,
			scale: 0.98,
			ease: 'none'
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section
	bind:this={roadmapSection}
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
					<span class="title-word inline-block">Our</span>
					<span class="title-word inline-block">Roadmap</span>
				</h2>
			</div>
			<p
				bind:this={subtitleElement}
				class="mx-auto mt-3 max-w-xl font-inter text-lg text-muted md:text-xl"
			>
				<span class="subtitle-word inline-block">Journey</span>
				<span class="subtitle-word inline-block">through</span>
				<span class="subtitle-word inline-block">our</span>
				<span class="subtitle-word inline-block">milestones</span>
				<span class="subtitle-word inline-block">and</span>
				<span class="subtitle-word inline-block">future</span>
				<span class="subtitle-word inline-block">plans.</span>
			</p>
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
</style>

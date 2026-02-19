<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import Logo from '$lib/components/atoms/Logo.svelte';

	interface Props {
		onComplete: () => void;
	}

	let { onComplete }: Props = $props();

	let loadingScreen: HTMLDivElement;
	let logoContainer: HTMLDivElement;
	let progressBar: HTMLDivElement;
	let progressFill: HTMLDivElement;
	let loadingText: HTMLSpanElement;

	let progress = $state(0);
	let isLoaded = $state(false);

	onMount(() => {
		// Simulate asset loading with progress
		const loadAssets = async () => {
			// Wait for fonts
			await document.fonts.ready;

			// Simulate loading progress
			const duration = 2000; // 2 seconds
			const startTime = Date.now();

			const updateProgress = () => {
				const elapsed = Date.now() - startTime;
				progress = Math.min((elapsed / duration) * 100, 100);

				if (progress < 100) {
					requestAnimationFrame(updateProgress);
				} else {
					isLoaded = true;
					playIntroAnimation();
				}
			};

			updateProgress();
		};

		loadAssets();
	});

	function playIntroAnimation() {
		const tl = gsap.timeline();

		// Logo scales up and fades
		tl.to(logoContainer, {
			scale: 1.2,
			duration: 0.5,
			ease: 'power2.in'
		})
			// Loading bar fades out
			.to(
				[progressBar, loadingText],
				{
					opacity: 0,
					y: 20,
					duration: 0.3
				},
				'<'
			)
			// Trigger hero animations RIGHT BEFORE sliding away
			.call(() => {
				onComplete();
			})
			// Falling effect - screen moves up rapidly (we fall down)
			.to(loadingScreen, {
				yPercent: -100,
				duration: 0.8,
				ease: 'power3.in'
			})
			// Logo flies up and away
			.to(
				logoContainer,
				{
					y: -200,
					opacity: 0,
					scale: 0.5,
					duration: 0.5,
					ease: 'power2.in'
				},
				'<'
			);
	}
</script>

<div
	bind:this={loadingScreen}
	class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-secondary"
>
	<!-- Sky gradient overlay -->
	<div
		class="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-background opacity-50"
	></div>

	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-8">
		<!-- Logo -->
		<div bind:this={logoContainer} class="mb-4">
			<Logo height={64} />
		</div>

		<!-- Loading text -->
		<span bind:this={loadingText} class="font-inter text-lg text-white/80">
			{#if isLoaded}
				Ready!
			{:else}
				Loading... {Math.round(progress)}%
			{/if}
		</span>

		<!-- Progress bar -->
		<div bind:this={progressBar} class="h-1 w-64 overflow-hidden rounded-full bg-white/20">
			<div
				bind:this={progressFill}
				class="h-full rounded-full bg-primary transition-all duration-100"
				style="width: {progress}%"
			></div>
		</div>
	</div>

	<!-- Decorative clouds at bottom -->
	<div
		class="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white/10 to-transparent"
	></div>
</div>

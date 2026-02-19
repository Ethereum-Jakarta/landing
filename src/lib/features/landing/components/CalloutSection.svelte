<script>
	import Button from '$lib/components/atoms/Button.svelte';
	import Fly from '../assets/Fly.svelte';
	import Monas from '../assets/Monas.svelte';
	import Run1 from '../assets/Run1.svelte';
	import Run2 from '../assets/Run2.svelte';
	import Run3 from '../assets/Run3.svelte';
	import Wave from './Wave.svelte';
	import Cloud from '$lib/components/atoms/Cloud.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
</script>

<section
	class="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background to-secondary py-16 md:min-h-screen md:py-0"
>
	<!-- Clouds -->
	<Cloud class="absolute top-1/4 -left-10 w-24 text-white opacity-90 md:w-40" />
	<Cloud class="absolute top-1/3 left-10 w-16 text-white opacity-70 md:left-20 md:w-24" />
	<Cloud class="absolute top-[28%] left-32 hidden w-16 text-white opacity-50 md:left-56 md:block" />
	<Cloud class="absolute top-[45%] right-10 w-20 text-white opacity-60 md:right-20 md:w-28" />
	<Cloud class="absolute top-1/3 right-0 hidden w-20 text-white opacity-40 md:block" />

	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-6 px-4 text-center md:gap-8">
		<h2
			class="font-montserrat text-2xl font-bold text-tertiary sm:text-3xl md:text-5xl lg:text-6xl"
		>
			Curious About Web3? Let's<br />Learn It Together
		</h2>

		<!-- Buttons -->
		<div
			class="flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
		>
			<Button
				href="https://discord.gg/ethjkt"
				size="sm"
				class="gap-2 px-4 py-3 sm:gap-3 md:px-6 md:py-3 md:text-base"
			>
				<DiscordIcon class="h-6 w-6" />
				<span class="sm:hidden">Join Discord</span>
				<span class="hidden sm:inline"><span>Join the<br />Community</span></span>
			</Button>

			<Button
				href="https://instagram.com/ethjkt"
				size="sm"
				class="gap-2 px-4 py-3 sm:gap-3 md:px-6 md:py-3 md:text-base"
			>
				<InstagramIcon class="h-6 w-6" />
				<span class="sm:hidden">Follow Instagram</span>
				<span class="hidden sm:inline"><span>Follow On<br />Instagram</span></span>
			</Button>

			<Button
				href="https://x.com/ethjkt"
				size="sm"
				class="gap-2 px-4 py-3 sm:gap-3 md:px-6 md:py-3 md:text-base"
			>
				<XTwitterIcon class="h-6 w-6" />
				<span class="sm:hidden">Follow on X</span>
				<span class="hidden sm:inline"><span>Hang Out on X</span></span>
			</Button>
		</div>
	</div>

	<Fly class="absolute right-5 bottom-50 hidden md:right-10 md:block" />
	<Run1 class="absolute bottom-5 left-10 hidden sm:block md:w-auto" />
	<Run2 class="absolute right-20 bottom-5 hidden lg:right-80 lg:block" />
	<Run3 class="absolute bottom-5 left-100 hidden md:block" />
	<Monas class="absolute right-0 bottom-10 left-0 -z-2 mx-auto hidden sm:block md:w-auto" />
	<Wave class="absolute right-0 bottom-0 left-0 -z-1 w-full min-w-361" />
</section>

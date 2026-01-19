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
	class="relative isolate flex h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background to-secondary"
>
	<!-- Clouds -->
	<Cloud class="absolute top-1/4 -left-10 w-40 text-white opacity-90" />
	<Cloud class="absolute top-1/3 left-20 w-24 text-white opacity-70" />
	<Cloud class="absolute top-[28%] left-56 w-16 text-white opacity-50" />
	<Cloud class="absolute top-[45%] right-20 w-28 text-white opacity-60" />
	<Cloud class="absolute top-1/3 right-0 w-20 text-white opacity-40" />

	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
		<h2 class="font-montserrat text-4xl font-bold text-tertiary md:text-5xl lg:text-6xl">
			Curious About Web3? Let's<br />Learn It Together
		</h2>

		<!-- Buttons -->
		<div class="flex flex-wrap justify-center gap-4">
			<Button href="https://discord.gg/ethjkt" class="gap-3">
				<DiscordIcon />
				<span>Join the<br />Community</span>
			</Button>

			<Button href="https://instagram.com/ethjkt" class="gap-3">
				<InstagramIcon />
				<span>Follow On<br />Instagram</span>
			</Button>

			<Button href="https://x.com/ethjkt" class="gap-3">
				<XTwitterIcon />
				<span>Hang Out on X</span>
			</Button>
		</div>
	</div>

	<Fly class="absolute right-10 bottom-50" />
	<Run1 class="absolute bottom-5 left-10" />
	<Run2 class="absolute right-80 bottom-5" />
	<Run3 class="absolute bottom-5 left-100" />
	<Monas class="absolute right-0 bottom-10 left-0 -z-2 mx-auto" />
	<Wave class="absolute right-0 bottom-0 left-0 -z-1 w-full min-w-361" />
</section>

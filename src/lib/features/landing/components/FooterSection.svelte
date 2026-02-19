<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
	import Dawaey from '../assets/Dawaey.svelte';
</script>

<footer
	class="relative flex min-h-72 flex-col justify-between overflow-hidden bg-very-tertiary px-5 py-8 text-tertiary-foreground sm:px-10 sm:py-10 lg:min-h-96 lg:px-16 lg:py-12"
>
	<!-- Top section -->
	<div class="flex flex-col gap-4 sm:gap-6">
		<Logo useAlt class="-translate-x-4 sm:-translate-x-7" />
		<p class="max-w-md font-inter text-sm leading-relaxed text-tertiary-foreground/90 sm:text-base">
			Build, innovate, and connect with the<br />Ethereum community in Indonesia.
		</p>
		<!-- Social icons -->
		<div class="flex items-center gap-4 max-sm:[&_svg]:size-4 mb-4">
			<a
				href="https://discord.gg/ethjkt"
				class="text-tertiary-foreground transition-opacity hover:opacity-70"
			>
				<DiscordIcon />
			</a>
			<a
				href="https://instagram.com/ethjkt"
				class="text-tertiary-foreground transition-opacity hover:opacity-70"
			>
				<InstagramIcon />
			</a>
			<a
				href="https://x.com/ethjkt"
				class="text-tertiary-foreground transition-opacity hover:opacity-70"
			>
				<XTwitterIcon />
			</a>
		</div>
	</div>

	<!-- Bottom section -->
	<p class="font-inter text-xs text-tertiary-foreground/70 sm:text-sm">
		© {new Date().getFullYear()} ETHJKT. All rights reserved
	</p>

	<!-- Character illustration -->
	<Dawaey class="absolute right-5 bottom-0 hidden sm:block md:right-10 lg:right-20" />
</footer>

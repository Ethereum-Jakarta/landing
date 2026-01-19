<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
	import Dawaey from '../assets/Dawaey.svelte';
</script>

<footer
	class="relative flex min-h-80 flex-col justify-between overflow-hidden bg-very-tertiary px-10 py-10 text-tertiary-foreground lg:min-h-96 lg:px-16 lg:py-12"
>
	<!-- Top section -->
	<div class="flex flex-col gap-6">
		<Logo useAlt class="-translate-x-7" />
		<p class="max-w-md font-inter text-base leading-relaxed text-tertiary-foreground/90">
			Build, innovate, and connect with the<br />Ethereum community in Indonesia.
		</p>
		<!-- Social icons -->
		<div class="flex items-center gap-4">
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
	<p class="font-inter text-sm text-tertiary-foreground/70">
		© {new Date().getFullYear()} ETHJKT. All rights reserved
	</p>

	<!-- Character illustration -->
	<Dawaey class="absolute right-10 bottom-0 lg:right-20" />
</footer>

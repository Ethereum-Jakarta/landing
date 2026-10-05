<script lang="ts">
	import logoAlt from '$lib/assets/logo-ethjkt-2.png';
	import { SOCIAL_LINKS } from '$lib/constants';
	import Dawaey from '../assets/Dawaey.svelte';

	const socials = [
		{ label: 'Discord', href: SOCIAL_LINKS.discord, icon: '#ic-discord', size: 22 },
		{ label: 'Instagram', href: SOCIAL_LINKS.instagram, icon: '#ic-instagram', size: 21 },
		{ label: 'X', href: SOCIAL_LINKS.x, icon: '#ic-x', size: 20 }
	];
</script>

<footer
	class="relative -mt-px flex min-h-[clamp(300px,27vw,390px)] flex-col justify-between gap-8 overflow-hidden bg-very-tertiary px-[clamp(20px,4.5vw,64px)] py-[clamp(28px,4vw,48px)] text-tertiary-foreground"
>
	<div class="relative z-2 flex flex-col gap-[clamp(14px,1.6vw,22px)]">
		<a href="#top" aria-label="ETHJKT home" class="-ml-3.5 inline-flex">
			<img src={logoAlt} alt="ETHJKT" class="block h-[clamp(56px,5vw,72px)] w-auto" />
		</a>
		<p class="m-0 max-w-[30ch] text-[clamp(14px,1.1vw,16px)] leading-[1.6] text-footer-text">
			Build, innovate, and connect with the Ethereum community in Indonesia.
		</p>
		<div class="flex items-center gap-4">
			{#each socials as s (s.label)}
				<a
					href={s.href}
					target="_blank"
					rel="noopener"
					aria-label={s.label}
					class="flex text-tertiary-foreground hover:text-primary"
				>
					<svg width={s.size} height={s.size}><use href={s.icon} /></svg>
				</a>
			{/each}
		</div>
	</div>
	<p class="relative z-2 m-0 text-[clamp(12px,0.95vw,14px)] text-footer-muted">
		© 2026 ETHJKT. All rights reserved
	</p>
	<div
		data-a="dawaey"
		aria-hidden="true"
		class="absolute right-[clamp(20px,6vw,80px)] bottom-0 w-[clamp(200px,23vw,335px)] origin-bottom max-md:hidden"
	>
		<Dawaey class="block h-auto w-full" />
	</div>
</footer>

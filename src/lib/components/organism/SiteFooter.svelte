<script lang="ts">
	import logoAlt from '$lib/assets/logo-ethjkt-2.png';
	import Dawaey from '$lib/assets/Dawaey.svelte';
	import { SOCIAL_LINKS } from '$lib/constants';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';

	const socials = [
		{ label: 'Discord', href: SOCIAL_LINKS.discord, Icon: DiscordIcon, size: 'size-[22px]' },
		{ label: 'Instagram', href: SOCIAL_LINKS.instagram, Icon: InstagramIcon, size: 'size-[21px]' },
		{ label: 'X', href: SOCIAL_LINKS.x, Icon: XTwitterIcon, size: 'size-5' }
	];
	const columns = [
		{
			title: 'Community',
			links: [
				{ label: 'About', href: '/#about' },
				{ label: 'Events', href: '/events' },
				{ label: 'FAQ', href: '/#faq' }
			]
		},
		{
			title: 'Members',
			links: [
				{ label: 'Identity Hub', href: '/verify' },
				{ label: 'Gas Tanks', href: '/faucet' },
				{ label: 'Agent', href: '/chat' }
			]
		}
	];
</script>

<!-- `on-dark` switches the global focus ring to gold so it stays visible on navy. -->
<footer
	class="on-dark relative -mt-px flex min-h-[clamp(300px,27vw,390px)] flex-col justify-between gap-8 overflow-hidden bg-very-tertiary px-[clamp(20px,4.5vw,64px)] py-[clamp(28px,4vw,48px)] text-tertiary-foreground"
>
	<div class="relative z-2 flex flex-wrap gap-x-16 gap-y-8">
		<div class="flex flex-col gap-[clamp(14px,1.6vw,22px)]">
			<a href="/" aria-label="ETHJKT home" class="-ml-3.5 inline-flex self-start">
				<img src={logoAlt} alt="ETHJKT" class="block h-[clamp(56px,5vw,72px)] w-auto" />
			</a>
			<p class="m-0 max-w-[30ch] text-body text-footer-text">
				Build, innovate, and connect with the Ethereum community in Indonesia.
			</p>
			<ul class="-ml-3 flex items-center">
				{#each socials as s (s.label)}
					<li>
						<a
							href={s.href}
							target="_blank"
							rel="noopener"
							aria-label="ETHJKT on {s.label}"
							class="flex size-11 items-center justify-center rounded-full text-tertiary-foreground transition-colors hover:text-primary"
						>
							<s.Icon class={s.size} />
						</a>
					</li>
				{/each}
			</ul>
		</div>
		{#each columns as col (col.title)}
			<nav aria-label={col.title} class="flex flex-col gap-3">
				<h2 class="text-label font-bold text-footer-muted uppercase">{col.title}</h2>
				<ul class="flex flex-col gap-2">
					{#each col.links as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-sm text-footer-text transition-colors hover:text-primary"
								>{link.label}</a
							>
						</li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>
	<p class="relative z-2 m-0 text-[clamp(12px,0.95vw,14px)] text-footer-muted">
		© {new Date().getFullYear()} ETHJKT. All rights reserved.
	</p>
	<div
		data-a="dawaey"
		aria-hidden="true"
		class="absolute right-[clamp(20px,6vw,80px)] bottom-0 w-[clamp(200px,23vw,335px)] origin-bottom max-md:hidden"
	>
		<Dawaey class="block h-auto w-full" />
	</div>
</footer>

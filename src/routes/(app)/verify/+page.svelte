<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { errorMessage } from '$lib/client/http';
	import Button from '$lib/components/atoms/Button.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
	import type { Component } from 'svelte';

	type Provider = 'discord' | 'x' | 'luma' | 'instagram' | 'github';

	let { data } = $props();

	const linked = $derived(new Map(data.links.map((l) => [l.provider as Provider, l])));

	// live Discord roles (via bot token); null when the bot isn't configured
	const discordLive = $derived(data.discordLive ?? null);
	let rolesOpen = $state(false);

	const banner = $derived.by(() => {
		const linkedQ = $page.url.searchParams.get('linked');
		const errorQ = $page.url.searchParams.get('error');
		if (errorQ) return { kind: 'error' as const, text: errorQ };
		if (linkedQ) return { kind: 'ok' as const, text: `${linkedQ} linked` };
		return null;
	});

	const oauth: { provider: Provider; label: string; href: string; Icon: Component }[] = [
		{ provider: 'discord', label: 'Discord', href: '/auth/discord', Icon: DiscordIcon },
		{ provider: 'x', label: 'X', href: '/auth/x', Icon: XTwitterIcon },
		{ provider: 'github', label: 'GitHub', href: '/auth/github', Icon: GitHubIcon }
	];

	// Inline (bio-nonce) providers: luma, instagram
	type Step = 'idle' | 'challenge' | 'busy';
	const inline = $state<
		Record<'luma' | 'instagram', { username: string; nonce: string; step: Step; error: string }>
	>({
		luma: { username: '', nonce: '', step: 'idle', error: '' },
		instagram: { username: '', nonce: '', step: 'idle', error: '' }
	});

	async function requestChallenge(p: 'luma' | 'instagram') {
		const s = inline[p];
		if (!s.username.trim()) return;
		s.error = '';
		s.step = 'busy';
		const res = await fetch(`/api/link/${p}/challenge`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: s.username.trim() })
		});
		if (!res.ok) {
			s.error = await errorMessage(res);
			s.step = 'idle';
			return;
		}
		const { nonce } = await res.json();
		s.nonce = nonce;
		s.step = 'challenge';
	}

	async function verify(p: 'luma' | 'instagram') {
		const s = inline[p];
		s.error = '';
		s.step = 'busy';
		const res = await fetch(`/api/link/${p}/verify`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: s.username.trim() })
		});
		if (!res.ok) {
			s.error = await errorMessage(res);
			s.step = 'challenge';
			return;
		}
		await invalidateAll();
	}

	const inlineProviders: { provider: 'luma' | 'instagram'; label: string; Icon?: Component }[] = [
		{ provider: 'luma', label: 'Luma' },
		{ provider: 'instagram', label: 'Instagram', Icon: InstagramIcon }
	];
</script>

<div class="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-16">
	<h1 class="font-montserrat text-3xl font-bold text-foreground">Identity Hub</h1>

	{#if banner}
		<div
			class="rounded-2xl px-4 py-3 font-inter text-sm {banner.kind === 'ok'
				? 'bg-secondary text-secondary-foreground'
				: 'bg-primary text-primary-foreground'}"
		>
			{banner.text}
		</div>
	{/if}

	<ul class="flex flex-col gap-4">
		{#each oauth as { provider, label, href, Icon } (provider)}
			{@const acct = linked.get(provider)}
			<li class="flex flex-col gap-3 rounded-2xl border border-muted/20 px-5 py-4">
				<div class="flex items-center justify-between gap-4">
					<div class="flex items-center gap-3">
						<Icon class="h-6 w-6 text-foreground" />
						<span class="font-inter font-semibold text-foreground">{label}</span>
					</div>
					{#if acct}
						{@const meta = acct.metadata as {
							avatarUrl?: string | null;
							nick?: string | null;
							roles?: string[];
							is_member?: boolean;
						}}
						{@const live = provider === 'discord' ? discordLive : null}
						{@const isMember = live ? live.isMember : meta.is_member}
						{@const roleCount = live ? live.roles.length : (meta.roles?.length ?? 0)}
						<div class="flex items-center gap-3 font-inter text-sm text-muted">
							{#if meta.avatarUrl}
								<img
									src={meta.avatarUrl}
									alt=""
									class="h-8 w-8 rounded-full border border-muted/20 object-cover"
								/>
							{/if}
							<div class="flex flex-col items-end leading-tight">
								<span class="flex items-center gap-1 text-foreground">
									{meta.nick || acct.username || 'linked'}
									<svg class="h-4 w-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
								<span class="flex items-center gap-2 text-xs">
									{#if isMember}<span class="text-secondary">ethjkt member</span>{/if}
									{#if roleCount}
										{#if live}
											<button
												type="button"
												class="underline underline-offset-2 hover:text-foreground"
												onclick={() => (rolesOpen = !rolesOpen)}
											>
												{roleCount} roles {rolesOpen ? '▾' : '▸'}
											</button>
										{:else}
											<span>{roleCount} roles</span>
										{/if}
									{/if}
									<a {href} class="underline underline-offset-2 hover:text-foreground">Reconnect</a>
								</span>
							</div>
						</div>
					{:else}
						<Button {href} variant="secondary" size="sm">Connect</Button>
					{/if}
				</div>

				{#if provider === 'discord' && discordLive && rolesOpen && discordLive.roles.length}
					<ul class="flex flex-wrap gap-2 border-t border-muted/15 pt-3">
						{#each discordLive.roles as role (role.name)}
							<li
								class="flex items-center gap-1.5 rounded-full border border-muted/20 px-3 py-1 font-inter text-xs text-foreground"
							>
								<span
									class="h-2.5 w-2.5 rounded-full"
									style="background-color: {role.colorHex ?? '#99aab5'}"
								></span>
								{role.name}
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}

		{#each inlineProviders as { provider, label, Icon } (provider)}
			{@const acct = linked.get(provider)}
			{@const s = inline[provider]}
			<li class="flex flex-col gap-3 rounded-2xl border border-muted/20 px-5 py-4">
				<div class="flex items-center justify-between gap-4">
					<div class="flex items-center gap-3">
						{#if Icon}<Icon class="h-6 w-6 text-foreground" />{/if}
						<span class="font-inter font-semibold text-foreground">{label}</span>
					</div>
					{#if acct}
						<span class="flex items-center gap-2 font-inter text-sm text-muted">
							{acct.username ?? 'linked'}
							<svg class="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
					{/if}
				</div>

				{#if !acct}
					{#if s.step !== 'challenge'}
						<div class="flex gap-2">
							<input
								class="min-w-0 flex-1 rounded-full border border-muted/30 bg-background px-4 py-2 font-inter text-sm text-foreground outline-none focus:border-secondary"
								placeholder="{label} username"
								bind:value={s.username}
								disabled={s.step === 'busy'}
							/>
							<Button
								variant="secondary"
								size="sm"
								disabled={s.step === 'busy' || !s.username.trim()}
								onclick={() => requestChallenge(provider)}
							>
								Connect
							</Button>
						</div>
					{:else}
						<p class="font-inter text-sm text-muted">Paste this into your {label} bio:</p>
						<code
							class="block rounded-xl bg-tertiary px-4 py-2 font-inter text-sm break-all text-tertiary-foreground"
							>{s.nonce}</code
						>
						<Button
							variant="primary"
							size="sm"
							disabled={inline[provider].step === 'busy'}
							onclick={() => verify(provider)}
						>
							I've added it
						</Button>
					{/if}

					{#if s.error}
						<p class="font-inter text-sm text-primary">{s.error}</p>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
</div>

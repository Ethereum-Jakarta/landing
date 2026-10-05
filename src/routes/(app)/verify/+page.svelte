<script lang="ts">
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import DiscordIcon from '$lib/components/icons/DiscordIcon.svelte';
	import XTwitterIcon from '$lib/components/icons/XTwitterIcon.svelte';
	import InstagramIcon from '$lib/components/icons/InstagramIcon.svelte';
	import GitHubIcon from '$lib/components/icons/GitHubIcon.svelte';
	import { providerName, readError } from '$lib/utils/errors';
	import type { Component } from 'svelte';

	type Provider = 'discord' | 'x' | 'luma' | 'instagram' | 'github';

	let { data } = $props();

	const linked = $derived(new Map(data.links.map((l) => [l.provider as Provider, l])));
	const required = $derived((data.required ?? []) as Provider[]);
	const linkedRequired = $derived(required.filter((p) => linked.has(p)).length);
	const unlocked = $derived(required.length > 0 && linkedRequired === required.length);

	// live Discord roles (via bot token); null when the bot isn't configured
	const discordLive = $derived(data.discordLive ?? null);
	let rolesOpen = $state(false);

	// OAuth callbacks redirect back with ?linked=<provider> or ?error=<provider>_taken.
	const banner = $derived.by(() => {
		const linkedQ = page.url.searchParams.get('linked');
		const errorQ = page.url.searchParams.get('error');
		if (errorQ) {
			const taken = /^(\w+)_taken$/.exec(errorQ);
			return {
				tone: 'danger' as const,
				text: taken
					? `That ${providerName(taken[1])} account is already linked to another wallet. Sign in with that wallet, or link a different account.`
					: "We couldn't link that account. Please try again."
			};
		}
		if (linkedQ) return { tone: 'success' as const, text: `${providerName(linkedQ)} linked.` };
		return null;
	});

	const oauth: { provider: Provider; label: string; href: string; Icon: Component }[] = [
		{ provider: 'discord', label: 'Discord', href: '/auth/discord', Icon: DiscordIcon },
		{ provider: 'x', label: 'X', href: '/auth/x', Icon: XTwitterIcon },
		{ provider: 'github', label: 'GitHub', href: '/auth/github', Icon: GitHubIcon }
	];

	// Inline (bio-nonce) providers: luma, instagram
	// `busy` is separate from `step` so the code stays visible while we check the bio.
	type Step = 'idle' | 'challenge';
	type InlineState = { username: string; nonce: string; step: Step; busy: boolean; error: string };
	const inline = $state<Record<'luma' | 'instagram', InlineState>>({
		luma: { username: '', nonce: '', step: 'idle', busy: false, error: '' },
		instagram: { username: '', nonce: '', step: 'idle', busy: false, error: '' }
	});

	async function requestChallenge(p: 'luma' | 'instagram') {
		const s = inline[p];
		if (!s.username.trim()) return;
		s.error = '';
		s.busy = true;
		try {
			const res = await fetch(`/api/link/${p}/challenge`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ username: s.username.trim() })
			});
			if (!res.ok) {
				s.error = await readError(res);
				return;
			}
			const { nonce } = await res.json();
			s.nonce = nonce;
			s.step = 'challenge';
		} catch {
			s.error = 'Network error. Check your connection and try again.';
		} finally {
			s.busy = false;
		}
	}

	async function verify(p: 'luma' | 'instagram') {
		const s = inline[p];
		s.error = '';
		s.busy = true;
		try {
			const res = await fetch(`/api/link/${p}/verify`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ username: s.username.trim() })
			});
			if (!res.ok) {
				s.error = await readError(res);
				return;
			}
			await invalidateAll();
		} catch {
			s.error = 'Network error. Check your connection and try again.';
		} finally {
			s.busy = false;
		}
	}

	let copied = $state<'' | 'luma' | 'instagram'>('');
	async function copyNonce(p: 'luma' | 'instagram') {
		await navigator.clipboard.writeText(inline[p].nonce);
		copied = p;
		setTimeout(() => (copied = ''), 2000);
	}

	const inlineProviders: { provider: 'luma' | 'instagram'; label: string; Icon?: Component }[] = [
		{ provider: 'luma', label: 'Lu.ma' },
		{ provider: 'instagram', label: 'Instagram', Icon: InstagramIcon }
	];

	const isRequired = (p: Provider) => required.includes(p);
</script>

<svelte:head>
	<title>Hub · ETHJKT</title>
</svelte:head>

{#snippet check(cls: string)}
	<svg class={cls} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		<path
			fill-rule="evenodd"
			d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}

{#snippet badge(p: Provider)}
	{#if isRequired(p) && !linked.has(p)}
		<span
			class="rounded-full bg-primary/25 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-foreground uppercase"
			>Required</span
		>
	{/if}
{/snippet}

<div class="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 py-10 sm:py-14">
	<header>
		<h1 class="font-montserrat text-3xl font-bold text-foreground">Identity Hub</h1>
		<p class="mt-2 text-body text-muted">
			Link your community accounts to prove you're part of ETHJKT and unlock free testnet gas.
		</p>
	</header>

	{#if banner}
		<Notice tone={banner.tone}>{banner.text}</Notice>
	{/if}

	<!-- Progress toward the faucet: the reason to link anything at all. -->
	{#if required.length}
		<section
			aria-labelledby="progress-title"
			class="rounded-[28px] p-5 {unlocked ? 'bg-tertiary text-tertiary-foreground' : 'bg-sky-wash'}"
		>
			<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
				<div>
					<h2 id="progress-title" class="font-montserrat text-lg font-bold">
						{unlocked ? 'Gas Tanks unlocked' : 'Unlock Gas Tanks'}
					</h2>
					<p class="mt-1 text-sm {unlocked ? 'opacity-80' : 'text-muted'}">
						{unlocked
							? 'All required accounts are linked. Claim testnet ETH once per chain per day.'
							: `${linkedRequired} of ${required.length} required accounts linked`}
					</p>
				</div>
				{#if unlocked}
					<Button href="/faucet" size="sm" class="flex-none">Claim gas</Button>
				{/if}
			</div>
			{#if !unlocked}
				<div
					class="mt-4 h-2 overflow-hidden rounded-full bg-background"
					role="progressbar"
					aria-label="Required accounts linked"
					aria-valuemin={0}
					aria-valuemax={required.length}
					aria-valuenow={linkedRequired}
				>
					<div
						class="h-full rounded-full bg-primary transition-[width] duration-500"
						style="width: {(linkedRequired / required.length) * 100}%"
					></div>
				</div>
			{/if}
		</section>
	{/if}

	<ul class="flex flex-col gap-3">
		{#each oauth as { provider, label, href, Icon } (provider)}
			{@const acct = linked.get(provider)}
			<li class="flex flex-col gap-3 rounded-2xl border border-foreground/12 px-5 py-4">
				<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<div class="flex items-center gap-3">
						<Icon class="h-6 w-6 text-foreground" />
						<span class="font-semibold text-foreground">{label}</span>
						{@render badge(provider)}
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
						<div class="flex items-center gap-3 text-sm text-muted">
							{#if meta.avatarUrl}
								<img
									src={meta.avatarUrl}
									alt=""
									class="h-8 w-8 rounded-full border border-foreground/12 object-cover"
								/>
							{/if}
							<div class="flex flex-col items-end leading-tight">
								<span class="flex items-center gap-1 text-foreground">
									{meta.nick || acct.username || 'Linked'}
									{@render check('h-4 w-4 text-success')}
									<span class="sr-only">(linked)</span>
								</span>
								<span class="flex items-center gap-2 text-xs whitespace-nowrap">
									{#if isMember}<span class="text-success">ETHJKT member</span>{/if}
									{#if roleCount}
										{#if live}
											<button
												type="button"
												aria-expanded={rolesOpen}
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
						<Button {href} variant="tertiary" size="sm">Connect</Button>
					{/if}
				</div>

				{#if provider === 'discord' && discordLive && rolesOpen && discordLive.roles.length}
					<ul class="flex flex-wrap gap-2 border-t border-foreground/10 pt-3">
						{#each discordLive.roles as role (role.name)}
							<li
								class="flex items-center gap-1.5 rounded-full border border-foreground/12 px-3 py-1 text-xs text-foreground"
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
			<li class="flex flex-col gap-3 rounded-2xl border border-foreground/12 px-5 py-4">
				<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<div class="flex items-center gap-3">
						{#if Icon}<Icon class="h-6 w-6 text-foreground" />{/if}
						<span class="font-semibold text-foreground">{label}</span>
						{@render badge(provider)}
					</div>
					{#if acct}
						<span class="flex items-center gap-2 text-sm text-muted">
							{acct.username ?? 'Linked'}
							{@render check('h-5 w-5 text-success')}
							<span class="sr-only">(linked)</span>
						</span>
					{/if}
				</div>

				{#if !acct}
					{#if s.step !== 'challenge'}
						<form
							class="flex gap-2"
							onsubmit={(e) => {
								e.preventDefault();
								requestChallenge(provider);
							}}
						>
							<label for="{provider}-username" class="sr-only">{label} username</label>
							<input
								id="{provider}-username"
								class="h-9 min-w-0 flex-1 rounded-full border border-foreground/20 bg-background px-4 text-sm text-foreground placeholder:text-muted"
								placeholder="{label} username"
								autocomplete="off"
								autocapitalize="none"
								spellcheck="false"
								bind:value={s.username}
								disabled={s.busy}
							/>
							<Button
								type="submit"
								variant="tertiary"
								size="sm"
								loading={s.busy}
								disabled={!s.username.trim()}
							>
								Get code
							</Button>
						</form>
					{:else}
						<ol class="flex list-decimal flex-col gap-1 pl-5 text-sm text-muted">
							<li>Copy this code and paste it anywhere in your {label} bio.</li>
							<li>Save your profile (it must be public), then check below.</li>
						</ol>
						<div class="flex items-center gap-2">
							<code
								class="block min-w-0 flex-1 rounded-xl bg-tertiary px-4 py-2 text-sm break-all text-tertiary-foreground"
								>{s.nonce}</code
							>
							<Button variant="ghost" size="sm" onclick={() => copyNonce(provider)}>
								{copied === provider ? 'Copied' : 'Copy'}
							</Button>
						</div>
						<Button size="sm" loading={s.busy} onclick={() => verify(provider)}>
							Check my bio
						</Button>
					{/if}

					{#if s.error}
						<Notice tone="danger">{s.error}</Notice>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
</div>

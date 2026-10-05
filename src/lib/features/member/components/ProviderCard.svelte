<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/atoms/Button.svelte';
	import Notice from '$lib/components/atoms/Notice.svelte';
	import { readError } from '$lib/utils/errors';
	import type { ProviderMeta } from '../providers';
	import ProviderIcon from './ProviderIcon.svelte';

	type Account = { username: string | null; metadata: unknown };
	type LiveRoles = { isMember: boolean; roles: { name: string; colorHex: string | null }[] };

	interface Props {
		provider: ProviderMeta;
		account?: Account;
		required: boolean;
		/** Live Discord roles from the bot (null when the bot isn't configured). */
		discordLive?: LiveRoles | null;
	}

	let { provider, account, required, discordLive = null }: Props = $props();

	const meta = $derived(
		(account?.metadata ?? {}) as {
			avatarUrl?: string | null;
			nick?: string | null;
			roles?: string[];
			is_member?: boolean;
		}
	);
	const live = $derived(provider.id === 'discord' ? discordLive : null);
	const isMember = $derived(live ? live.isMember : meta.is_member);
	const roleCount = $derived(live ? live.roles.length : (meta.roles?.length ?? 0));
	let rolesOpen = $state(false);

	// Bio-code linking (Lu.ma, Instagram): enter username → copy code → check bio.
	let username = $state('');
	let nonce = $state('');
	let busy = $state(false);
	let error = $state('');
	let copied = $state(false);

	async function post(path: string) {
		const res = await fetch(`/api/link/${provider.id}/${path}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username: username.trim() })
		});
		if (!res.ok) throw new Error(await readError(res));
		return res;
	}

	async function getCode(e: SubmitEvent) {
		e.preventDefault();
		if (!username.trim()) return;
		busy = true;
		error = '';
		try {
			nonce = (await (await post('challenge')).json()).nonce;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error. Please try again.';
		} finally {
			busy = false;
		}
	}

	async function checkBio() {
		busy = true;
		error = '';
		try {
			await post('verify');
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Network error. Please try again.';
		} finally {
			busy = false;
		}
	}

	async function copy() {
		await navigator.clipboard.writeText(nonce);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<article
	id="provider-{provider.id}"
	aria-labelledby="provider-{provider.id}-name"
	class="flex min-w-0 scroll-mt-28 flex-col rounded-[28px] bg-background p-5 shadow-soft-ring transition-shadow {account
		? ''
		: 'hover:shadow-soft'}"
>
	<header class="flex items-start gap-3">
		<span
			class="flex size-12 flex-none items-center justify-center rounded-2xl {account
				? 'bg-primary text-primary-foreground'
				: 'bg-sky-wash text-foreground'}"
		>
			<ProviderIcon id={provider.id} class="size-6" />
		</span>
		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
				<h3
					id="provider-{provider.id}-name"
					class="font-montserrat text-h4 font-bold text-foreground"
				>
					{provider.label}
				</h3>
				{#if account}
					<span
						class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-success uppercase"
					>
						<svg class="size-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
								clip-rule="evenodd"
							/>
						</svg>
						Linked
					</span>
				{:else if required}
					<span
						class="rounded-full bg-primary/30 px-2 py-0.5 text-[11px] font-bold tracking-wide text-foreground uppercase"
						>Required</span
					>
				{:else}
					<span
						class="rounded-full bg-foreground/7 px-2 py-0.5 text-[11px] font-bold tracking-wide text-muted uppercase"
						>Optional</span
					>
				{/if}
			</div>
			<p class="mt-1 text-sm text-muted">{provider.why}</p>
		</div>
	</header>

	<div class="mt-5 flex flex-1 flex-col justify-end">
		{#if account}
			<!-- Linked: who it is + low-key maintenance actions. -->
			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sky-mist px-4 py-3"
			>
				<div class="flex min-w-0 items-center gap-3">
					{#if meta.avatarUrl}
						<img src={meta.avatarUrl} alt="" class="size-8 rounded-full object-cover" />
					{/if}
					<div class="min-w-0">
						<p class="truncate text-sm font-semibold text-foreground">
							{meta.nick || account.username || 'Linked'}
						</p>
						{#if isMember || roleCount}
							<p class="flex items-center gap-2 text-xs text-muted">
								{#if isMember}<span class="font-semibold text-success">In the ETHJKT server</span
									>{/if}
								{#if roleCount}
									{#if live}
										<button
											type="button"
											aria-expanded={rolesOpen}
											onclick={() => (rolesOpen = !rolesOpen)}
											class="cursor-pointer underline underline-offset-2 hover:text-foreground"
											>{roleCount} roles</button
										>
									{:else}
										<span>{roleCount} roles</span>
									{/if}
								{/if}
							</p>
						{/if}
					</div>
				</div>
				{#if provider.href}
					<a
						href={provider.href}
						class="text-xs font-semibold text-muted underline underline-offset-2 hover:text-foreground"
						>Reconnect</a
					>
				{/if}
			</div>
			{#if live && rolesOpen && live.roles.length}
				<ul class="mt-3 flex flex-wrap gap-2">
					{#each live.roles as role (role.name)}
						<li
							class="flex items-center gap-1.5 rounded-full border border-foreground/12 px-3 py-1 text-xs text-foreground"
						>
							<span
								class="size-2.5 rounded-full"
								style="background-color: {role.colorHex ?? '#99aab5'}"
							></span>
							{role.name}
						</li>
					{/each}
				</ul>
			{/if}
		{:else if provider.kind === 'oauth'}
			<Button href={provider.href} variant="tertiary" class="w-full">
				Connect {provider.label}
			</Button>
		{:else if !nonce}
			<form class="flex gap-2" onsubmit={getCode}>
				<label for="{provider.id}-username" class="sr-only">{provider.label} username</label>
				<input
					id="{provider.id}-username"
					bind:value={username}
					disabled={busy}
					placeholder="{provider.label} username"
					autocomplete="off"
					autocapitalize="none"
					spellcheck="false"
					class="h-11 min-w-0 flex-1 rounded-full border border-foreground/20 bg-background px-4 text-sm text-foreground placeholder:text-muted"
				/>
				<Button type="submit" variant="tertiary" loading={busy} disabled={!username.trim()}
					>Get code</Button
				>
			</form>
		{:else}
			<ol class="flex flex-col gap-3">
				<li class="flex gap-3">
					<span
						class="flex size-6 flex-none items-center justify-center rounded-full bg-tertiary text-xs font-bold text-tertiary-foreground"
						>1</span
					>
					<div class="min-w-0 flex-1">
						<p class="text-sm text-foreground">Copy this code into your {provider.label} bio.</p>
						<div class="mt-2 flex items-center gap-2">
							<code
								class="block min-w-0 flex-1 truncate rounded-xl bg-sky-wash px-3 py-2 text-sm font-semibold text-foreground"
								>{nonce}</code
							>
							<Button variant="ghost" size="sm" onclick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
						</div>
					</div>
				</li>
				<li class="flex gap-3">
					<span
						class="flex size-6 flex-none items-center justify-center rounded-full bg-tertiary text-xs font-bold text-tertiary-foreground"
						>2</span
					>
					<div class="flex-1">
						<p class="text-sm text-foreground">
							Save your profile (it must be public), then check. You can remove the code afterwards.
						</p>
						<Button class="mt-2 w-full" loading={busy} onclick={checkBio}>Check my bio</Button>
					</div>
				</li>
			</ol>
			<button
				type="button"
				onclick={() => ((nonce = ''), (error = ''))}
				class="mt-3 cursor-pointer self-start text-xs font-semibold text-muted underline underline-offset-2 hover:text-foreground"
				>Use a different username</button
			>
		{/if}

		{#if error}
			<Notice tone="danger" class="mt-3">{error}</Notice>
		{/if}
	</div>
</article>

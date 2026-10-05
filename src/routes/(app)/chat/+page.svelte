<script lang="ts">
	import { tick } from 'svelte';
	import ethCrystal from '$lib/assets/eth-crystal.webp';
	import SkyCloud from '$lib/components/decor/SkyCloud.svelte';
	import { readError } from '$lib/utils/errors';

	type Msg = { role: 'user' | 'assistant'; content: string };

	let messages = $state<Msg[]>([]);
	let input = $state('');
	let streaming = $state(false);
	let errorMsg = $state('');
	let scroller = $state<HTMLDivElement>();
	let field = $state<HTMLTextAreaElement>();

	const SUGGESTIONS = [
		{ q: 'How do I get Sepolia ETH for testing?', hint: 'Testnets' },
		{ q: 'Explain smart contracts like I am new to Web3', hint: 'Basics' },
		{ q: 'What kinds of events does ETHJKT run?', hint: 'Community' },
		{ q: 'What should I learn first to build a dApp?', hint: 'Learning path' }
	];

	async function scrollDown() {
		await tick();
		scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
	}

	async function send(preset?: string) {
		if (preset) input = preset;
		const text = input.trim();
		if (!text || streaming) return;
		errorMsg = '';
		input = '';
		messages.push({ role: 'user', content: text });
		messages.push({ role: 'assistant', content: '' });
		// Mutate the reactive (proxied) entry, not a plain local object, so tokens render as they stream.
		const assistant = messages[messages.length - 1];
		streaming = true;
		scrollDown();

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ messages: messages.slice(0, -1) })
			});
			if (!res.ok || !res.body) {
				errorMsg = await readError(res, "The agent couldn't answer just now. Please try again.");
				messages.splice(-2, 2);
				input = text; // give the message back so retrying is one tap
				return;
			}

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				assistant.content += decoder.decode(value, { stream: true });
				scrollDown();
			}
		} catch {
			errorMsg = 'Network error. Check your connection and try again.';
			if (!assistant.content) messages.splice(-2, 2);
			input = text;
		} finally {
			streaming = false;
			field?.focus();
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}

	function newChat() {
		messages = [];
		errorMsg = '';
		field?.focus();
	}
</script>

<svelte:head>
	<title>Agent · ETHJKT</title>
</svelte:head>

<!-- Full-height chat under the floating header (and above the phone tab bar). -->
<div
	class="relative flex h-svh flex-col overflow-hidden bg-[linear-gradient(180deg,var(--color-sky-soft)_0%,var(--color-background)_34%)] pt-[84px] pb-[68px] md:pb-0"
>
	<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-48">
		<SkyCloud
			class="top-[52%] left-[6%] w-[clamp(90px,9vw,140px)] text-background motion-safe:animate-drift"
		/>
		<SkyCloud
			flip
			class="top-[60%] right-[5%] w-[clamp(100px,10vw,160px)] text-background opacity-80 motion-safe:animate-drift motion-safe:[animation-delay:-8s]"
		/>
	</div>

	<div class="relative mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4">
		<header class="flex items-center gap-3 py-4">
			<span
				class="flex size-11 flex-none items-center justify-center rounded-full bg-background shadow-soft-ring"
			>
				<img src={ethCrystal} alt="" class="w-6" />
			</span>
			<div class="min-w-0 flex-1">
				<h1 class="font-montserrat text-lg font-bold text-foreground">ETHJKT Agent</h1>
				<p class="truncate text-xs text-muted">
					Answers about Ethereum, testnets and the ETHJKT community
				</p>
			</div>
			{#if messages.length}
				<button
					type="button"
					onclick={newChat}
					disabled={streaming}
					class="h-9 flex-none cursor-pointer rounded-full border border-foreground/15 bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-sky-mist disabled:opacity-50"
					>New chat</button
				>
			{/if}
		</header>

		<div
			bind:this={scroller}
			aria-live="polite"
			class="min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:thin]"
		>
			{#if messages.length === 0}
				<div class="flex min-h-full flex-col items-center justify-center py-8 text-center">
					<img src={ethCrystal} alt="" aria-hidden="true" class="w-16 motion-safe:animate-float" />
					<h2 class="mt-5 font-montserrat text-h3 font-bold text-foreground">
						What do you want to build?
					</h2>
					<p class="mt-2 max-w-[44ch] text-body text-muted">
						Ask anything, from your first wallet to deploying on a testnet.
					</p>
					<ul class="mt-7 grid w-full gap-3 sm:grid-cols-2">
						{#each SUGGESTIONS as s (s.q)}
							<li>
								<button
									type="button"
									onclick={() => send(s.q)}
									class="group flex h-full w-full cursor-pointer flex-col items-start gap-1 rounded-[20px] bg-background p-4 text-left shadow-soft-ring transition-colors hover:bg-sky-mist"
								>
									<span class="text-label font-bold text-muted uppercase">{s.hint}</span>
									<span class="text-sm font-medium text-foreground">{s.q}</span>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<ol class="flex flex-col gap-5 pt-2">
					{#each messages as m, i (i)}
						{@const last = i === messages.length - 1}
						<li class="flex gap-3 {m.role === 'user' ? 'justify-end' : 'justify-start'}">
							{#if m.role === 'assistant'}
								<span
									aria-hidden="true"
									class="mt-1 flex size-8 flex-none items-center justify-center rounded-full bg-background shadow-soft-ring"
								>
									<img src={ethCrystal} alt="" class="w-4" />
								</span>
							{/if}
							<div
								class="max-w-[82%] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap {m.role ===
								'user'
									? 'rounded-[20px] rounded-br-md bg-tertiary text-tertiary-foreground'
									: 'rounded-[20px] rounded-tl-md bg-sky-wash text-foreground'}"
							>
								<span class="sr-only">{m.role === 'user' ? 'You:' : 'Agent:'}</span>
								{#if m.role === 'assistant' && !m.content && streaming && last}
									<span class="flex gap-1 py-1.5" aria-label="Agent is typing">
										<span class="size-1.5 animate-bounce rounded-full bg-muted"></span>
										<span
											class="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:120ms]"
										></span>
										<span
											class="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:240ms]"
										></span>
									</span>
								{:else}
									{m.content}
								{/if}
							</div>
						</li>
					{/each}
				</ol>
			{/if}
		</div>

		{#if errorMsg}
			<p class="mb-2 rounded-2xl bg-danger/8 px-4 py-2 text-sm text-danger" role="alert">
				{errorMsg}
			</p>
		{/if}

		<form
			class="flex items-end gap-2 rounded-[28px] bg-background p-2 pl-5 shadow-soft-ring focus-within:shadow-[0_0_0_2px_var(--color-foreground)]"
			onsubmit={(e) => {
				e.preventDefault();
				send();
			}}
		>
			<label for="chat-input" class="sr-only">Message the agent</label>
			<textarea
				id="chat-input"
				bind:this={field}
				bind:value={input}
				onkeydown={onKeydown}
				disabled={streaming}
				rows="1"
				placeholder="Ask the agent…"
				class="[field-sizing:content] max-h-40 min-h-11 flex-1 resize-none bg-transparent py-3 text-[15px] text-foreground placeholder:text-muted focus:outline-none disabled:opacity-60"
			></textarea>
			<button
				type="submit"
				disabled={streaming || !input.trim()}
				aria-label="Send message"
				class="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
			>
				{#if streaming}
					<span
						aria-hidden="true"
						class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
					></span>
				{:else}
					<svg
						class="size-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg
					>
				{/if}
			</button>
		</form>
		<p class="py-2 text-center text-[11px] text-muted">
			The agent can make mistakes. Double-check anything important.
		</p>
	</div>
</div>

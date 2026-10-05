<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import { readError } from '$lib/utils/errors';

	type Msg = { role: 'user' | 'assistant'; content: string };

	let messages = $state<Msg[]>([]);
	let input = $state('');
	let streaming = $state(false);
	let errorMsg = $state('');
	let scroller: HTMLDivElement;

	function scrollDown() {
		scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
	}

	const SUGGESTIONS = [
		'How do I get Sepolia ETH for testing?',
		'Explain smart contracts like I am new to Web3',
		'What kinds of events does ETHJKT run?'
	];

	async function send(preset?: string) {
		if (preset) input = preset;
		const text = input.trim();
		if (!text || streaming) return;
		errorMsg = '';
		input = '';
		messages.push({ role: 'user', content: text });
		const assistant: Msg = { role: 'assistant', content: '' };
		messages.push(assistant);
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
				messages.pop();
				messages.pop();
				input = text;
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
			if (!assistant.content) messages.pop();
		} finally {
			streaming = false;
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<svelte:head>
	<title>Agent · ETHJKT</title>
</svelte:head>

<!-- Fills the viewport under the member header (64px, plus the 44px tab bar on small screens). -->
<div
	class="mx-auto flex h-[calc(100svh-4rem-1px)] w-full max-w-2xl flex-col px-4 py-6 max-sm:h-[calc(100svh-6.75rem-2px)]"
>
	<h1 class="font-montserrat text-xl font-bold text-foreground">ETHJKT agent</h1>

	<div bind:this={scroller} aria-live="polite" class="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
		{#if messages.length === 0}
			<div class="mx-auto mt-8 max-w-md text-center">
				<p class="text-body text-muted">
					Ask about Ethereum, building on testnets, or what's happening in the ETHJKT community.
				</p>
				<ul class="mt-5 flex flex-col gap-2">
					{#each SUGGESTIONS as q (q)}
						<li>
							<button
								type="button"
								onclick={() => send(q)}
								class="w-full cursor-pointer rounded-2xl border border-foreground/12 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-sky-wash"
								>{q}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#each messages as m (m)}
			<div class="flex {m.role === 'user' ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap {m.role === 'user'
						? 'bg-primary text-primary-foreground'
						: 'bg-sky-wash text-foreground'}"
				>
					{m.content}{#if streaming && m.role === 'assistant' && m === messages[messages.length - 1]}<span
							class="animate-pulse">▋</span
						>{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if errorMsg}
		<p class="mt-2 text-sm text-danger" role="alert">{errorMsg}</p>
	{/if}

	<form
		class="mt-4 flex items-end gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			send();
		}}
	>
		<label for="chat-input" class="sr-only">Message the agent</label>
		<textarea
			id="chat-input"
			bind:value={input}
			onkeydown={onKeydown}
			disabled={streaming}
			rows="1"
			placeholder="Message the agent…"
			class="min-h-11 flex-1 resize-none rounded-2xl border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted disabled:opacity-50"
		></textarea>
		<Button type="submit" loading={streaming} disabled={!input.trim()}>Send</Button>
	</form>
</div>

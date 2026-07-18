<script lang="ts">
	type Msg = { role: 'user' | 'assistant'; content: string };

	let messages = $state<Msg[]>([]);
	let input = $state('');
	let streaming = $state(false);
	let errorMsg = $state('');
	let scroller: HTMLDivElement;

	function scrollDown() {
		scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
	}

	async function send() {
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
				errorMsg =
					res.status === 429
						? 'Rate limited — slow down and try again in a moment.'
						: `Something went wrong (${res.status}).`;
				messages.pop();
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
			errorMsg = 'Network error — check your connection and retry.';
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

<div class="mx-auto flex h-[calc(100vh-6rem)] w-full max-w-2xl flex-col px-4 py-6">
	<h1 class="font-montserrat text-xl font-bold text-tertiary">ethjkt agent</h1>

	<div bind:this={scroller} class="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
		{#if messages.length === 0}
			<p class="mt-10 text-center font-inter text-muted">Ask the ethjkt agent anything.</p>
		{/if}
		{#each messages as m (m)}
			<div class="flex {m.role === 'user' ? 'justify-end' : 'justify-start'}">
				<div
					class="max-w-[80%] rounded-2xl px-4 py-2 font-inter text-sm whitespace-pre-wrap {m.role ===
					'user'
						? 'bg-primary text-primary-foreground'
						: 'bg-tertiary text-tertiary-foreground'}"
				>
					{m.content}{#if streaming && m.role === 'assistant' && m === messages[messages.length - 1]}<span
							class="animate-pulse">▋</span
						>{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if errorMsg}
		<p class="mt-2 font-inter text-sm text-red-500" role="alert">{errorMsg}</p>
	{/if}

	<div class="mt-4 flex items-end gap-2">
		<textarea
			bind:value={input}
			onkeydown={onKeydown}
			disabled={streaming}
			rows="1"
			placeholder="Message the agent…"
			class="flex-1 resize-none rounded-2xl border border-muted/30 bg-background px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-secondary disabled:opacity-50"
		></textarea>
		<button
			onclick={send}
			disabled={streaming || !input.trim()}
			class="rounded-full bg-primary px-6 py-3 font-inter font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
		>
			{streaming ? '…' : 'Send'}
		</button>
	</div>
</div>

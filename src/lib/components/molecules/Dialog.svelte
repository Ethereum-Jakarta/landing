<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Bindable open state. */
		open?: boolean;
		title?: string;
		/** Allow closing via backdrop click, Esc, and the × button. */
		dismissible?: boolean;
		/** Called after the dialog closes (any dismiss path). */
		onclose?: () => void;
		children: Snippet;
	}

	let { open = $bindable(false), title, dismissible = true, onclose, children }: Props = $props();

	let el = $state<HTMLDialogElement>();

	// Drive the native <dialog> from the `open` prop.
	$effect(() => {
		const dlg = el;
		if (!dlg) return;
		if (open && !dlg.open) dlg.showModal();
		else if (!open && dlg.open) dlg.close();
	});

	function close() {
		if (dismissible) open = false;
	}

	// A click whose target is the dialog element itself = a click on the backdrop.
	function onBackdrop(event: MouseEvent) {
		if (event.target === el) close();
	}
</script>

<dialog
	bind:this={el}
	onclick={onBackdrop}
	onclose={() => {
		open = false;
		onclose?.();
	}}
	oncancel={(event) => {
		if (!dismissible) event.preventDefault();
	}}
	class="m-auto w-full max-w-sm rounded-3xl border border-muted/20 bg-background p-0 shadow-xl backdrop:bg-tertiary/40 backdrop:backdrop-blur-sm"
>
	<div class="p-8">
		{#if title || dismissible}
			<div class="mb-4 flex items-center gap-4">
				{#if title}
					<h2 class="font-montserrat text-xl font-bold text-foreground">{title}</h2>
				{/if}
				{#if dismissible}
					<button
						type="button"
						aria-label="Close"
						onclick={close}
						class="ml-auto rounded-full p-1 text-muted transition-colors hover:text-foreground"
					>
						<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
							/>
						</svg>
					</button>
				{/if}
			</div>
		{/if}
		{@render children()}
	</div>
</dialog>

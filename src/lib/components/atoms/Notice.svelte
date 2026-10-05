<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: 'success' | 'danger' | 'info';
		class?: string;
		children: Snippet;
	}

	let { tone = 'info', class: className = '', children }: Props = $props();

	const toneClasses = {
		success: 'border-success/25 bg-success/8 text-success',
		danger: 'border-danger/25 bg-danger/8 text-danger',
		info: 'border-info/25 bg-info/8 text-info'
	};
</script>

<!-- Errors interrupt (alert); everything else is announced politely (status). -->
<div
	role={tone === 'danger' ? 'alert' : 'status'}
	class="rounded-2xl border px-4 py-3 text-sm leading-relaxed {toneClasses[tone]} {className}"
>
	{@render children()}
</div>

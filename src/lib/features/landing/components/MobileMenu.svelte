<script lang="ts">
	import { MENU_ITEMS } from '../data';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();
</script>

<div
	class="fixed inset-0 z-48 flex flex-col gap-1.5 bg-linear-to-b from-secondary to-background px-6 pt-[110px] pb-8"
>
	{#each MENU_ITEMS as item (item.label)}
		<a
			href={item.href}
			onclick={onClose}
			class="py-1 font-montserrat text-[clamp(32px,9vw,44px)] leading-[1.2] font-bold tracking-[-0.02em] text-foreground"
			>{item.label}</a
		>
	{/each}
</div>

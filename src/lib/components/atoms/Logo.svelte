<script lang="ts">
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';

	interface Props {
		class?: string;
		height?: number;
	}

	let { class: className = '', height = 32 }: Props = $props();
</script>

<a href="/" class="inline-block {className}">
	<img src={logoSrc} alt="ETHJKT" {height} />
</a>

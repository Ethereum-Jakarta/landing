<script lang="ts">
	import logoSrc from '$lib/assets/logo-ethjkt-1.png';
	import logo2Src from '$lib/assets/logo-ethjkt-2.png';

	interface Props {
		class?: string;
		height?: number;
		useAlt?: boolean;
	}

	let { class: className = '', height = 32, useAlt = false }: Props = $props();
</script>

<a href="/" class="inline-block {className}">
	<img src={useAlt ? logo2Src : logoSrc} alt="ETHJKT" {height} />
</a>

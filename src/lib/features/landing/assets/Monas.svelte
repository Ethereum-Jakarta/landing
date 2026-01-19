<script lang="ts">
	type MonasProps = {
		class?: string;
	};
	const { class: className = '' }: MonasProps = $props();
</script>

<svg
	class={className}
	width="181"
	height="250"
	viewBox="0 0 181 250"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M0 207.229L20.6065 249.5L157 245.5L180.5 201L115 207.229C119.277 132.294 106.241 103.952 93.5 49.318H110.5L115 37H93.5C93.5 17.9399 90.8748 15.2543 80 0C69.5267 19.1771 68.2004 16.412 72.158 37H51.5L58.0364 49.318H72.158C63.6684 104.295 53.0099 132.603 63.1073 207.229H0Z"
		fill="white"
	/>
</svg>

<!-- Scroll-following paper plane + dashed trail; driven by `initLandingMotion`. -->
<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-45">
	<svg width="100%" height="100%" class="absolute inset-0 overflow-visible">
		<path
			data-a="trail"
			d=""
			fill="none"
			stroke-width="3"
			stroke-dasharray="16 10"
			stroke-linecap="round"
			opacity="0.7"
			class="stroke-background"
		/>
	</svg>
	<svg
		data-a="plane"
		width="48"
		height="48"
		viewBox="0 0 32 32"
		style="transform: translate3d(-100px, -100px, 0)"
		class="absolute top-0 left-0 overflow-visible will-change-transform"
	>
		<path
			d="M30 16 L2 2 L14 16 L2 30 Z"
			class="fill-background stroke-foreground"
			stroke-width="0.9"
			stroke-linejoin="round"
		/>
		<path
			d="M14 16 L2 30 L2 2 Z"
			class="fill-paper-shade stroke-foreground"
			stroke-width="0.9"
			stroke-linejoin="round"
		/>
		<path d="M30 16 L14 16" class="stroke-paper-line" stroke-width="1" />
	</svg>
</div>

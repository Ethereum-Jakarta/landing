import adapterNode from '@sveltejs/adapter-node';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Vercel sets VERCEL=1 during its builds and needs its own output format;
// everywhere else (local `node build`, Railway/Docker) we ship a standalone Node server.
const adapter = process.env.VERCEL ? adapterVercel() : adapterNode();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter
	}
};

export default config;

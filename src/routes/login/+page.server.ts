import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hubEnabled } from '$lib/nav';

// Wallet login is the front door to the hub — close it with the same flag.
export const load: PageServerLoad = () => {
	if (!hubEnabled) redirect(302, '/');
};

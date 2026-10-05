import type { LayoutServerLoad } from './$types';

// Every page's header needs to know whether someone is signed in (Sign in vs My Hub).
export const load: LayoutServerLoad = async ({ locals }) => ({
	user: locals.user ? { walletAddress: locals.user.walletAddress } : null
});

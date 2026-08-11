import type { LayoutServerLoad } from './$types';

/** Auth state for the site-wide header, on every route. */
export const load: LayoutServerLoad = ({ locals }) => ({
	user: locals.user ? { walletAddress: locals.user.walletAddress } : null
});

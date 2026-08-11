import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getLinkedAccounts } from '$lib/server/link';
import { hubEnabled } from '$lib/nav';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Hiding the nav entry alone would leave these reachable by direct URL.
	if (!hubEnabled) redirect(302, '/');
	if (!locals.user) redirect(302, `/login?next=${encodeURIComponent(url.pathname)}`);
	const links = await getLinkedAccounts(locals.user.id);
	return {
		user: { id: locals.user.id, walletAddress: locals.user.walletAddress },
		links: links.map((l) => ({
			provider: l.provider,
			username: l.username,
			metadata: l.metadata
		}))
	};
};

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getLinkedAccounts } from '$lib/server/link';

export const load: LayoutServerLoad = async ({ locals, url }) => {
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

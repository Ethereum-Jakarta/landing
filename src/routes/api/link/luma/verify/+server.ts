import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchProfileContainsNonce } from '$lib/server/verify/luma';
import { patchSessionData } from '$lib/server/auth/session';
import { linkAccount } from '$lib/server/link';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) error(401, 'sign in first');
	const pending = locals.session?.data.lumaPending as
		| { username: string; nonce: string }
		| undefined;
	if (!pending) error(400, 'no pending luma challenge; request one first');

	const { ok, displayName } = await fetchProfileContainsNonce(pending.username, pending.nonce);
	if (!ok) error(400, 'nonce not found in lu.ma bio');

	const result = await linkAccount({
		userId: locals.user.id,
		provider: 'luma',
		providerAccountId: pending.username,
		username: pending.username,
		metadata: { displayName }
	});
	if (!result.ok) error(409, 'this lu.ma account is already linked to another user');

	await patchSessionData(locals.session!.id, { lumaPending: null });
	return json({ ok: true });
};

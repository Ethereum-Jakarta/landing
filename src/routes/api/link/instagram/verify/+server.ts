import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession, patchSessionData } from '$lib/server/auth/session';
import { linkAccount } from '$lib/server/link';
import { fetchBioContainsNonce } from '$lib/server/verify/instagram';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	if (!locals.user) error(401, 'sign in first');

	const session = await getSession(cookies);
	if (!session) error(400, 'no session');

	const pending = session.data.igPending as { username: string; nonce: string } | undefined;
	if (!pending) error(400, 'no pending instagram challenge; request one first');

	const { status } = await fetchBioContainsNonce(pending.username, pending.nonce);
	if (status === 'unavailable') {
		error(503, "couldn't reach Instagram right now — wait a moment and try again");
	}
	if (status === 'not_found') {
		error(400, "nonce not found in your bio — make sure it's saved and your profile is public");
	}

	const result = await linkAccount({
		userId: locals.user.id,
		provider: 'instagram',
		providerAccountId: pending.username,
		username: pending.username
	});
	if (!result.ok) error(409, 'this instagram account is already linked');

	await patchSessionData(session.id, { igPending: null });

	return json({ ok: true, username: pending.username });
};

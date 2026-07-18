import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifySiwe } from '$lib/server/auth/siwe';
import { getSession, bindUser, patchSessionData } from '$lib/server/auth/session';
import { upsertUserByWallet } from '$lib/server/link';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const session = await getSession(cookies);
	if (!session) error(400, 'no session; request a nonce first');

	const expectedNonce = (session.data.siweNonce as string | undefined) ?? '';
	if (!expectedNonce) error(400, 'no nonce issued');

	const { message, signature } = await request.json();
	if (typeof message !== 'string' || typeof signature !== 'string') {
		error(400, 'message and signature required');
	}

	const result = await verifySiwe({
		message,
		signature: signature as `0x${string}`,
		expectedNonce,
		domain: url.host
	});
	if ('error' in result) error(401, result.error);

	const user = await upsertUserByWallet(result.address);
	await bindUser(session.id, user.id);
	// burn the nonce
	await patchSessionData(session.id, { siweNonce: null });

	return json({ user: { id: user.id, walletAddress: user.walletAddress } });
};

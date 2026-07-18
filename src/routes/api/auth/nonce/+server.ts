import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateNonce } from '$lib/server/auth/siwe';
import { getOrCreateSession, patchSessionData } from '$lib/server/auth/session';

export const GET: RequestHandler = async ({ cookies }) => {
	const session = await getOrCreateSession(cookies);
	const nonce = generateNonce();
	await patchSessionData(session.id, { siweNonce: nonce });
	return json({ nonce });
};

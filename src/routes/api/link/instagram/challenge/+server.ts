import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSession, patchSessionData } from '$lib/server/auth/session';
import { issueNonce } from '$lib/server/verify/instagram';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	if (!locals.user) error(401, 'sign in first');

	const session = await getSession(cookies);
	if (!session) error(400, 'no session');

	const { username } = await request.json();
	if (typeof username !== 'string' || !username.trim()) error(400, 'username required');

	const nonce = issueNonce();
	await patchSessionData(session.id, {
		igPending: { username: username.replace(/^@/, '').trim(), nonce }
	});

	return json({ nonce });
};

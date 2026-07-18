import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { issueNonce } from '$lib/server/verify/luma';
import { patchSessionData } from '$lib/server/auth/session';

/** Parse a bare username or a lu.ma/user/<username> URL down to the username. */
function parseUsername(input: string): string | null {
	const s = input.trim();
	if (!s) return null;
	const m = s.match(/lu\.ma\/user\/([^/?#]+)/i);
	const raw = m ? m[1] : s.replace(/^@/, '');
	return /^[A-Za-z0-9._-]+$/.test(raw) ? raw : null;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) error(401, 'sign in first');
	if (!locals.session) error(400, 'no session');

	const { username, profileUrl } = await request.json();
	const parsed = parseUsername(String(username ?? profileUrl ?? ''));
	if (!parsed) error(400, 'valid username or lu.ma profile url required');

	const nonce = issueNonce();
	await patchSessionData(locals.session.id, { lumaPending: { username: parsed, nonce } });

	return json({ nonce });
};

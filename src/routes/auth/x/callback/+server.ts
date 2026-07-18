import { redirect, error } from '@sveltejs/kit';
import { validateXCode } from '$lib/server/oauth/x';
import { patchSessionData } from '$lib/server/auth/session';
import { linkAccount } from '$lib/server/link';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user || !locals.session) return error(401, 'sign in first');

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const { xState, xVerifier } = locals.session.data as { xState?: string; xVerifier?: string };

	if (!code || !state || !xState || !xVerifier || state !== xState) {
		return error(400, 'invalid oauth state');
	}
	await patchSessionData(locals.session.id, { xState: undefined, xVerifier: undefined });

	const tokens = await validateXCode(code, xVerifier);

	const res = await fetch('https://api.twitter.com/2/users/me', {
		headers: { Authorization: `Bearer ${tokens.accessToken()}` }
	});
	if (!res.ok) return error(502, 'failed to fetch x user');
	const { data } = (await res.json()) as { data: { id: string; username: string } };

	const linked = await linkAccount({
		userId: locals.user.id,
		provider: 'x',
		providerAccountId: data.id,
		username: data.username
	});

	redirect(302, linked.ok ? '/verify?linked=x' : '/verify?error=x_taken');
};

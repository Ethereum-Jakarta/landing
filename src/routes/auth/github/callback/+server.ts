import { redirect, error } from '@sveltejs/kit';
import { validateAuthorizationCode } from '$lib/server/oauth/github';
import { patchSessionData } from '$lib/server/auth/session';
import { linkAccount } from '$lib/server/link';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user || !locals.session) redirect(302, '/login');

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const { githubState } = locals.session.data as { githubState?: string };

	if (!code || !state || !githubState || state !== githubState) {
		return error(400, 'invalid oauth state');
	}
	await patchSessionData(locals.session.id, { githubState: undefined });

	const tokens = await validateAuthorizationCode(url.origin, code);
	const res = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`,
			// GitHub requires a User-Agent on all API requests.
			'User-Agent': 'ethjkt-hub',
			Accept: 'application/vnd.github+json'
		}
	});
	if (!res.ok) return error(502, 'failed to fetch github user');
	const user = (await res.json()) as {
		id: number;
		login: string;
		avatar_url: string | null;
		html_url: string;
	};

	const linked = await linkAccount({
		userId: locals.user.id,
		provider: 'github',
		providerAccountId: String(user.id),
		username: user.login,
		metadata: { avatarUrl: user.avatar_url, profileUrl: user.html_url }
	});

	redirect(302, linked.ok ? '/verify?linked=github' : '/verify?error=github_taken');
};

import { env } from '$env/dynamic/private';

// ponytail: best-effort ONLY, never load-bearing. Guest/app tokens can't read
// follow relationships; a real check needs rotating logged-in session tokens
// (auth_token/ct0 cookies + bearer), which is fragile, bannable, ToS-gray, and
// rate-limited. Ship connect-only (honor-system) first; flip X_FOLLOW_CHECK=true
// only once you have a token-rotation pool worth maintaining. Upgrade path:
// replace the fetch below with your rotating-session client.
export async function checkFollows(
	sourceUsername: string,
	targetUsername = 'ethjkt'
): Promise<'following' | 'unknown'> {
	if (env.X_FOLLOW_CHECK !== 'true') return 'unknown';

	try {
		const bearer = env.X_BEARER_TOKEN;
		const auth = env.X_AUTH_TOKEN; // logged-in session cookies, rotated externally
		const csrf = env.X_CSRF_TOKEN;
		if (!bearer || !auth || !csrf) return 'unknown';

		// friendships/show reports the relationship both ways in one call.
		const url = new URL('https://api.twitter.com/1.1/friendships/show.json');
		url.searchParams.set('source_screen_name', sourceUsername);
		url.searchParams.set('target_screen_name', targetUsername);

		const res = await fetch(url, {
			headers: {
				authorization: `Bearer ${bearer}`,
				cookie: `auth_token=${auth}; ct0=${csrf}`,
				'x-csrf-token': csrf
			}
		});
		if (!res.ok) return 'unknown';

		const body = (await res.json()) as { relationship?: { source?: { following?: boolean } } };
		return body.relationship?.source?.following === true ? 'following' : 'unknown';
	} catch {
		return 'unknown';
	}
}

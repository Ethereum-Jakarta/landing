import * as arctic from 'arctic';
import { env } from '$env/dynamic/private';

const SCOPES = ['read:user'];

// ORIGIN from env, fallback to the request origin at call site.
function client(origin: string): arctic.GitHub {
	const base = env.ORIGIN || origin;
	return new arctic.GitHub(
		env.GITHUB_CLIENT_ID!,
		env.GITHUB_CLIENT_SECRET ?? null,
		`${base}/auth/github/callback`
	);
}

export function createAuthorizationURL(origin: string, state: string): URL {
	// GitHub OAuth doesn't use PKCE.
	return client(origin).createAuthorizationURL(state, SCOPES);
}

export function validateAuthorizationCode(
	origin: string,
	code: string
): Promise<arctic.OAuth2Tokens> {
	return client(origin).validateAuthorizationCode(code);
}

import * as arctic from 'arctic';
import { env } from '$env/dynamic/private';

// guilds.members.read lets us read the user's roles/nick within a specific guild.
const SCOPES = ['identify', 'guilds', 'guilds.members.read'];

// ORIGIN from env, fallback to the request origin at call site.
function client(origin: string): arctic.Discord {
	const base = env.ORIGIN || origin;
	return new arctic.Discord(
		env.DISCORD_CLIENT_ID!,
		env.DISCORD_CLIENT_SECRET ?? null,
		`${base}/auth/discord/callback`
	);
}

export function createAuthorizationURL(origin: string, state: string): URL {
	// Confidential client: no PKCE verifier.
	return client(origin).createAuthorizationURL(state, null, SCOPES);
}

export function validateAuthorizationCode(
	origin: string,
	code: string
): Promise<arctic.OAuth2Tokens> {
	return client(origin).validateAuthorizationCode(code, null);
}

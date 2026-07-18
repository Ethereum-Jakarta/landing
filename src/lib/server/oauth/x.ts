import { Twitter } from 'arctic';
import { env } from '$env/dynamic/private';

const client = new Twitter(
	env.X_CLIENT_ID!,
	env.X_CLIENT_SECRET ?? null,
	`${env.ORIGIN}/auth/x/callback`
);

const scopes = ['users.read', 'tweet.read'];

export function createXAuthorizationURL(state: string, codeVerifier: string): URL {
	return client.createAuthorizationURL(state, codeVerifier, scopes);
}

export function validateXCode(code: string, codeVerifier: string) {
	return client.validateAuthorizationCode(code, codeVerifier);
}

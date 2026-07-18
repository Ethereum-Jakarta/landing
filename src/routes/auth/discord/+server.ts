import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { patchSessionData } from '$lib/server/auth/session';
import { createAuthorizationURL } from '$lib/server/oauth/discord';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user || !locals.session) redirect(302, '/login');

	const state = generateState();
	await patchSessionData(locals.session.id, { discordState: state });

	redirect(302, createAuthorizationURL(url.origin, state).toString());
};

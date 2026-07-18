import { redirect, error } from '@sveltejs/kit';
import { generateState, generateCodeVerifier } from 'arctic';
import { patchSessionData } from '$lib/server/auth/session';
import { createXAuthorizationURL } from '$lib/server/oauth/x';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user || !locals.session) return error(401, 'sign in first');

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	await patchSessionData(locals.session.id, { xState: state, xVerifier: codeVerifier });

	redirect(302, createXAuthorizationURL(state, codeVerifier).toString());
};

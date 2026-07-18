import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { destroySession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ cookies }) => {
	await destroySession(cookies);
	return json({ ok: true });
};

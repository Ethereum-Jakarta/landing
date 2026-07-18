import type { Handle } from '@sveltejs/kit';
import { getSession, getSessionUser } from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = await getSession(event.cookies);
	event.locals.user = event.locals.session ? await getSessionUser(event.cookies) : null;
	return resolve(event);
};

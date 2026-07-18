import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { sessions, users, type Session, type User } from '../db/schema';

export const SESSION_COOKIE = 'ethjkt_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function newToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Get-or-create a session for this request. Anonymous sessions (no user) hold pre-login scratch data. */
export async function getOrCreateSession(cookies: Cookies): Promise<Session> {
	const token = cookies.get(SESSION_COOKIE);
	if (token) {
		const [existing] = await db.select().from(sessions).where(eq(sessions.id, token)).limit(1);
		if (existing && existing.expiresAt > new Date()) return existing;
	}
	const id = newToken();
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
	const [created] = await db.insert(sessions).values({ id, expiresAt, data: {} }).returning();
	setCookie(cookies, id, expiresAt);
	return created;
}

export async function getSession(cookies: Cookies): Promise<Session | null> {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return null;
	const [s] = await db.select().from(sessions).where(eq(sessions.id, token)).limit(1);
	if (!s || s.expiresAt <= new Date()) return null;
	return s;
}

export async function getSessionUser(cookies: Cookies): Promise<User | null> {
	const s = await getSession(cookies);
	if (!s?.userId) return null;
	const [u] = await db.select().from(users).where(eq(users.id, s.userId)).limit(1);
	return u ?? null;
}

/** Merge a patch into session.data (shallow). Used for nonce / OAuth state / PKCE. */
export async function patchSessionData(sessionId: string, patch: Record<string, unknown>) {
	const [s] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
	const data = { ...(s?.data ?? {}), ...patch };
	await db.update(sessions).set({ data }).where(eq(sessions.id, sessionId));
	return data;
}

export async function bindUser(sessionId: string, userId: string) {
	await db.update(sessions).set({ userId }).where(eq(sessions.id, sessionId));
}

export async function destroySession(cookies: Cookies) {
	const token = cookies.get(SESSION_COOKIE);
	if (token) await db.delete(sessions).where(eq(sessions.id, token));
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

function setCookie(cookies: Cookies, value: string, expires: Date) {
	cookies.set(SESSION_COOKIE, value, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires
	});
}

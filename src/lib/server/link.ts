import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { users, linkedAccounts, type Provider, type User } from './db/schema';

/** Upsert a user by wallet address (always lowercased). Used at SIWE login. */
export async function upsertUserByWallet(address: string): Promise<User> {
	const walletAddress = address.toLowerCase();
	const [existing] = await db
		.select()
		.from(users)
		.where(eq(users.walletAddress, walletAddress))
		.limit(1);
	if (existing) return existing;
	const [created] = await db.insert(users).values({ walletAddress }).returning();
	return created;
}

export type LinkResult = { ok: true } | { ok: false; reason: 'taken' }; // this provider account is linked to a different user

/**
 * Link (or refresh) a social account for a user. Enforces the unique
 * (provider, providerAccountId) constraint: a provider account already bound to
 * another user is rejected rather than silently stolen.
 */
export async function linkAccount(input: {
	userId: string;
	provider: Provider;
	providerAccountId: string;
	username?: string | null;
	metadata?: Record<string, unknown>;
}): Promise<LinkResult> {
	const [claimed] = await db
		.select()
		.from(linkedAccounts)
		.where(
			and(
				eq(linkedAccounts.provider, input.provider),
				eq(linkedAccounts.providerAccountId, input.providerAccountId)
			)
		)
		.limit(1);

	if (claimed && claimed.userId !== input.userId) return { ok: false, reason: 'taken' };

	if (claimed) {
		await db
			.update(linkedAccounts)
			.set({
				username: input.username ?? claimed.username,
				metadata: { ...claimed.metadata, ...(input.metadata ?? {}) },
				verifiedAt: new Date()
			})
			.where(eq(linkedAccounts.id, claimed.id));
	} else {
		await db.insert(linkedAccounts).values({
			userId: input.userId,
			provider: input.provider,
			providerAccountId: input.providerAccountId,
			username: input.username ?? null,
			metadata: input.metadata ?? {}
		});
	}
	return { ok: true };
}

export async function getLinkedAccounts(userId: string) {
	return db.select().from(linkedAccounts).where(eq(linkedAccounts.userId, userId));
}

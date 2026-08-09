import { pgTable, text, timestamp, jsonb, integer, uniqueIndex, index } from 'drizzle-orm/pg-core';

/** A member, identified by their wallet. */
export const users = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	// always store lowercased
	walletAddress: text('wallet_address').notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type Provider = 'discord' | 'x' | 'luma' | 'instagram' | 'github';

/** A verified social link for a user. One row per (provider, provider_account_id). */
export const linkedAccounts = pgTable(
	'linked_accounts',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: text('provider').notNull().$type<Provider>(),
		providerAccountId: text('provider_account_id').notNull(),
		username: text('username'),
		verifiedAt: timestamp('verified_at', { withTimezone: true }).notNull().defaultNow(),
		// provider-specific extras: discord is_member, follow status, etc.
		metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({})
	},
	(t) => [
		uniqueIndex('linked_provider_account_uq').on(t.provider, t.providerAccountId),
		index('linked_user_idx').on(t.userId)
	]
);

/** Server session: cookie token -> user, with scratch data (SIWE nonce, OAuth state/PKCE, pending nonces). */
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(), // random token, also the cookie value
	userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	data: jsonb('data').$type<Record<string, unknown>>().notNull().default({})
});

/** One row per dispensed faucet claim; drives per-wallet and per-IP daily limits. */
export const faucetClaims = pgTable(
	'faucet_claims',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		chainId: integer('chain_id').notNull(),
		token: text('token').notNull(), // 'native' or ERC-20 symbol
		amount: text('amount').notNull(), // wei/base-units as string
		txHash: text('tx_hash').notNull(),
		ipHash: text('ip_hash').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(t) => [
		index('claims_user_created_idx').on(t.userId, t.createdAt),
		index('claims_ip_created_idx').on(t.ipHash, t.createdAt)
	]
);

export type User = typeof users.$inferSelect;
export type LinkedAccount = typeof linkedAccounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type FaucetClaim = typeof faucetClaims.$inferSelect;

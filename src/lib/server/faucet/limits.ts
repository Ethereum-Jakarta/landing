import { and, eq, gte, count } from 'drizzle-orm';
import { faucetClaims } from '$lib/server/db/schema';

/** Midnight UTC of the given date's day. Pure — the daily rate-limit bucket. */
export function startOfUtcDay(d: Date): Date {
	return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// db pulls in $env at module load; import it lazily so the pure helpers above
// stay importable in unit tests without a runtime env.
async function getDb() {
	return (await import('$lib/server/db')).db;
}

/** True if this user already claimed this chain+token in the current UTC day. */
export async function hasClaimedToday(
	userId: string,
	chainId: number,
	token: string
): Promise<boolean> {
	const db = await getDb();
	const [row] = await db
		.select({ n: count() })
		.from(faucetClaims)
		.where(
			and(
				eq(faucetClaims.userId, userId),
				eq(faucetClaims.chainId, chainId),
				eq(faucetClaims.token, token),
				gte(faucetClaims.createdAt, startOfUtcDay(new Date()))
			)
		);
	return (row?.n ?? 0) > 0;
}

/** Today's claim for this user+chain+token (UTC day), if any, so the UI can show it up front. */
export async function claimToday(
	userId: string,
	chainId: number,
	token: string
): Promise<{ txHash: string } | null> {
	const db = await getDb();
	const [row] = await db
		.select({ txHash: faucetClaims.txHash })
		.from(faucetClaims)
		.where(
			and(
				eq(faucetClaims.userId, userId),
				eq(faucetClaims.chainId, chainId),
				eq(faucetClaims.token, token),
				gte(faucetClaims.createdAt, startOfUtcDay(new Date()))
			)
		)
		.limit(1);
	return row ? { txHash: row.txHash } : null;
}

/** Count of claims from this IP hash in the current UTC day (all chains/tokens). */
export async function ipClaimsToday(ipHash: string): Promise<number> {
	const db = await getDb();
	const [row] = await db
		.select({ n: count() })
		.from(faucetClaims)
		.where(
			and(eq(faucetClaims.ipHash, ipHash), gte(faucetClaims.createdAt, startOfUtcDay(new Date())))
		);
	return row?.n ?? 0;
}

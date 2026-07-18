import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { faucetClaims } from '$lib/server/db/schema';
import { getLinkedAccounts } from '$lib/server/link';
import { hashIp } from '$lib/server/ip';
import { getChain, REQUIRED_PROVIDERS } from '$lib/server/faucet/config';
import { hasClaimedToday, ipClaimsToday } from '$lib/server/faucet/limits';
import { dispenseNative } from '$lib/server/faucet/dispense';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	if (!locals.user) error(401, 'sign in first');

	const { chainId, token = 'native' } = await request.json();
	const chain = getChain(chainId);
	if (!chain) error(400, 'unsupported chain');
	if (token !== 'native') error(400, 'only native token is supported');

	// (1) gate: all required socials linked
	const linked = await getLinkedAccounts(locals.user.id);
	const have = new Set(linked.map((a) => a.provider));
	const missing = REQUIRED_PROVIDERS.filter((p) => !have.has(p));
	if (missing.length) error(403, `link required accounts: ${missing.join(', ')}`);

	// (2) rate limits
	if (await hasClaimedToday(locals.user.id, chain.chainId, token)) {
		error(429, 'already claimed today on this chain');
	}
	const ipHash = hashIp(request, getClientAddress);
	if ((await ipClaimsToday(ipHash)) >= chain.perIpDailyCap) {
		error(429, 'daily IP limit reached');
	}

	// (3) dispense
	const { txHash } = await dispenseNative(chain, locals.user.walletAddress as `0x${string}`);

	// (4) record
	await db.insert(faucetClaims).values({
		userId: locals.user.id,
		chainId: chain.chainId,
		token,
		amount: chain.amount.toString(),
		txHash,
		ipHash
	});

	return json({ txHash });
};

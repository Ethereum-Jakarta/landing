import { formatEther } from 'viem';
import type { PageServerLoad } from './$types';
import { CHAINS, REQUIRED_PROVIDERS } from '$lib/server/faucet/config';
import { claimToday } from '$lib/server/faucet/limits';

// Chain list + rules come from the same config the claim endpoint enforces.
export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const chains = await Promise.all(
		CHAINS.map(async (c) => ({
			chainId: c.chainId,
			name: c.name,
			amount: `${formatEther(c.amount)} ${c.nativeSymbol}`,
			// Shown on load so people don't have to click to find out they already claimed.
			claimedToday: user ? await claimToday(user.id, c.chainId, 'native') : null
		}))
	);
	return { chains, required: [...REQUIRED_PROVIDERS] as string[] };
};

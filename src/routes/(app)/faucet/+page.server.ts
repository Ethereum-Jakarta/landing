import { formatEther } from 'viem';
import type { PageServerLoad } from './$types';
import { CHAINS, REQUIRED_PROVIDERS } from '$lib/server/faucet/config';

// Chain list + rules come from the same config the claim endpoint enforces.
export const load: PageServerLoad = async () => ({
	chains: CHAINS.map((c) => ({
		chainId: c.chainId,
		name: c.name,
		amount: `${formatEther(c.amount)} ${c.nativeSymbol}`
	})),
	required: [...REQUIRED_PROVIDERS] as string[]
});

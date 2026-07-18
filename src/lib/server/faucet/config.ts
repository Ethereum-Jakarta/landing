import { parseEther } from 'viem';
import type { Provider } from '$lib/server/db/schema';

export interface FaucetToken {
	symbol: string;
	address: `0x${string}`;
	decimals: number;
	amount: bigint; // base units per claim
}

export interface FaucetChain {
	key: string;
	chainId: number;
	name: string;
	rpcEnv: string; // env var holding the RPC URL
	pkEnv: string; // env var holding the hot-wallet private key
	nativeSymbol: string;
	amount: bigint; // wei of native per claim
	perIpDailyCap: number;
	tokens?: FaucetToken[];
}

/**
 * Launch chains. Native-only for now.
 * ponytail: Sepolia is EOL ~Sept 2026 — swap this one entry (chainId/rpcEnv/pkEnv)
 * for the successor L1 testnet, no other file changes needed.
 */
export const CHAINS: FaucetChain[] = [
	{
		key: 'sepolia',
		chainId: 11155111,
		name: 'Sepolia',
		rpcEnv: 'FAUCET_RPC_SEPOLIA',
		pkEnv: 'FAUCET_PK_SEPOLIA',
		nativeSymbol: 'ETH',
		amount: parseEther('0.05'),
		perIpDailyCap: 3
	},
	{
		key: 'base-sepolia',
		chainId: 84532,
		name: 'Base Sepolia',
		rpcEnv: 'FAUCET_RPC_BASE_SEPOLIA',
		pkEnv: 'FAUCET_PK_BASE_SEPOLIA',
		nativeSymbol: 'ETH',
		amount: parseEther('0.05'),
		perIpDailyCap: 3
	}
];

export function getChain(chainId: number): FaucetChain | undefined {
	return CHAINS.find((c) => c.chainId === chainId);
}

/** Every provider a user must have linked before they can claim. */
export const REQUIRED_PROVIDERS: Provider[] = ['discord', 'x', 'luma', 'instagram'];

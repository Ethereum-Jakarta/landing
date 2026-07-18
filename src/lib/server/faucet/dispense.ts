import { createWalletClient, http, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { env } from '$env/dynamic/private';
import type { FaucetChain } from './config';

/**
 * Serialize sends per chain: a single hot wallet means concurrent txs race on the
 * nonce. Chain the promise so each dispense on a chain waits for the prior one.
 * ponytail: in-process mutex per chain — move to a durable queue only if a single
 * process can't keep up or we need multi-instance coordination.
 */
const locks = new Map<number, Promise<unknown>>();

function walletFor(chain: FaucetChain) {
	const rpc = env[chain.rpcEnv];
	const pk = env[chain.pkEnv];
	if (!rpc) throw new Error(`${chain.rpcEnv} is not set`);
	if (!pk) throw new Error(`${chain.pkEnv} is not set`);
	const account = privateKeyToAccount(pk as Hex);
	return createWalletClient({
		account,
		chain: {
			id: chain.chainId,
			name: chain.name,
			nativeCurrency: { name: chain.nativeSymbol, symbol: chain.nativeSymbol, decimals: 18 },
			rpcUrls: { default: { http: [rpc] } }
		},
		transport: http(rpc)
	});
}

export async function dispenseNative(
	chain: FaucetChain,
	to: `0x${string}`
): Promise<{ txHash: string }> {
	const prev = locks.get(chain.chainId) ?? Promise.resolve();
	const next = prev
		.catch(() => {})
		.then(async () => {
			const client = walletFor(chain);
			const txHash = await client.sendTransaction({ to, value: chain.amount });
			return { txHash };
		});
	locks.set(chain.chainId, next);
	return next;
}

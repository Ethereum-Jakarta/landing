import { createAppKit, type AppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia, baseSepolia } from '@reown/appkit/networks';
import { getAccount, signMessage, watchAccount, type Config } from '@wagmi/core';
import { createSiweMessage } from 'viem/siwe';
import { env } from '$env/dynamic/public';
import { readError } from '$lib/utils/errors';

const networks = [mainnet, sepolia, baseSepolia] as const;

let modal: AppKit | undefined;
let wagmiConfig: Config | undefined;

/** Lazily create the AppKit modal + wagmi config. Browser-only (touches window). */
function ensureInit() {
	if (modal && wagmiConfig) return { modal, wagmiConfig };
	const projectId = env.PUBLIC_REOWN_PROJECT_ID ?? '';
	const adapter = new WagmiAdapter({ networks: [...networks], projectId });
	wagmiConfig = adapter.wagmiConfig as unknown as Config;
	modal = createAppKit({
		adapters: [adapter],
		networks: [...networks],
		projectId,
		metadata: {
			name: 'ETHJKT',
			description: 'ETHJKT member hub',
			url: typeof location !== 'undefined' ? location.origin : 'https://ethjkt.com',
			icons: []
		},
		themeMode: 'light'
	});
	return { modal, wagmiConfig };
}

export function openWallet() {
	return ensureInit().modal.open();
}

/** Resolve once a wallet is connected, opening the modal if needed. Rejects if the user backs out. */
function waitForAddress(config: Config, timeoutMs = 180_000): Promise<`0x${string}`> {
	const existing = getAccount(config).address;
	if (existing) return Promise.resolve(existing);
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			unwatch();
			reject(new Error('wallet not connected'));
		}, timeoutMs);
		const unwatch = watchAccount(config, {
			onChange(account) {
				if (account.address) {
					clearTimeout(timer);
					unwatch();
					resolve(account.address);
				}
			}
		});
	});
}

/** One-shot SIWE: connect the wallet (opening the modal if needed), then sign + verify server-side. */
export async function signIn(): Promise<{ id: string; walletAddress: string }> {
	const { modal, wagmiConfig } = ensureInit();
	let address = getAccount(wagmiConfig).address;
	if (!address) {
		await modal.open();
		address = await waitForAddress(wagmiConfig);
	}

	const { nonce } = await fetch('/api/auth/nonce').then((r) => r.json());
	const message = createSiweMessage({
		domain: location.host,
		address,
		statement: 'Sign in to the ETHJKT member hub.',
		uri: location.origin,
		version: '1',
		chainId: getAccount(wagmiConfig).chainId ?? 1,
		nonce
	});
	const signature = await signMessage(wagmiConfig, { message });

	const res = await fetch('/api/auth/verify', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ message, signature })
	});
	if (!res.ok)
		throw new Error(await readError(res, "We couldn't verify your signature. Please try again."));
	const { user } = await res.json();
	return user;
}

export async function logout() {
	await fetch('/api/auth/logout', { method: 'POST' });
}

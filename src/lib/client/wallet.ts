import { createAppKit, type AppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia, baseSepolia } from '@reown/appkit/networks';
import { getAccount, signMessage, type Config } from '@wagmi/core';
import { createSiweMessage } from 'viem/siwe';
import { env } from '$env/dynamic/public';

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
			name: 'ethjkt',
			description: 'ethjkt member hub',
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

/** SIWE sign-in: connect if needed, sign a server-issued nonce, verify server-side. */
export async function signIn(): Promise<{ id: string; walletAddress: string }> {
	const { modal, wagmiConfig } = ensureInit();
	const account = getAccount(wagmiConfig);
	if (!account.address) {
		await modal.open();
		throw new Error('connect a wallet, then sign in again');
	}

	const { nonce } = await fetch('/api/auth/nonce').then((r) => r.json());
	const message = createSiweMessage({
		domain: location.host,
		address: account.address,
		statement: 'Sign in to the ethjkt member hub.',
		uri: location.origin,
		version: '1',
		chainId: account.chainId ?? 1,
		nonce
	});
	const signature = await signMessage(wagmiConfig, { message });

	const res = await fetch('/api/auth/verify', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ message, signature })
	});
	if (!res.ok) throw new Error(await res.text());
	const { user } = await res.json();
	return user;
}

export async function logout() {
	await fetch('/api/auth/logout', { method: 'POST' });
}

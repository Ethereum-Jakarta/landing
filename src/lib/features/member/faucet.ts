export type TankState =
	| { kind: 'ready' }
	| { kind: 'locked' }
	| { kind: 'sending' }
	| { kind: 'claimed'; txHash: string; fresh: boolean }
	| { kind: 'error'; message: string; needsHub: boolean };

export const EXPLORERS: Record<number, string> = {
	11155111: 'https://sepolia.etherscan.io/tx/',
	84532: 'https://sepolia.basescan.org/tx/'
};

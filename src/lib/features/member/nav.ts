export const MEMBER_NAV = [
	{ label: 'Hub', href: '/verify', icon: 'id' },
	{ label: 'Gas Tanks', href: '/faucet', icon: 'gas' },
	{ label: 'Agent', href: '/chat', icon: 'chat' }
] as const;

export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

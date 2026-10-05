export type ProviderId = 'discord' | 'x' | 'luma' | 'instagram' | 'github';

export interface ProviderMeta {
	id: ProviderId;
	label: string;
	/** oauth: redirect flow; bio: paste a code into the profile bio, then verify. */
	kind: 'oauth' | 'bio';
	href?: string;
	/** One line on why linking this matters to the member. */
	why: string;
}

// Display order: required ones first (the faucet gate), then optional.
export const PROVIDERS: ProviderMeta[] = [
	{
		id: 'discord',
		label: 'Discord',
		kind: 'oauth',
		href: '/auth/discord',
		why: 'Confirms you are in the ETHJKT server and shows your community roles.'
	},
	{
		id: 'x',
		label: 'X',
		kind: 'oauth',
		href: '/auth/x',
		why: 'Connects the X account you use to follow and share ETHJKT news.'
	},
	{
		id: 'luma',
		label: 'Lu.ma',
		kind: 'bio',
		why: 'Links the Lu.ma profile you use to register for ETHJKT events.'
	},
	{
		id: 'instagram',
		label: 'Instagram',
		kind: 'bio',
		why: 'Verified with a short code in your bio. No password needed.'
	},
	{
		id: 'github',
		label: 'GitHub',
		kind: 'oauth',
		href: '/auth/github',
		why: 'Adds your GitHub to your member identity.'
	}
];

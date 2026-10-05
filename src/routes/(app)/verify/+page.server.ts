import type { PageServerLoad } from './$types';
import { getLinkedAccounts } from '$lib/server/link';
import { getMemberRolesLive } from '$lib/server/discord/guild';
import { REQUIRED_PROVIDERS } from '$lib/server/faucet/config';

export const load: PageServerLoad = async ({ locals }) => {
	// Accounts the faucet requires; the hub shows progress toward unlocking it.
	const required = [...REQUIRED_PROVIDERS] as string[];
	if (!locals.user) return { required };
	const discord = (await getLinkedAccounts(locals.user.id)).find((l) => l.provider === 'discord');
	if (!discord) return { required };
	// null when the bot token isn't set → page falls back to the stored snapshot count.
	const discordLive = await getMemberRolesLive(discord.providerAccountId);
	return { required, discordLive };
};

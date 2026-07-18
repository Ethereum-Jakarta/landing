import type { PageServerLoad } from './$types';
import { getLinkedAccounts } from '$lib/server/link';
import { getMemberRolesLive } from '$lib/server/discord/guild';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return {};
	const discord = (await getLinkedAccounts(locals.user.id)).find((l) => l.provider === 'discord');
	if (!discord) return {};
	// null when the bot token isn't set → page falls back to the stored snapshot count.
	const discordLive = await getMemberRolesLive(discord.providerAccountId);
	return { discordLive };
};

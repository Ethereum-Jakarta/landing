import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { validateAuthorizationCode } from '$lib/server/oauth/discord';
import { patchSessionData } from '$lib/server/auth/session';
import { linkAccount } from '$lib/server/link';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user || !locals.session) redirect(302, '/login');

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const { discordState } = locals.session.data as { discordState?: string };

	if (!code || !state || !discordState || state !== discordState) {
		return error(400, 'invalid oauth state');
	}
	await patchSessionData(locals.session.id, { discordState: undefined });

	const tokens = await validateAuthorizationCode(url.origin, code);
	const auth = { Authorization: `Bearer ${tokens.accessToken()}` };

	const userRes = await fetch('https://discord.com/api/users/@me', { headers: auth });
	if (!userRes.ok) return error(502, 'failed to fetch discord user');
	const user = (await userRes.json()) as { id: string; username: string; avatar: string | null };

	const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', { headers: auth });
	if (!guildsRes.ok) return error(502, 'failed to fetch discord guilds');
	const guilds = (await guildsRes.json()) as { id: string }[];
	const is_member = guilds.some((g) => g.id === env.DISCORD_GUILD_ID);

	// avatar CDN url — always .png (renders for both static and animated `a_` hashes;
	// the .gif form 415s for some animated avatars).
	const avatarUrl = user.avatar
		? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
		: null;

	// Roles + server nickname on the ethjkt guild — only readable if they're a member.
	// Returns role IDs (snowflakes); resolving IDs -> names needs a bot token (see DISCORD_BOT_TOKEN).
	let roles: string[] = [];
	let nick: string | null = null;
	if (is_member && env.DISCORD_GUILD_ID) {
		const memberRes = await fetch(
			`https://discord.com/api/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`,
			{ headers: auth }
		);
		if (memberRes.ok) {
			const member = (await memberRes.json()) as { roles?: string[]; nick?: string | null };
			roles = member.roles ?? [];
			nick = member.nick ?? null;
		}
	}

	const linked = await linkAccount({
		userId: locals.user.id,
		provider: 'discord',
		providerAccountId: user.id,
		username: user.username,
		metadata: { is_member, avatarUrl, roles, nick }
	});

	redirect(302, linked.ok ? '/verify?linked=discord' : '/verify?error=discord_taken');
};

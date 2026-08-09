import { env } from '$env/dynamic/private';

const API = 'https://discord.com/api/v10';

type RoleInfo = { id: string; name: string; colorHex: string | null; position: number };

// The guild role list changes rarely — cache it briefly to avoid a fetch per page load.
let cache: { at: number; roles: Map<string, RoleInfo> } | null = null;
const TTL_MS = 60_000;

function botFetch(path: string) {
	return fetch(`${API}${path}`, { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } });
}

async function guildRoles(now: number): Promise<Map<string, RoleInfo>> {
	if (cache && now - cache.at < TTL_MS) return cache.roles;
	const res = await botFetch(`/guilds/${env.DISCORD_GUILD_ID}/roles`);
	if (!res.ok) throw new Error(`discord roles fetch failed: ${res.status}`);
	const raw = (await res.json()) as { id: string; name: string; color: number; position: number }[];
	const map = new Map<string, RoleInfo>();
	for (const r of raw) {
		map.set(r.id, {
			id: r.id,
			name: r.name,
			position: r.position,
			// Discord `color` is a decimal int; 0 means "no color" (inherit).
			colorHex: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : null
		});
	}
	cache = { at: now, roles: map };
	return map;
}

export type MemberRoles = {
	isMember: boolean;
	roles: { name: string; colorHex: string | null }[];
};

/**
 * Live roles for a Discord user in the ethjkt guild, via the bot token.
 * Returns null when the bot isn't configured (caller falls back to the connect-time snapshot).
 * Reflects current roles on each call — refresh the page to see adds/removes.
 */
export async function getMemberRolesLive(
	userId: string,
	now = Date.now()
): Promise<MemberRoles | null> {
	if (!env.DISCORD_BOT_TOKEN || !env.DISCORD_GUILD_ID) return null;
	const memRes = await botFetch(`/guilds/${env.DISCORD_GUILD_ID}/members/${userId}`);
	if (memRes.status === 404) return { isMember: false, roles: [] };
	if (!memRes.ok) return null;
	const member = (await memRes.json()) as { roles: string[] };
	const all = await guildRoles(now);
	const roles = member.roles
		.map((id) => all.get(id))
		.filter((r): r is RoleInfo => !!r && r.id !== env.DISCORD_GUILD_ID) // drop @everyone
		.sort((a, b) => b.position - a.position)
		.map((r) => ({ name: r.name, colorHex: r.colorHex }));
	return { isMember: true, roles };
}

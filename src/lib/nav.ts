import { env } from '$env/dynamic/public';

/**
 * The member hub (wallet login, identity, faucet, chat) is still being built.
 * Set PUBLIC_HUB_ENABLED=false to show it as "Soon" and block the routes.
 * Unset means enabled, so local dev keeps working without touching .env.
 */
export const hubEnabled = env.PUBLIC_HUB_ENABLED !== 'false';

export type NavItem = { label: string; href: string; soon?: boolean };

/** Site-wide nav. Every header renders this — change links here, not per page. */
export const siteNav: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Events', href: '/events' },
	{ label: 'Hub', href: '/verify', soon: !hubEnabled }
];

/** Second-level nav for the signed-in member hub. */
export const hubNav: NavItem[] = [
	{ label: 'Identity', href: '/verify' },
	{ label: 'Gas Tanks', href: '/faucet' },
	{ label: 'Agent', href: '/chat' }
];

/** Anchors never highlight; '/' needs an exact match or it matches every route. */
export function isActive(href: string, pathname: string): boolean {
	if (href.includes('#')) return false;
	return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

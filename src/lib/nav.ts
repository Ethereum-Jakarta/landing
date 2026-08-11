export type NavItem = { label: string; href: string };

/** Site-wide nav. Every header renders this — change links here, not per page. */
export const siteNav: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'Events', href: '/events' },
	{ label: 'Hub', href: '/verify' }
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

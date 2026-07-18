// Instagram account linking via bio-nonce: ownership proof only.
// The Graph API can't verify follows, so this only proves control of the profile
// by requiring the nonce to appear in the public bio.

const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export function issueNonce(): string {
	return 'ethjkt-' + crypto.randomUUID();
}

/** Pure helper: does the bio contain the nonce? Case-insensitive, trims surrounding whitespace. */
export function bioContainsNonce(bio: string, nonce: string): boolean {
	return bio.toLowerCase().includes(nonce.trim().toLowerCase());
}

/**
 * Best-effort fetch of the public IG profile bio and substring-match the nonce.
 * ponytail: IG rate-limits/blocks server IPs; this is best-effort. Working source
 * pinned to web_profile_info (x-ig-app-id) with a raw-HTML fallback. If IG walls
 * this off, upgrade path is a residential proxy or an oauth flow.
 */
export async function fetchBioContainsNonce(
	username: string,
	nonce: string
): Promise<{ ok: boolean }> {
	const u = username.replace(/^@/, '').trim();

	// Primary: private web_profile_info API used by the web client.
	try {
		const res = await fetch(
			`https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(u)}`,
			{ headers: { 'User-Agent': UA, 'x-ig-app-id': '936619743392459' } }
		);
		if (res.ok) {
			const bio = (await res.json())?.data?.user?.biography;
			if (typeof bio === 'string') return { ok: bioContainsNonce(bio, nonce) };
		}
	} catch {
		// fall through to HTML
	}

	// Fallback: scrape the raw profile HTML and substring-match the nonce anywhere.
	try {
		const res = await fetch(`https://www.instagram.com/${encodeURIComponent(u)}/`, {
			headers: { 'User-Agent': UA }
		});
		if (res.ok) {
			const html = await res.text();
			return { ok: bioContainsNonce(html, nonce) };
		}
	} catch {
		// give up
	}

	return { ok: false };
}

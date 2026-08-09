// Instagram account linking via bio-nonce: ownership proof only.
// The Graph API can't verify follows, so this only proves control of the profile
// by requiring the nonce to appear in the public bio.

const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// The web client's private profile API. IG serves it from both hosts; it's the only
// source that still contains the bio for logged-out requests (the SSR HTML no longer does).
const HOSTS = ['i.instagram.com', 'www.instagram.com'];

export function issueNonce(): string {
	return 'ethjkt-' + crypto.randomUUID();
}

/** Pure helper: does the bio contain the nonce? Case-insensitive, trims surrounding whitespace. */
export function bioContainsNonce(bio: string, nonce: string): boolean {
	return bio.toLowerCase().includes(nonce.trim().toLowerCase());
}

/** Fetch the profile bio, trying both hosts. Returns null if IG blocked/throttled every attempt. */
async function fetchBio(username: string): Promise<string | null> {
	for (const host of HOSTS) {
		try {
			const res = await fetch(
				`https://${host}/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
				{
					headers: { 'User-Agent': UA, 'x-ig-app-id': '936619743392459', Accept: '*/*' }
				}
			);
			if (!res.ok) continue;
			const bio = (await res.json())?.data?.user?.biography;
			if (typeof bio === 'string') return bio;
		} catch {
			// try the next host
		}
	}
	return null;
}

export type BioCheck = { status: 'found' | 'not_found' | 'unavailable' };

/**
 * Best-effort bio-nonce check with retries. IG throttles server IPs intermittently, so
 * distinguish "reached IG, nonce absent" (not_found) from "couldn't reach IG" (unavailable)
 * — the latter must NOT be reported to the user as a missing nonce.
 * ponytail: if IG walls this off entirely, upgrade path is a residential proxy.
 */
export async function fetchBioContainsNonce(
	username: string,
	nonce: string,
	attempts = 3
): Promise<BioCheck> {
	const u = username.replace(/^@/, '').trim();
	for (let i = 0; i < attempts; i++) {
		const bio = await fetchBio(u);
		if (bio !== null) return { status: bioContainsNonce(bio, nonce) ? 'found' : 'not_found' };
		if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)));
	}
	return { status: 'unavailable' };
}

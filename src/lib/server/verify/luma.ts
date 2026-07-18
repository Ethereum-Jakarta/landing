const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/** Issue a one-time bio-verification nonce for the user to paste into their lu.ma bio. */
export function issueNonce() {
	const bytes = crypto.getRandomValues(new Uint8Array(12));
	return 'ethjkt-verify-' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fetch a lu.ma public profile and check the bio contains `nonce`.
 * Sources tried in order; substring-match on whichever returns the bio.
 * ponytail: pinned to api.lu.ma/user/get, falls back to the __NEXT_DATA__ HTML blob.
 * Both are unofficial endpoints — if lu.ma changes them, re-pin here.
 */
export async function fetchProfileContainsNonce(
	username: string,
	nonce: string
): Promise<{ ok: boolean; displayName?: string }> {
	const u = encodeURIComponent(username);

	// (1) JSON API
	try {
		const res = await fetch(`https://api.lu.ma/user/get?username=${u}`, {
			headers: { 'User-Agent': UA, accept: 'application/json' }
		});
		if (res.ok) {
			const data = (await res.json()) as Record<string, unknown>;
			const user = (data?.user as Record<string, unknown>) ?? data;
			const bio = readStr(user, 'bio_short') ?? readStr(user, 'bio') ?? '';
			if (bio) return { ok: bio.includes(nonce), displayName: readStr(user, 'name') };
		}
	} catch {
		// fall through to HTML
	}

	// (2) __NEXT_DATA__ HTML blob
	try {
		const res = await fetch(`https://lu.ma/user/${u}`, {
			headers: { 'User-Agent': UA, accept: 'text/html' }
		});
		if (res.ok) {
			const html = await res.text();
			const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
			if (m) {
				const next = JSON.parse(m[1]) as Record<string, unknown>;
				const props = next?.props as Record<string, unknown> | undefined;
				const user = findUser(props?.pageProps);
				const bio = readStr(user, 'bio_short') ?? readStr(user, 'bio') ?? '';
				if (bio) return { ok: bio.includes(nonce), displayName: readStr(user, 'name') };
			}
			// last resort: raw substring on the HTML
			return { ok: html.includes(nonce) };
		}
	} catch {
		// fall through
	}

	return { ok: false };
}

/** Read a string field off an unknown object, or undefined. */
function readStr(o: unknown, key: string): string | undefined {
	if (o && typeof o === 'object') {
		const v = (o as Record<string, unknown>)[key];
		if (typeof v === 'string') return v;
	}
	return undefined;
}

const hasBio = (v: unknown) =>
	readStr(v, 'bio') !== undefined || readStr(v, 'bio_short') !== undefined;

/** Shallow-ish hunt for the profile user object in an unknown pageProps shape. */
function findUser(pageProps: unknown): unknown {
	if (!pageProps || typeof pageProps !== 'object') return undefined;
	const pp = pageProps as Record<string, unknown>;
	if (hasBio(pp.user)) return pp.user;
	for (const v of Object.values(pp)) {
		if (v && typeof v === 'object' && hasBio(v)) return v;
	}
	return pp.user;
}

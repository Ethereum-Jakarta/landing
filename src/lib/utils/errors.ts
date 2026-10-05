// Turns server/wallet failures into sentences a person can act on.
// API routes throw SvelteKit `error(status, 'terse message')`, which arrives as JSON
// (`{"message": "..."}`); never show that raw.

const FRIENDLY: Record<string, string> = {
	'sign in first': 'Your session has expired. Sign in again to continue.',
	'no session': 'Your session has expired. Sign in again to continue.',
	'no session; request a nonce first': 'Your sign-in request expired. Please try again.',
	'no nonce issued': 'Your sign-in request expired. Please try again.',
	'message and signature required': 'The signature was incomplete. Please try again.',
	'username required': 'Enter your username first.',
	'valid username or lu.ma profile url required': 'Enter your Lu.ma username or profile link.',
	'nonce not found in lu.ma bio':
		"We couldn't find the code in your Lu.ma bio. Save your profile with the code in it, then check again.",
	'no pending luma challenge; request one first': 'Start again by entering your Lu.ma username.',
	'no pending instagram challenge; request one first':
		'Start again by entering your Instagram username.',
	'already claimed today on this chain':
		"You've already claimed on this chain today. Come back tomorrow for more.",
	'daily ip limit reached':
		"Today's claim limit for your network has been reached. Try again tomorrow.",
	'too many messages, slow down': "You're sending messages quickly. Wait a moment, then try again.",
	'chat not configured': "The agent isn't available right now. Please try again later.",
	'wallet not connected': 'No wallet was connected. Choose a wallet to continue.'
};

const PROVIDER_NAMES: Record<string, string> = {
	discord: 'Discord',
	x: 'X',
	luma: 'Lu.ma',
	instagram: 'Instagram',
	github: 'GitHub'
};

export function providerName(id: string): string {
	return PROVIDER_NAMES[id] ?? id;
}

function sentence(s: string): string {
	const t = s.trim();
	if (!t) return t;
	const cased = t[0].toUpperCase() + t.slice(1);
	return /[.!?]$/.test(cased) ? cased : `${cased}.`;
}

/** Map a terse server message to friendly copy (falls back to a cleaned-up version of it). */
export function friendlyMessage(raw: string, fallback = 'Something went wrong. Please try again.') {
	const msg = raw.trim();
	if (!msg || msg.startsWith('<')) return fallback;
	const known = FRIENDLY[msg.toLowerCase()];
	if (known) return known;
	const missing = /^link required accounts: (.+)$/i.exec(msg);
	if (missing) {
		const names = missing[1].split(',').map((p) => providerName(p.trim()));
		return `Link ${names.join(', ')} in your Hub to claim.`;
	}
	if (/user (rejected|denied)|rejected the request/i.test(msg))
		return 'You cancelled the request in your wallet. Try again when you are ready.';
	return sentence(msg);
}

/** Read a failed fetch Response (JSON `{message}` or text) into friendly copy. */
export async function readError(res: Response, fallback?: string): Promise<string> {
	const text = await res.text().catch(() => '');
	let msg = text;
	try {
		const parsed = JSON.parse(text) as { message?: unknown };
		if (typeof parsed?.message === 'string') msg = parsed.message;
	} catch {
		// plain-text body
	}
	return friendlyMessage(msg, fallback);
}

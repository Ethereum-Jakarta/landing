import { createHash } from 'node:crypto';
import { env } from '$env/dynamic/private';

/**
 * Salted hash of the client IP for rate limiting. Behind Railway's proxy the real
 * client is the first entry of x-forwarded-for; fall back to the socket address.
 */
export function hashIp(request: Request, getClientAddress: () => string): string {
	const fwd = request.headers.get('x-forwarded-for');
	const ip = fwd ? fwd.split(',')[0].trim() : getClientAddress();
	return createHash('sha256')
		.update((env.IP_HASH_SALT ?? '') + ip)
		.digest('hex');
}

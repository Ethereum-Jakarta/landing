import { generateSiweNonce, parseSiweMessage, validateSiweMessage } from 'viem/siwe';
import { recoverMessageAddress, type Address } from 'viem';

export { generateSiweNonce as generateNonce };

/**
 * Verify a SIWE login: nonce must match the one we issued, message must be valid
 * (domain/expiry/notBefore), and the signature must recover to the stated address.
 *
 * EOA-only (uses recoverMessageAddress, no RPC). ponytail: add viem verifySiweMessage
 * + a public client for ERC-1271/6492 smart-account wallets if members need them.
 */
export async function verifySiwe(params: {
	message: string;
	signature: `0x${string}`;
	expectedNonce: string;
	domain: string;
}): Promise<{ address: Address } | { error: string }> {
	const fields = parseSiweMessage(params.message);
	if (!fields.address) return { error: 'malformed message' };
	if (fields.nonce !== params.expectedNonce) return { error: 'nonce mismatch' };

	const valid = validateSiweMessage({
		message: fields,
		domain: params.domain,
		nonce: params.expectedNonce
	});
	if (!valid) return { error: 'invalid message (domain/time)' };

	const recovered = await recoverMessageAddress({
		message: params.message,
		signature: params.signature
	});
	if (recovered.toLowerCase() !== fields.address.toLowerCase()) {
		return { error: 'signature mismatch' };
	}
	return { address: fields.address };
}

import { test, expect } from 'bun:test';
import { issueNonce } from './luma';

test('issueNonce has the expected prefix and is random', () => {
	const a = issueNonce();
	expect(a.startsWith('ethjkt-verify-')).toBe(true);
	expect(a).not.toBe(issueNonce());
});

test('nonce substring match against a sample bio', () => {
	const nonce = 'ethjkt-verify-deadbeef';
	const bio = `web3 builder from jakarta. verifying: ${nonce} — see you at the meetup`;
	expect(bio.includes(nonce)).toBe(true);
	expect(bio.includes('ethjkt-verify-cafe')).toBe(false);
});

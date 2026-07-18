import { expect, test } from 'bun:test';
import { bioContainsNonce, issueNonce } from './instagram';

test('matches nonce embedded in bio, case-insensitive', () => {
	const nonce = issueNonce();
	expect(bioContainsNonce(`web3 dev | ${nonce} | gm`, nonce)).toBe(true);
	expect(bioContainsNonce(`WEB3 ${nonce.toUpperCase()}`, nonce)).toBe(true);
});

test('rejects when nonce absent', () => {
	expect(bioContainsNonce('just a normal bio', issueNonce())).toBe(false);
});

test('tolerates surrounding whitespace on the nonce', () => {
	const nonce = issueNonce();
	expect(bioContainsNonce(`bio ${nonce}`, `  ${nonce}  `)).toBe(true);
});

test('issueNonce is unique per call', () => {
	expect(issueNonce()).not.toBe(issueNonce());
});

import { describe, expect, test } from 'bun:test';
import { friendlyMessage, readError } from './errors';

describe('friendlyMessage', () => {
	test('maps known server messages to actionable copy', () => {
		expect(friendlyMessage('nonce not found in lu.ma bio')).toContain('Lu.ma bio');
		expect(friendlyMessage('sign in first')).toBe(
			'Your session has expired. Sign in again to continue.'
		);
	});

	test('names the missing providers', () => {
		expect(friendlyMessage('link required accounts: discord, x')).toBe(
			'Link Discord, X in your Hub to claim.'
		);
	});

	test('recognises wallet rejections', () => {
		expect(friendlyMessage('User rejected the request.')).toMatch(/cancelled/);
	});

	test('cleans up unknown messages and hides HTML/empty bodies', () => {
		expect(friendlyMessage('this lu.ma account is already linked')).toBe(
			'This lu.ma account is already linked.'
		);
		expect(friendlyMessage('<!doctype html>', 'Fallback.')).toBe('Fallback.');
		expect(friendlyMessage('   ', 'Fallback.')).toBe('Fallback.');
	});
});

describe('readError', () => {
	test('reads SvelteKit JSON error bodies', async () => {
		const res = new Response(JSON.stringify({ message: 'username required' }), { status: 400 });
		expect(await readError(res)).toBe('Enter your username first.');
	});

	test('reads plain-text bodies', async () => {
		expect(await readError(new Response('daily IP limit reached', { status: 429 }))).toMatch(
			/claim limit/
		);
	});
});

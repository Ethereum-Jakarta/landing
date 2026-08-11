// Self-check for errorMessage(). No test runner in this project — run it directly:
//   bun src/lib/client/http.check.ts
import assert from 'node:assert/strict';
import { errorMessage } from './http';

const res = (body: string) => new Response(body, { status: 400 });

// SvelteKit's error() envelope must be unwrapped, not shown raw.
assert.equal(
	await errorMessage(res('{"message":"nonce not found in your bio"}')),
	'nonce not found in your bio'
);
// Plain-text bodies pass through.
assert.equal(await errorMessage(res('username required')), 'username required');
// JSON without a message field stays readable rather than becoming "undefined".
assert.equal(await errorMessage(res('{"code":42}')), '{"code":42}');
// Empty body falls back.
assert.equal(await errorMessage(res(''), 'Sign in failed'), 'Sign in failed');

console.log('http.check.ts: all assertions passed');

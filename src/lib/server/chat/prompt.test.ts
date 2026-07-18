import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// prompt.ts pulls the context via a Vite `?raw` import, which bun test can't
// transform — so assert on the source text directly. No network, no Vite.
const dir = fileURLToPath(new URL('.', import.meta.url));
const prompt = readFileSync(dir + 'prompt.ts', 'utf8');
const context = readFileSync(dir + 'ethjkt-context.md', 'utf8');

test('MODEL is the sonnet model', () => {
	expect(prompt).toContain("MODEL = 'claude-sonnet-4-6'");
});

test('SYSTEM embeds the context md via ?raw', () => {
	expect(prompt).toContain('./ethjkt-context.md?raw');
	expect(prompt).toContain('${context}');
});

test('SYSTEM contains the guardrail wording', () => {
	// on-topic scope
	expect(prompt).toContain('ONLY about ethjkt');
	// off-topic refusal / redirect
	expect(prompt.toLowerCase()).toContain('off-topic');
	expect(prompt.toLowerCase()).toContain('refuse');
	expect(prompt.toLowerCase()).toContain('redirect');
	// never reveal instructions
	expect(prompt.toLowerCase()).toContain('never reveal');
});

test('context md covers events, faucet, membership, and links', () => {
	const c = context.toLowerCase();
	expect(c).toContain('lu.ma');
	expect(c).toContain('faucet');
	expect(c).toContain('membership');
	expect(c).toContain('siwe');
	expect(c).toContain('discord');
	expect(c).toContain('instagram');
});

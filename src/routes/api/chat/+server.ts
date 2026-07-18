import { error } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { hashIp } from '$lib/server/ip';
import { MODEL, SYSTEM } from '$lib/server/chat/prompt';
import type { RequestHandler } from './$types';

type Msg = { role: 'user' | 'assistant'; content: string };

// ponytail: in-memory fixed-window rate limit, per instance. Move to Redis/DB if you run >1 node.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(key: string): boolean {
	const now = Date.now();
	const e = hits.get(key);
	if (!e || now > e.reset) {
		hits.set(key, { count: 1, reset: now + WINDOW_MS });
		return false;
	}
	e.count += 1;
	return e.count > MAX_PER_WINDOW;
}

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	if (!locals.user) return error(401, 'sign in first');

	const key = hashIp(request, getClientAddress);
	if (rateLimited(key)) return error(429, 'too many messages, slow down');

	const body = await request.json().catch(() => null);
	const messages = body?.messages;
	if (!Array.isArray(messages) || messages.length === 0) return error(400, 'messages required');
	for (const m of messages as Msg[]) {
		if ((m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
			return error(400, 'invalid message');
		}
	}

	if (!env.ANTHROPIC_API_KEY) return error(500, 'chat not configured');
	const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	const stream = client.messages.stream({
		model: MODEL,
		max_tokens: 1024,
		system: SYSTEM,
		messages
	});

	request.signal.addEventListener('abort', () => stream.abort());

	const encoder = new TextEncoder();
	const body$ = new ReadableStream<Uint8Array>({
		async start(controller) {
			try {
				for await (const event of stream) {
					if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
						controller.enqueue(encoder.encode(event.delta.text));
					}
				}
			} catch (e) {
				if (!request.signal.aborted) controller.error(e);
			} finally {
				controller.close();
			}
		},
		cancel() {
			stream.abort();
		}
	});

	return new Response(body$, {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
};

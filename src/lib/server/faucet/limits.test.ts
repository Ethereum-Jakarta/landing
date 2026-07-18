import { test, expect } from 'bun:test';
import { startOfUtcDay } from './limits';

test('startOfUtcDay zeroes the time to UTC midnight', () => {
	const d = new Date('2026-07-17T13:45:30.123Z');
	const s = startOfUtcDay(d);
	expect(s.toISOString()).toBe('2026-07-17T00:00:00.000Z');
});

test('same UTC day buckets to the same instant', () => {
	const morning = startOfUtcDay(new Date('2026-07-17T00:00:01Z'));
	const night = startOfUtcDay(new Date('2026-07-17T23:59:59Z'));
	expect(morning.getTime()).toBe(night.getTime());
});

test('different UTC days bucket apart, crossing UTC midnight not local', () => {
	// 2026-07-17T23:00Z and 2026-07-18T01:00Z are different UTC days
	const a = startOfUtcDay(new Date('2026-07-17T23:00:00Z'));
	const b = startOfUtcDay(new Date('2026-07-18T01:00:00Z'));
	expect(b.getTime() - a.getTime()).toBe(86_400_000);
});

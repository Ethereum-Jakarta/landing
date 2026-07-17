// Lu.ma integration via its public (unauthenticated) profile API.
// Endpoint: GET https://api.lu.ma/user/profile/events-hosting?user_api_id=<usr>&period=future|past&pagination_limit=<n>
// Lists every event the host ran across all their calendars. Returns
// { entries: [{ event, guest_count, ticket_info, featured_guests, ... }], has_more }.
// No API key / Plus plan / login required.
import { LUMA_HOST_USER_ID } from '$lib/constants';

const API = 'https://api.lu.ma';

export interface EventGuest {
	name: string;
	avatarUrl: string | null;
}

export interface LumaEvent {
	id: string;
	name: string;
	url: string; // public event page
	coverUrl: string | null;
	startAt: string; // ISO 8601 (UTC)
	endAt: string | null;
	timezone: string; // IANA, e.g. "Asia/Jakarta"
	location: string | null; // city, or "Online"
	guestCount: number | null;
	guests: EventGuest[]; // public sample (~10), only when host shows the list
	isFree: boolean;
	isSoldOut: boolean;
}

// Raw shape (only the fields we use) of one calendar entry.
interface RawEntry {
	guest_count?: number | null;
	ticket_info?: { is_free?: boolean; is_sold_out?: boolean } | null;
	featured_guests?: { name?: string | null; avatar_url?: string | null }[] | null;
	event: {
		api_id: string;
		name: string;
		url: string; // slug
		cover_url?: string | null;
		start_at: string;
		end_at?: string | null;
		timezone?: string | null;
		location_type?: string | null;
		geo_address_info?: { city?: string | null; city_state?: string | null } | null;
	};
}

function normalize(entry: RawEntry): LumaEvent {
	const ev = entry.event;
	const geo = ev.geo_address_info;
	return {
		id: ev.api_id,
		name: ev.name,
		url: `https://luma.com/${ev.url}`,
		coverUrl: ev.cover_url ?? null,
		startAt: ev.start_at,
		endAt: ev.end_at ?? null,
		timezone: ev.timezone ?? 'Asia/Jakarta',
		location: ev.location_type === 'online' ? 'Online' : (geo?.city_state ?? geo?.city ?? null),
		guestCount: entry.guest_count ?? null,
		guests: (entry.featured_guests ?? [])
			.slice(0, 5)
			.map((g) => ({ name: g.name ?? '', avatarUrl: g.avatar_url ?? null })),
		isFree: entry.ticket_info?.is_free ?? false,
		isSoldOut: entry.ticket_info?.is_sold_out ?? false
	};
}

async function fetchPeriod(
	fetchFn: typeof fetch,
	period: 'future' | 'past',
	limit: number
): Promise<LumaEvent[]> {
	const url = `${API}/user/profile/events-hosting?user_api_id=${LUMA_HOST_USER_ID}&period=${period}&pagination_limit=${limit}`;
	const res = await fetchFn(url, { headers: { accept: 'application/json' } });
	if (!res.ok) throw new Error(`Lu.ma ${period} request failed: ${res.status}`);
	const data = (await res.json()) as { entries?: RawEntry[] };
	return (data.entries ?? []).map(normalize);
}

// Upcoming events, plus recent past ones as a fallback (the calendar is often empty of future events).
export async function getCalendarEvents(
	fetchFn: typeof fetch
): Promise<{ upcoming: LumaEvent[]; past: LumaEvent[]; failed: boolean }> {
	try {
		const [upcoming, past] = await Promise.all([
			fetchPeriod(fetchFn, 'future', 50),
			fetchPeriod(fetchFn, 'past', 50)
		]);
		return { upcoming, past, failed: false };
	} catch {
		return { upcoming: [], past: [], failed: true };
	}
}

export function formatEventDate(startAt: string, timezone: string): string {
	return new Intl.DateTimeFormat('en-GB', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short',
		timeZone: timezone
	}).format(new Date(startAt));
}

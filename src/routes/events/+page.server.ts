import type { PageServerLoad } from './$types';
import { getCalendarEvents } from '$lib/features/events/luma';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const events = await getCalendarEvents(fetch);
	// Cache at the edge for 5 min; events don't change minute-to-minute.
	setHeaders({ 'cache-control': 'public, max-age=300' });
	return events;
};

import type { PageServerLoad } from './$types';
import { getCalendarEvents } from '$lib/features/events/luma';

export const load: PageServerLoad = async ({ fetch }) => ({
	// Not awaited: streamed in so a slow Lu.ma response never blocks the hero.
	events: getCalendarEvents(fetch, 6)
});

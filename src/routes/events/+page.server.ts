import type { PageServerLoad } from './$types';
import { getCalendarEvents } from '$lib/features/events/luma';

// No public cache header: the page header is per-user. Lu.ma calls are cached in luma.ts.
export const load: PageServerLoad = async ({ fetch }) => getCalendarEvents(fetch);

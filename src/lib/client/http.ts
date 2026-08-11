/**
 * Pull a human-readable message out of a failed response.
 * SvelteKit's `error()` replies to fetch callers with `{"message":"…"}`, so reading
 * the body as text leaks the raw JSON envelope into the UI. Plain-text bodies still work.
 */
export async function errorMessage(
	res: Response,
	fallback = 'Something went wrong'
): Promise<string> {
	const body = await res.text().catch(() => '');
	if (!body) return fallback;
	try {
		const parsed = JSON.parse(body);
		return typeof parsed?.message === 'string' ? parsed.message : body;
	} catch {
		return body;
	}
}

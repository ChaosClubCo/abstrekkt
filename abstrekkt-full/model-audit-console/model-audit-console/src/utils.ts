/**
 * Models sometimes wrap JSON in ```json fences despite being told not to.
 * Strip fences before parsing, and fail loudly (with the raw text) rather
 * than silently returning an empty result - a silent [] here would look
 * identical to "no findings", which is the wrong failure mode for an
 * audit tool.
 */
export function safeParseJSON<T>(raw: string): T {
  const stripped = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(stripped) as T;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to parse model output as JSON (${reason}). Raw output (first 300 chars): ${stripped.slice(0, 300)}`
    );
  }
}

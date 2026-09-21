export default async (req: Request): Promise<Response> => {
  // Reset usage counters daily via cron (use Supabase scheduled functions).
  return new Response(JSON.stringify({ ok: true }));
};

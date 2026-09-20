export default async (req: Request): Promise<Response> => {
  // Compose weekly digest email + Slack summary.
  return new Response(JSON.stringify({ ok: true }));
};

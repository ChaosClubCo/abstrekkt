export default async (_req: Request): Promise<Response> => {
  // TODO: Query metrics, send via Resend + Slack
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
};

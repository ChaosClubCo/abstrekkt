import { NextRequest } from "next/server";
import { checkEntitlement, consumeEntitlement } from "@/lib/entitlements";
import { tooManyRequests } from "@/lib/http";
import { withTrace } from "@/lib/otel";
import OpenAI from "openai";
import { getServerSession } from "@/lib/auth";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  return withTrace("ai.summarize", async () => {
    const session = await getServerSession();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const op = "ai.summarize";
    const cost = 1;
    const { allowed } = await checkEntitlement(session.user.id, op, cost);
    if (!allowed) {
      const now = new Date();
      const untilMidnight = 86400 - (now.getUTCHours()*3600 + now.getUTCMinutes()*60 + now.getUTCSeconds());
      return tooManyRequests(untilMidnight, "Daily quota reached");
    }

    const dedupeKey = req.headers.get("x-idempotency-key") ?? undefined;
    await consumeEntitlement(session.user.id, op, cost, dedupeKey);

    const body = await req.json();
    const input: string = body?.text ?? "";
    if (!input) return new Response(JSON.stringify({ error: "text required" }), { status: 400 });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Summarize:\n${input}` }],
      temperature: 0.2,
    });

    return new Response(JSON.stringify({ summary: completion.choices[0]?.message?.content ?? "" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
}

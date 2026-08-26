import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const sb = supabaseAdmin();
  const eventKey = event.id;
  const { error: dedupeErr } = await sb
    .from("dedupe_keys")
    .insert({ key: eventKey, purpose: "stripe_webhook", metadata: { type: event.type } })
    .select()
    .single();
  if (dedupeErr && dedupeErr.message?.includes("duplicate key")) {
    return NextResponse.json({ ok: true, deduped: true });
  } else if (dedupeErr) {
    return new NextResponse(`DB Error: ${dedupeErr.message}`, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (userId) {
          const { error } = await sb.from("user_entitlements").upsert({ user_id: userId, plan: "pro", ai_daily_quota: 250 }).eq("user_id", userId);
          if (error) throw error;
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = (sub.metadata as any)?.user_id;
        if (userId) {
          const { error } = await sb.from("user_entitlements").upsert({ user_id: userId, plan: "free", ai_daily_quota: 25 }).eq("user_id", userId);
          if (error) throw error;
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(`Handle Error: ${e.message}`, { status: 500 });
  }
}

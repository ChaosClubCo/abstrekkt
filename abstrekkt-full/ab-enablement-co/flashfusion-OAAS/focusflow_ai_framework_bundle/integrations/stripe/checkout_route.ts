import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const { priceId, userId, successUrl, cancelUrl } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId || process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=1`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=1`,
    client_reference_id: userId,
  });
  return new Response(JSON.stringify({ id: session.id, url: session.url }), { status: 200 });
}

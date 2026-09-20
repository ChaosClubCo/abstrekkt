'use server';

import { headers, cookies } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().default('next_site'),
  plan: z.string().optional(),
});

export type LeadResult =
  | { ok: true; message: string; track: { source: string; plan: string } }
  | { ok: false; error: string; message: string };

export async function submitLead(formData: FormData): Promise<LeadResult> {
  try {
    const parsed = leadSchema.safeParse({
      email: formData.get('email'),
      source: formData.get('source'),
      plan: formData.get('plan'),
    });

    if (!parsed.success) {
      return { ok: false, error: 'invalid', message: parsed.error.errors[0]?.message || 'Invalid form data' };
    }
    const data = parsed.data;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return { ok: false, error: 'config', message: 'Server configuration error' };
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const headersList = await headers();
    const userAgent = headersList.get('user-agent') ?? '';
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0]?.trim() : null;

    const { error: dbError } = await supabase.from('leads').insert({
      email: data.email,
      source: data.source,
      plan: data.plan || 'free',
      ua: userAgent,
      ip,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      if (dbError.code === '23505') {
        return { ok: false, error: 'duplicate', message: 'This email is already on the waitlist' };
      }
      console.error('Database error:', dbError);
      return { ok: false, error: 'db', message: 'Failed to save your information. Please try again.' };
    }

    const cookieStore = await cookies();
    cookieStore.set('lead_submitted', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });

    // NOTE: analytics must fire on the CLIENT — `window` never exists in a server
    // action. Return the payload and let the form component send the gtag event.
    return {
      ok: true,
      message: 'Successfully joined the waitlist! Check your email for confirmation.',
      track: { source: data.source, plan: data.plan || 'free' },
    };
  } catch (error) {
    console.error('Unexpected error in submitLead:', error);
    return { ok: false, error: 'unknown', message: 'An unexpected error occurred. Please try again.' };
  }
}

/*
 * Client component that consumes the result and fires analytics:
 *
 *   'use client';
 *   const onSubmit = async (fd: FormData) => {
 *     const res = await submitLead(fd);
 *     if (res.ok && typeof window !== 'undefined' && (window as any).gtag) {
 *       (window as any).gtag('event', 'lead_submit', res.track);
 *     }
 *     setMessage(res.message);
 *   };
 */

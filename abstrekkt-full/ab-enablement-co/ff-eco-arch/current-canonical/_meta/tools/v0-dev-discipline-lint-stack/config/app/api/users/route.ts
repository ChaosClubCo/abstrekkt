import { NextResponse } from 'next/server';

import { UsersPageSchema } from '@/lib/schema';

export const dynamic = 'force-dynamic';

/**
 * Example route handler. The I/O edge — upstream JSON is `unknown` until
 * UsersPageSchema validates it. Never trust raw external data.
 *
 * Requires env var USER_SERVICE_URL (see .env.example). Delete this file
 * if you do not have a users service.
 */
export async function GET(): Promise<NextResponse> {
  const url = `${process.env.USER_SERVICE_URL ?? ''}/users`;
  const res = await fetch(url);
  const data: unknown = await res.json();
  const validated = UsersPageSchema.parse(data); // validate at the boundary
  return NextResponse.json(validated);
}

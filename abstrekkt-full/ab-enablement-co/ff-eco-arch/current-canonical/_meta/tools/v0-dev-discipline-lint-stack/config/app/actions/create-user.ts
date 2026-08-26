'use server';

import { CreateUserInput, parseOrThrow, UserSchema } from '@/lib/schema';

/**
 * Example server action. Validates BOTH the incoming FormData (input) and the
 * upstream response (output) with Zod. Pair with `useActionState` on the client.
 *
 * Requires env var USER_SERVICE_URL (see .env.example).
 */
export async function createUser(_prevState: unknown, formData: FormData): Promise<unknown> {
  const input = parseOrThrow(
    CreateUserInput,
    { email: formData.get('email'), name: formData.get('name') },
    'Invalid user input',
  );

  const res = await fetch(`${process.env.USER_SERVICE_URL ?? ''}/users`, {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { 'content-type': 'application/json' },
  });

  const created: unknown = await res.json();
  return parseOrThrow(UserSchema, created, 'Invalid user response');
}

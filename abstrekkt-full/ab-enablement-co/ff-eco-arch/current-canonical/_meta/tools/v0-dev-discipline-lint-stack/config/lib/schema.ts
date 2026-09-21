/**
 * Central Zod primitives & helpers for strict runtime validation.
 *
 * Design rules carried from the v0.app discipline guide:
 *  - No `any`. Unknown inputs are validated here before use.
 *  - Treat null/undefined as errors unless explicitly allowed.
 *  - Validation lives only at I/O edges (fetch/json/formData/searchParams/env);
 *    interior layers consume already-typed data with zero extra overhead.
 *
 * Split larger apps into `lib/schema/<feature>.ts` and re-export from here.
 */
import { z } from 'zod';

/* -------------------------- Base primitives -------------------------- */

export const Id = z.string().min(1, 'id is required');

export const ISODate = z.string().datetime({ offset: true }).brand<'ISODate'>();

export const NonEmptyString = z.string().min(1);

export const PositiveInt = z.number().int().positive();

/* Safer boolean/number coercion when parsing query/form data (strings in) */
export const CoerceBoolean = z.coerce.boolean();
export const CoerceNumber = z.coerce.number();

/* Common error envelope for API boundaries */
export const ApiErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/* -------------------------- Example domain schemas -------------------------- */

export const UserSchema = z.object({
  id: Id,
  email: z.string().email(),
  name: NonEmptyString.optional(),
  createdAt: ISODate,
});
export type User = z.infer<typeof UserSchema>;

/** Generic paginated list response */
export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().nonnegative(),
    nextCursor: z.string().optional(),
  });

/* -------------------------- Guards & helpers -------------------------- */

/** Exhaustiveness guard for discriminated unions (compile-time + runtime). */
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${String(value)}`);
};

type ZodSchema<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

/**
 * Validate an unknown input against a schema and return typed output or throw.
 * Prefer throw-first on boundary crossing to keep interior code clean.
 */
export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown, errMsg?: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(errMsg !== undefined ? `${errMsg}: ${issues}` : issues);
  }
  return result.data;
}

/** Safe-parse wrapper for when you want a result object (e.g. UI error surfaces). */
export function safeParse<T>(schema: ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}

/* -------------------------- Fetch + validate -------------------------- */

export type FetcherOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** Optional schema to validate the successful JSON response. */
  schema?: ZodSchema<unknown>;
  /** Optional schema for error JSON bodies (defaults to ApiErrorSchema). */
  errorSchema?: ZodSchema<unknown>;
};

/**
 * zFetch:
 *  - performs fetch
 *  - reads JSON as `unknown`
 *  - validates with the provided Zod schema(s)
 *  - throws typed errors for non-2xx responses or schema mismatch
 *
 * Never surfaces raw upstream error bodies; normalizes through errorSchema.
 */
export async function zFetch<TOut>(
  input: RequestInfo | URL,
  opts: FetcherOptions & { schema: ZodSchema<TOut>; errorSchema?: ZodSchema<ApiError> },
): Promise<TOut> {
  const { schema, errorSchema = ApiErrorSchema, headers, body, ...init } = opts;

  const finalHeaders = new Headers(headers ?? {});
  if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  const res = await fetch(input, {
    ...init,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    // Try to decode a structured API error first.
    if (isJson) {
      const errJson: unknown = await res.json();
      const apiErr = safeParse(errorSchema, errJson);
      if (apiErr.success) {
        const parsed = apiErr.data as ApiError;
        throw new Error(`[${parsed.code}] ${parsed.message}`);
      }
    }
    // Fallback: raw text (never rendered directly to end users).
    const text = isJson ? 'Invalid error JSON' : await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  if (!isJson) {
    throw new Error('Expected JSON response');
  }

  const jsonUnknown: unknown = await res.json();
  return parseOrThrow(schema, jsonUnknown, 'Response validation failed');
}

/* -------------------------- Example usage patterns -------------------------- */

/** GET /api/users -> { items: User[], total: number, nextCursor?: string } */
export const UsersPageSchema = PaginatedSchema(UserSchema);
export type UsersPage = z.infer<typeof UsersPageSchema>;

// Usage from a Server Component / server action:
//
//   const data = await zFetch('/api/users', { method: 'GET', schema: UsersPageSchema });
//
// `data` is now both typed AND validated at runtime.

/* -------------------------- Form & query helpers -------------------------- */

/** Example query schema (e.g. reading from searchParams). */
export const UsersQuerySchema = z.object({
  q: NonEmptyString.optional(),
  limit: CoerceNumber.default(20).pipe(z.number().int().positive().max(100)),
  cursor: z.string().optional(),
});
export type UsersQuery = z.infer<typeof UsersQuerySchema>;

/** Example mutation input (e.g. server action). */
export const CreateUserInput = z.object({
  email: z.string().email(),
  name: NonEmptyString,
});
export type CreateUserInputT = z.infer<typeof CreateUserInput>;

/* -------------------------- Enums -> union literals -------------------------- */

/**
 * Prefer `as const` maps + derived unions over TS `enum`
 * (better dead-code elimination and narrowing). Enforced by ESLint
 * `no-restricted-syntax` on TSEnumDeclaration.
 */
export const ROLE = { Admin: 'admin', User: 'user' } as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

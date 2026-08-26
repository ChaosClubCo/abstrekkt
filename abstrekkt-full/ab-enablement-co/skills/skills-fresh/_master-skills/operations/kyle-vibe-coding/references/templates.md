# Templates Reference — Kyle Vibe Coding

## src/lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Missing Supabase env vars — check .env');
export const supabase = createClient(url, key);
```

## src/lib/posthog.ts
```typescript
import posthog from 'posthog-js';
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
  capture_pageview: true,
});
export { posthog };
```

## src/App.tsx (Auth-Aware Entry)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, s) => setSession(s)
    );
    return () => subscription.unsubscribe();
  }, []);
  if (!session) return <AuthPage />;
  return <Dashboard session={session} />;
}
```

---

## RLS Pattern (Apply to Every Table)
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_own"
  ON your_table FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own"
  ON your_table FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own"
  ON your_table FOR UPDATE USING (auth.uid() = user_id);

-- Always verify: EXPLAIN SELECT * FROM your_table;
-- Confirm: "Filter: (auth.uid() = user_id)" appears in query plan
```

---

## .env.example
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_POSTHOG_KEY=your_posthog_key_here
VITE_APP_URL=http://localhost:5173
# NEVER put real values here — copy to .env and fill locally
# NEVER commit .env
```

---

## Architecture: Internal Admin Tool (Intinc)
```
src/
  pages/
    Dashboard.tsx        — main view
    ItemDetail.tsx       — single record
  components/
    DataTable.tsx        — sortable, filterable table
    StatusBadge.tsx      — reusable status chip
    ErrorBoundary.tsx    — wrap every route with this
  lib/
    supabase.ts          — client (from template above)
    queries.ts           — ALL Supabase queries here, never inline
    posthog.ts           — analytics (from template above)
```

## Architecture: SaaS MVP
```
src/
  pages/
    Landing.tsx          — public marketing
    Auth.tsx             — login + signup
    Dashboard.tsx        — authenticated home
    Settings.tsx         — user + billing
  lib/
    supabase.ts
    stripe.ts            — publishable key ONLY, never secret
    posthog.ts
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Supabase auth not persisting across refresh | Wrap app in `<SessionContextProvider>` from `@supabase/auth-helpers-react` |
| RLS returns empty with no error | `auth.uid()` is null — session not established, or policy wrong. Check EXPLAIN. |
| `VITE_` env var is undefined | Must have `VITE_` prefix for Vite to expose to client bundle |
| Cloudflare Worker fails with Node.js error | Workers don't support Node built-ins — use fetch-based APIs only |
| PostHog not capturing events | Confirm `posthog.init()` runs before any `posthog.capture()` call |
| `@supabase/auth-helpers-react` deprecation warning | Check supabase.com/docs — may need to migrate to `@supabase/ssr` |

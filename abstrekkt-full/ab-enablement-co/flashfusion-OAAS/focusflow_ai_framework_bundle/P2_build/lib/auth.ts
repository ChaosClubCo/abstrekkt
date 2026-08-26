// Placeholder - integrate your auth; Supabase Auth recommended.
export async function getServerSession() {
  // In real app, read session from Supabase server-side helpers.
  return { user: { id: "00000000-0000-0000-0000-000000000000" } };
}

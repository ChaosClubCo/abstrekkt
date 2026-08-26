export default function Dashboard() {
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="mt-4 grid gap-4">
        <div className="rounded-lg border p-4">Usage</div>
        <div className="rounded-lg border p-4">Plan</div>
      </div>
    </main>
  );
}

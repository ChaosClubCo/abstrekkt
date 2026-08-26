export function UsageMeter({ used=0, quota=25 }: { used?: number; quota?: number; }) {
  const pct = Math.min(100, Math.round((used / Math.max(1, quota)) * 100));
  return <div className="w-full"><div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-green-600 rounded" style={{width: pct + "%"}} /></div><p className="text-xs mt-1">{used}/{quota}</p></div>;
}

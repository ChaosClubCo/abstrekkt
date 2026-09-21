import React from 'react';
import { useCacheStats, useCacheInvalidation } from '../hooks';

export function CacheStatsPanel() {
  const { stats, isLoading, refetch } = useCacheStats();
  const { flush } = useCacheInvalidation();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Unable to load cache statistics</p>
      </div>
    );
  }

  const hitRateColor = stats.hitRate > 0.8 ? 'text-green-600' : stats.hitRate > 0.5 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Cache Statistics</h3>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to flush the entire cache?')) {
                flush().then(refetch);
              }
            }}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
          >
            Flush Cache
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Hit Rate</p>
          <p className={`text-2xl font-bold ${hitRateColor}`}>
            {(stats.hitRate * 100).toFixed(1)}%
          </p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Cache Hits</p>
          <p className="text-2xl font-bold text-gray-900">{stats.hits.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Cache Misses</p>
          <p className="text-2xl font-bold text-gray-900">{stats.misses.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Keys Stored</p>
          <p className="text-2xl font-bold text-gray-900">{stats.size.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Memory Usage</p>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold text-gray-900">
            {(stats.memoryUsage / 1024 / 1024).toFixed(2)} MB
          </p>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min((stats.memoryUsage / (100 * 1024 * 1024)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

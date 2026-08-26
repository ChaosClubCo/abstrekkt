import { useState } from 'react';
import { useAuditLogs, useExportAuditLogs } from '../hooks';
import { formatAction, getActionColor, formatRelativeTime } from '../utils';
import type { AuditLogSearchParams, AuditLogEntry, ExportFormat } from '../types';

interface AuditLogViewerProps {
  tenantId: string;
  userId?: string;
  className?: string;
}

export function AuditLogViewer({ tenantId, userId, className }: AuditLogViewerProps) {
  const [params, setParams] = useState<AuditLogSearchParams>({
    tenantId,
    userId,
    page: 1,
    pageSize: 25,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const { data, isLoading, error } = useAuditLogs(params);
  const { exportLogs, isExporting } = useExportAuditLogs();

  const handleExport = async (format: ExportFormat) => {
    await exportLogs(params, format);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Failed to load audit logs: {error.message}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Activity Log</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
        />
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-lg"
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              startDate: e.target.value ? new Date(e.target.value) : undefined,
              page: 1,
            }))
          }
        />
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-lg"
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              endDate: e.target.value ? new Date(e.target.value) : undefined,
              page: 1,
            }))
          }
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.data.map((entry) => (
                  <AuditLogRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {(data.meta.page - 1) * data.meta.pageSize + 1} to{' '}
                {Math.min(data.meta.page * data.meta.pageSize, data.meta.total)} of{' '}
                {data.meta.total} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(data.meta.page - 1)}
                  disabled={data.meta.page === 1}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(data.meta.page + 1)}
                  disabled={data.meta.page >= data.meta.totalPages}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const actionColor = getActionColor(entry.action);

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded bg-${actionColor}-100 text-${actionColor}-800`}
          >
            {formatAction(entry.action)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-gray-900">
          {entry.resource}
          {entry.resourceId && (
            <span className="text-gray-500 ml-1">({entry.resourceId})</span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {entry.userId || 'System'}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {entry.ipAddress || '-'}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatRelativeTime(new Date(entry.timestamp))}
        </td>
      </tr>
      {expanded && Object.keys(entry.metadata).length > 0 && (
        <tr>
          <td colSpan={5} className="px-4 py-3 bg-gray-50">
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(entry.metadata, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

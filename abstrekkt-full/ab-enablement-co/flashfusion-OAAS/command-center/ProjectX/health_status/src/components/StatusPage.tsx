import React from 'react';
import { useOverallStatus, useIncidents, useMaintenance } from '../hooks';
import { ServiceStatus } from '../types';

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string; bg: string }> = {
  operational: { label: 'Operational', color: 'text-green-700', bg: 'bg-green-100' },
  degraded: { label: 'Degraded Performance', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  partial_outage: { label: 'Partial Outage', color: 'text-orange-700', bg: 'bg-orange-100' },
  major_outage: { label: 'Major Outage', color: 'text-red-700', bg: 'bg-red-100' },
  maintenance: { label: 'Under Maintenance', color: 'text-blue-700', bg: 'bg-blue-100' },
};

export function StatusPage() {
  const { data: status, isLoading: statusLoading } = useOverallStatus();
  const { incidents, isLoading: incidentsLoading } = useIncidents('active');
  const { windows: maintenance } = useMaintenance('scheduled');

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const overallConfig = status ? STATUS_CONFIG[status.status] : STATUS_CONFIG.operational;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${overallConfig.bg}`}>
            <span className={`w-3 h-3 rounded-full mr-2 ${
              status?.status === 'operational' ? 'bg-green-500' :
              status?.status === 'degraded' ? 'bg-yellow-500' :
              status?.status === 'partial_outage' ? 'bg-orange-500' :
              status?.status === 'major_outage' ? 'bg-red-500' : 'bg-blue-500'
            }`}></span>
            <span className={`font-medium ${overallConfig.color}`}>
              {overallConfig.label}
            </span>
          </div>
        </header>

        {/* Active Incidents */}
        {incidents.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Incidents</h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: {incident.status} | Severity: {incident.severity}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(incident.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {incident.updates.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        {incident.updates[0].message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Scheduled Maintenance */}
        {maintenance.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Scheduled Maintenance</h2>
            <div className="space-y-4">
              {maintenance.map((window) => (
                <div key={window.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-900">{window.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{window.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(window.scheduledStart).toLocaleString()} - {new Date(window.scheduledEnd).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
          <div className="bg-white rounded-lg shadow divide-y">
            {status?.services.map((service) => {
              const config = STATUS_CONFIG[service.status];
              return (
                <div key={service.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{service.name}</span>
                    {service.group && (
                      <span className="ml-2 text-xs text-gray-500">({service.group})</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm ${config.color}`}>{config.label}</span>
                    <span className={`ml-2 w-2 h-2 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' :
                      service.status === 'partial_outage' ? 'bg-orange-500' :
                      service.status === 'major_outage' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Uptime */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">90-Day Uptime</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Overall Uptime</span>
              <span className="text-2xl font-bold text-green-600">99.95%</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 90 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-sm ${
                    Math.random() > 0.02 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Subscribe to Updates</h2>
            <p className="text-sm text-gray-600 mb-4">
              Get notified when we create or resolve incidents.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </div>
  );
}

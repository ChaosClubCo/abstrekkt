import React from 'react';
import { useOverallStatus } from '../hooks';
import type { ServiceStatus } from '../types';

interface StatusBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string }> = {
  operational: { label: 'All Systems Operational', color: 'bg-green-500' },
  degraded: { label: 'Degraded Performance', color: 'bg-yellow-500' },
  partial_outage: { label: 'Partial Outage', color: 'bg-orange-500' },
  major_outage: { label: 'Major Outage', color: 'bg-red-500' },
  maintenance: { label: 'Under Maintenance', color: 'bg-blue-500' },
};

const SIZES = {
  sm: { dot: 'w-2 h-2', text: 'text-xs' },
  md: { dot: 'w-3 h-3', text: 'text-sm' },
  lg: { dot: 'w-4 h-4', text: 'text-base' },
};

export function StatusBadge({ size = 'md', showLabel = true, className = '' }: StatusBadgeProps) {
  const { data: status, isLoading } = useOverallStatus();

  if (isLoading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className={`${SIZES[size].dot} rounded-full bg-gray-300 animate-pulse`} />
        {showLabel && (
          <span className={`ml-2 ${SIZES[size].text} text-gray-400`}>Loading...</span>
        )}
      </div>
    );
  }

  const config = status ? STATUS_CONFIG[status.status] : STATUS_CONFIG.operational;
  const sizeConfig = SIZES[size];

  return (
    <a
      href="/status"
      className={`inline-flex items-center hover:opacity-80 transition-opacity ${className}`}
    >
      <span className={`${sizeConfig.dot} rounded-full ${config.color}`} />
      {showLabel && (
        <span className={`ml-2 ${sizeConfig.text} text-gray-700`}>{config.label}</span>
      )}
    </a>
  );
}

import React, { useState } from 'react';
import { useIPAccess, useGracePeriod, useMyIP } from '../hooks';

interface AccessDeniedProps {
  reason?: string;
  showRequestAccess?: boolean;
}

export function AccessDenied({ reason, showRequestAccess = true }: AccessDeniedProps) {
  const { geoLocation, ipAddress } = useIPAccess();
  const { data: myIP } = useMyIP();
  const { requestAccess, isRequesting } = useGracePeriod();
  const [requestReason, setRequestReason] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestAccess(requestReason);
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0-6v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          {reason || 'Your IP address is not allowed to access this application.'}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
          <p className="text-gray-500">
            <span className="font-medium">Your IP:</span>{' '}
            <code className="font-mono">{ipAddress || myIP?.ip}</code>
          </p>
          {geoLocation && (
            <>
              <p className="text-gray-500 mt-1">
                <span className="font-medium">Location:</span>{' '}
                {geoLocation.city && `${geoLocation.city}, `}
                {geoLocation.country}
              </p>
              {geoLocation.org && (
                <p className="text-gray-500 mt-1">
                  <span className="font-medium">Organization:</span> {geoLocation.org}
                </p>
              )}
            </>
          )}
        </div>

        {showRequestAccess && !submitted && (
          <>
            {showForm ? (
              <form onSubmit={handleRequest} className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why do you need access?
                  </label>
                  <textarea
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="I'm traveling for work and need temporary access..."
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isRequesting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isRequesting ? 'Requesting...' : 'Request Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Request Temporary Access
              </button>
            )}
          </>
        )}

        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700">
              Access request submitted. An administrator will review your request.
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  );
}

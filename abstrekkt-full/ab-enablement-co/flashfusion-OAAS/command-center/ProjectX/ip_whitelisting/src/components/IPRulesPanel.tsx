import React, { useState } from 'react';
import { useIPRules, useMyIP, useIPWhitelistConfig } from '../hooks';
import type { CreateRuleInput, RuleAction, RuleType } from '../types';

export function IPRulesPanel() {
  const { rules, isLoading, createRule, deleteRule, toggleRule, isCreating } = useIPRules();
  const { config, updateConfig } = useIPWhitelistConfig();
  const { data: myIP } = useMyIP();
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState<CreateRuleInput>({
    type: 'ip',
    value: '',
    action: 'allow',
    label: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRule(newRule);
    setNewRule({ type: 'ip', value: '', action: 'allow', label: '' });
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const allowRules = rules.filter((r) => r.action === 'allow' && r.enabled);
  const denyRules = rules.filter((r) => r.action === 'deny' && r.enabled);

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">IP Access Control</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config?.enabled ?? false}
              onChange={(e) => updateConfig({ enabled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Enabled</span>
          </label>
        </div>

        {myIP && (
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-blue-700">
              Your current IP: <code className="font-mono font-bold">{myIP.ip}</code>
              {myIP.geo?.country && (
                <span className="ml-2">
                  ({myIP.geo.city && `${myIP.geo.city}, `}{myIP.geo.country})
                </span>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
            <p className="text-sm text-gray-500">Total Rules</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{allowRules.length}</p>
            <p className="text-sm text-gray-500">Allow Rules</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{denyRules.length}</p>
            <p className="text-sm text-gray-500">Deny Rules</p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">IP Rules</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Rule
          </button>
        </div>

        {/* Add rule form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as RuleType })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="ip">IP/CIDR</option>
                  <option value="country">Country</option>
                  <option value="asn">ASN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                  placeholder={newRule.type === 'ip' ? '192.168.1.0/24' : newRule.type === 'country' ? 'US' : 'AS12345'}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value as RuleAction })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="allow">Allow</option>
                  <option value="deny">Deny</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={newRule.label || ''}
                  onChange={(e) => setNewRule({ ...newRule, label: e.target.value })}
                  placeholder="Office Network"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Adding...' : 'Add Rule'}
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
        )}

        {/* Rules list */}
        {rules.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No IP rules configured. Add rules to restrict access.
          </div>
        ) : (
          <div className="divide-y">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      rule.enabled
                        ? rule.action === 'allow'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                        {rule.value}
                      </code>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          rule.action === 'allow'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rule.action}
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {rule.type}
                      </span>
                    </div>
                    {rule.label && (
                      <p className="text-sm text-gray-500 mt-1">{rule.label}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id, !rule.enabled)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      rule.enabled
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this rule?')) {
                        deleteRule(rule.id);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

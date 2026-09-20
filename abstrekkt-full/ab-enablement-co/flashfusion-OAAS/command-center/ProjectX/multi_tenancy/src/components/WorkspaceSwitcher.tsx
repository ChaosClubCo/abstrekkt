import { useState } from 'react';
import { useWorkspaces } from '../hooks';
import type { Tenant } from '../types';

interface WorkspaceSwitcherProps {
  className?: string;
}

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const { workspaces, currentWorkspace, switchWorkspace, isLoading } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 h-10 w-48 rounded ${className}`} />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {currentWorkspace?.logoUrl ? (
          <img
            src={currentWorkspace.logoUrl}
            alt={currentWorkspace.name}
            className="w-6 h-6 rounded"
          />
        ) : (
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
            {currentWorkspace?.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="max-w-[120px] truncate">{currentWorkspace?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 py-1">
                Workspaces
              </div>
              {workspaces.map((workspace) => (
                <WorkspaceItem
                  key={workspace.id}
                  workspace={workspace}
                  isActive={workspace.id === currentWorkspace?.id}
                  onClick={() => {
                    switchWorkspace(workspace);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            <div className="border-t border-gray-200 p-2">
              <button
                onClick={() => {
                  // TODO: Open create workspace modal
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create workspace
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface WorkspaceItemProps {
  workspace: Tenant;
  isActive: boolean;
  onClick: () => void;
}

function WorkspaceItem({ workspace, isActive, onClick }: WorkspaceItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-2 py-2 text-sm rounded ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {workspace.logoUrl ? (
        <img
          src={workspace.logoUrl}
          alt={workspace.name}
          className="w-6 h-6 rounded"
        />
      ) : (
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-medium truncate">{workspace.name}</div>
        <div className="text-xs text-gray-500 capitalize">{workspace.plan} plan</div>
      </div>
      {isActive && (
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}

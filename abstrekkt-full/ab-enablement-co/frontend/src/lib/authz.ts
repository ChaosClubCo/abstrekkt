export type Role = 'owner' | 'admin' | 'operator' | 'analyst' | 'client_viewer' | 'agent_runtime' | 'auditor';
export type Permission =
  | 'lead:read'
  | 'lead:write'
  | 'audit:read'
  | 'audit:write'
  | 'artifact:approve'
  | 'agent:run'
  | 'settings:manage';

const matrix: Record<Role, Permission[]> = {
  owner: ['lead:read', 'lead:write', 'audit:read', 'audit:write', 'artifact:approve', 'agent:run', 'settings:manage'],
  admin: ['lead:read', 'lead:write', 'audit:read', 'audit:write', 'artifact:approve', 'agent:run'],
  operator: ['lead:read', 'lead:write', 'audit:read', 'audit:write', 'agent:run'],
  analyst: ['lead:read', 'audit:read', 'audit:write'],
  client_viewer: ['audit:read'],
  agent_runtime: ['audit:read', 'agent:run'],
  auditor: ['lead:read', 'audit:read', 'artifact:approve'],
};

export function can(role: Role, permission: Permission): boolean {
  return matrix[role]?.includes(permission) ?? false;
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new Error(`Forbidden: role ${role} lacks ${permission}`);
  }
}

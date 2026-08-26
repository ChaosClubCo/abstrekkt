export type Role = 'owner'|'admin'|'architect'|'contributor'|'reviewer'|'auditor'|'viewer';
const rolePermissions: Record<Role, Set<string>> = {
  owner: new Set(['*']), admin: new Set(['users.manage','project.create','sources.import','sources.view','artifacts.generate','validation.run','exports.create','audit.view']),
  architect: new Set(['project.create','sources.import','sources.view','facts.approve','adr.accept','artifacts.generate','validation.run','exports.create']),
  contributor: new Set(['sources.import','sources.view','artifacts.generate','validation.run']),
  reviewer: new Set(['sources.view','facts.approve','adr.accept','validation.run']),
  auditor: new Set(['sources.view','validation.run','audit.view']), viewer: new Set(['sources.view'])
};
export function can(role: Role, permission: string): boolean { const p = rolePermissions[role]; return p.has('*') || p.has(permission); }
export function requirePermission(role: Role, permission: string): void { if (!can(role, permission)) throw new Error(`Forbidden: missing ${permission}`); }

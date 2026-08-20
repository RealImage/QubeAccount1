import type { AuditEntry } from './types'

// Audit log per spec §11. Scoped to authorization events only — the default
// chosen for the open question in §8.5 (see CLAUDE.md "Open questions").
export const auditLog: AuditEntry[] = [
  {
    id: 'a-1',
    action: 'company_deactivated',
    actor: 'Peter Pan',
    companyId: 'c-warner',
    timestamp: '2026-08-20T06:10:00Z',
    summary: 'New company "Warner Bros." onboarded.',
  },
  {
    id: 'a-2',
    action: 'user_added_to_company',
    actor: 'Peter Pan',
    targetUser: 'Alice Smith',
    companyId: 'c-warner',
    timestamp: '2026-08-20T05:10:00Z',
    summary: 'User Alice Smith added to Warner Bros..',
  },
  {
    id: 'a-3',
    action: 'role_updated',
    actor: 'Nina Rao',
    serviceId: 'qw-exhibitor',
    timestamp: '2026-08-20T04:10:00Z',
    summary: 'Qube Wire Exhibitor service updated.',
  },
  {
    id: 'a-4',
    action: 'role_assigned',
    actor: 'System',
    timestamp: '2026-08-20T02:10:00Z',
    summary: 'System maintenance scheduled for tomorrow.',
  },
]

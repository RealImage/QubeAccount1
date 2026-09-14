import type { AuditEntry } from './types'

// Seed audit log per spec §11, expanded with the extra event types decided
// on top of the spec's baseline list: user_login / service_accessed (device
// + IP + region context) and password_reset_forced. The store appends real
// entries for every mutation from here on (see data/store.tsx) — this seed
// is just the log's starting history, including a few illustrative
// login/service-access rows to show the shape a real Entra/Descope event
// feed would eventually fill in (see the note on AuditEntry in types.ts).
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
  {
    id: 'a-5',
    action: 'user_login',
    actor: 'Alice Smith',
    targetUser: 'Alice Smith',
    companyId: 'c-warner',
    timestamp: '2026-08-20T01:42:00Z',
    summary: 'Alice Smith signed in.',
    ipAddress: '203.0.113.42',
    region: 'Burbank, CA, US',
    device: 'Chrome on macOS',
  },
  {
    id: 'a-6',
    action: 'service_accessed',
    actor: 'Bob Jones',
    targetUser: 'Bob Jones',
    companyId: 'c-a24',
    serviceId: 'icount',
    timestamp: '2026-08-19T22:05:00Z',
    summary: 'Bob Jones accessed iCount Exhibitor.',
    ipAddress: '198.51.100.17',
    region: 'New York, NY, US',
    device: 'Safari on iOS',
  },
  {
    id: 'a-7',
    action: 'user_login',
    actor: 'Charlie Williams',
    targetUser: 'Charlie Williams',
    companyId: 'c-a24',
    timestamp: '2026-08-19T20:58:00Z',
    summary: 'Charlie Williams signed in from a new device.',
    ipAddress: '198.51.100.88',
    region: 'New York, NY, US',
    device: 'Edge on Windows',
  },
  {
    id: 'a-8',
    action: 'password_reset_forced',
    actor: 'Nina Rao',
    targetUser: 'Quentin Garcia',
    companyId: 'c-warner',
    timestamp: '2026-08-19T14:30:00Z',
    summary: 'Nina Rao sent a password reset link to Quentin Garcia.',
  },
  {
    id: 'a-9',
    action: 'user_deactivated',
    actor: 'Peter Pan',
    targetUser: 'George White',
    companyId: 'c-warner',
    timestamp: '2026-08-18T09:15:00Z',
    summary: 'Peter Pan deactivated George White.',
  },
]

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuditEntry, Company, RoleAssignment, User } from './types'
import { companies as seedCompanies } from './companies'
import { users as seedUsers } from './users'
import { auditLog as seedAuditLog } from './audit'
import { services } from './services'
import { checkDomainForCompany, companiesAutoAddingDomain } from './domains'

export interface AddUserResult {
  ok: boolean
  reason?: string
}

export interface ImportUsersResult {
  created: number
  added: number
  skipped: number
  reasons: string[]
}

export interface ImportCompaniesResult {
  created: number
}

interface Store {
  companies: Company[]
  users: User[]
  auditLog: AuditEntry[]
  addCompany: (company: Company) => void
  updateCompany: (id: string, patch: Partial<Company>) => void
  importCompanies: (rows: Record<string, string>[]) => ImportCompaniesResult
  setCompanySubscriptions: (companyId: string, serviceIds: string[]) => void
  assignRole: (userId: string, companyId: string, assignment: RoleAssignment) => void
  removeRole: (userId: string, companyId: string, serviceId: string) => void
  invitePortalUser: (email: string, roleId: string) => void
  setUserActive: (userId: string, active: boolean) => void
  forcePasswordReset: (userId: string) => void
  addUserToCompany: (companyId: string, email: string, name: string) => AddUserResult
  importUsersToCompany: (companyId: string, rows: { email: string; name: string }[]) => ImportUsersResult
}

const INTERNAL_COMPANY_ID = 'c-qube-internal'
const COMPANY_MANAGEMENT_SERVICE_ID = 'company-management'

// The signed-in Portal User for this demo build — there's no real auth
// session yet (spec §8 hands that to Entra/Descope), so every admin action
// taken through the UI is attributed to this fixed actor. Matches the "N"
// header avatar and the pre-existing `updatedBy: 'Nina Rao'` convention.
export const CURRENT_ACTOR = 'Nina Rao'

function serviceLabel(serviceId: string) {
  return services.find((s) => s.id === serviceId)?.name ?? serviceId
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(seedAuditLog)

  // Always called with data read from the current render's `companies`/
  // `users`, never from inside a setState updater — StrictMode
  // double-invokes updaters in dev, which would otherwise double-log.
  function logAudit(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    setAuditLog((prev) => [{ ...entry, id: `a-${crypto.randomUUID()}`, timestamp: new Date().toISOString() }, ...prev])
  }

  const value = useMemo<Store>(
    () => ({
      companies,
      users,
      auditLog,

      addCompany: (company) => {
        setCompanies((prev) => [company, ...prev])
        logAudit({
          action: 'company_created',
          actor: CURRENT_ACTOR,
          companyId: company.id,
          summary: `${CURRENT_ACTOR} created company ${company.displayName}.`,
        })
      },

      updateCompany: (id, patch) => {
        const current = companies.find((c) => c.id === id)
        setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
        if (!current) return
        if (patch.status && patch.status !== current.status) {
          logAudit({
            action: patch.status === 'Inactive' ? 'company_deactivated' : 'company_reactivated',
            actor: CURRENT_ACTOR,
            companyId: id,
            summary: `${CURRENT_ACTOR} ${patch.status === 'Inactive' ? 'deactivated' : 'reactivated'} ${current.displayName}.`,
          })
        } else {
          logAudit({
            action: 'company_updated',
            actor: CURRENT_ACTOR,
            companyId: id,
            summary: `${CURRENT_ACTOR} updated details for ${current.displayName}.`,
          })
        }
      },

      importCompanies: (rows) => {
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        const newCompanies: Company[] = rows
          .filter((row) => row.legalName || row.displayName)
          .map((row) => ({
            id: `c-${crypto.randomUUID()}`,
            legalName: row.legalName || row.displayName,
            displayName: row.displayName || row.legalName,
            code: row.code ?? '',
            uuid: `uuid-${crypto.randomUUID()}`,
            logoUrl: '',
            status: 'Active',
            type: row.type === 'Internal' ? 'Internal' : 'External',
            contactEmail: row.contactEmail ?? '',
            contactPhone: row.contactPhone ?? '',
            website: row.website ?? '',
            address: {
              street: row.street ?? '',
              city: row.city ?? '',
              state: row.state ?? '',
              zip: row.zip ?? '',
              country: row.country ?? '',
            },
            emailDomains: row.emailDomains
              ? row.emailDomains.split(';').map((d) => d.trim()).filter(Boolean)
              : [],
            excludedDomains: [],
            onlyDomainUser: false,
            autoAddDomainUsers: false,
            billingInfo: '',
            deliveryInfo: '',
            notes: '',
            subscribedServiceIds: [],
            lastUpdated: today,
            updatedBy: CURRENT_ACTOR,
          }))
        if (newCompanies.length > 0) {
          setCompanies((prev) => [...newCompanies, ...prev])
          logAudit({
            action: 'company_created',
            actor: CURRENT_ACTOR,
            summary: `${CURRENT_ACTOR} imported ${newCompanies.length} compan${newCompanies.length === 1 ? 'y' : 'ies'} via CSV.`,
          })
        }
        return { created: newCompanies.length }
      },

      setCompanySubscriptions: (companyId, serviceIds) => {
        const company = companies.find((c) => c.id === companyId)
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? { ...c, subscribedServiceIds: serviceIds } : c)),
        )
        if (!company) return
        const added = serviceIds.filter((id) => !company.subscribedServiceIds.includes(id))
        const removed = company.subscribedServiceIds.filter((id) => !serviceIds.includes(id))
        added.forEach((serviceId) =>
          logAudit({
            action: 'subscription_added',
            actor: CURRENT_ACTOR,
            companyId,
            serviceId,
            summary: `${CURRENT_ACTOR} subscribed ${company.displayName} to ${serviceLabel(serviceId)}.`,
          }),
        )
        removed.forEach((serviceId) =>
          logAudit({
            action: 'subscription_removed',
            actor: CURRENT_ACTOR,
            companyId,
            serviceId,
            summary: `${CURRENT_ACTOR} removed ${company.displayName}'s subscription to ${serviceLabel(serviceId)}.`,
          }),
        )
      },

      assignRole: (userId, companyId, assignment) => {
        const user = users.find((u) => u.id === userId)
        const company = companies.find((c) => c.id === companyId)
        const existingMembership = user?.memberships.find((m) => m.companyId === companyId)
        const existingAssignment = existingMembership?.roleAssignments.find((r) => r.serviceId === assignment.serviceId)

        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            const membership = u.memberships.find((mem) => mem.companyId === companyId)
            if (!membership) {
              return { ...u, memberships: [...u.memberships, { companyId, roleAssignments: [assignment] }] }
            }
            return {
              ...u,
              memberships: u.memberships.map((mem) =>
                mem.companyId === companyId
                  ? {
                      ...mem,
                      roleAssignments: [
                        ...mem.roleAssignments.filter((r) => r.serviceId !== assignment.serviceId),
                        assignment,
                      ],
                    }
                  : mem,
              ),
            }
          }),
        )

        if (user && company) {
          logAudit({
            action: existingAssignment ? 'role_updated' : 'role_assigned',
            actor: CURRENT_ACTOR,
            targetUser: user.name,
            companyId,
            serviceId: assignment.serviceId,
            summary: `${CURRENT_ACTOR} ${existingAssignment ? 'updated' : 'assigned'} ${user.name}'s role in ${serviceLabel(assignment.serviceId)} at ${company.displayName} to ${assignment.roleId}.`,
          })
        }
      },

      removeRole: (userId, companyId, serviceId) => {
        const user = users.find((u) => u.id === userId)
        const company = companies.find((c) => c.id === companyId)

        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            return {
              ...u,
              memberships: u.memberships.map((m) =>
                m.companyId === companyId
                  ? { ...m, roleAssignments: m.roleAssignments.filter((r) => r.serviceId !== serviceId) }
                  : m,
              ),
            }
          }),
        )

        if (user && company) {
          logAudit({
            action: 'role_removed',
            actor: CURRENT_ACTOR,
            targetUser: user.name,
            companyId,
            serviceId,
            summary: `${CURRENT_ACTOR} removed ${user.name}'s access to ${serviceLabel(serviceId)} at ${company.displayName}.`,
          })
        }
      },

      // Invite flow for Company Management access (spec §4.1/§4.3): an
      // existing user's role assignment is updated directly, a brand-new
      // email creates a new portal user record — either way the invite
      // starts Pending until accepted (spec §4.2).
      invitePortalUser: (email, roleId) => {
        const assignment: RoleAssignment = {
          serviceId: COMPANY_MANAGEMENT_SERVICE_ID,
          roleId,
          inviteStatus: 'Pending',
        }
        const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

        setUsers((prev) => {
          if (existing) {
            return prev.map((u) => {
              if (u.id !== existing.id) return u
              const membership = u.memberships.find((m) => m.companyId === INTERNAL_COMPANY_ID)
              return {
                ...u,
                isPortalUser: true,
                memberships: membership
                  ? u.memberships.map((m) =>
                      m.companyId === INTERNAL_COMPANY_ID
                        ? {
                            ...m,
                            roleAssignments: [
                              ...m.roleAssignments.filter((r) => r.serviceId !== COMPANY_MANAGEMENT_SERVICE_ID),
                              assignment,
                            ],
                          }
                        : m,
                    )
                  : [...u.memberships, { companyId: INTERNAL_COMPANY_ID, roleAssignments: [assignment] }],
              }
            })
          }
          const namePart = email.split('@')[0].replace(/[._]+/g, ' ')
          const name = namePart.replace(/\b\w/g, (c) => c.toUpperCase())
          const newUser: User = {
            id: `u-${crypto.randomUUID()}`,
            name,
            email,
            isPortalUser: true,
            active: true,
            memberships: [{ companyId: INTERNAL_COMPANY_ID, roleAssignments: [assignment] }],
          }
          return [...prev, newUser]
        })

        logAudit({
          action: 'user_invited',
          actor: CURRENT_ACTOR,
          targetUser: existing?.name ?? email,
          companyId: INTERNAL_COMPANY_ID,
          serviceId: COMPANY_MANAGEMENT_SERVICE_ID,
          summary: `${CURRENT_ACTOR} invited ${existing?.name ?? email} to Company Management as ${roleId}.`,
        })
      },

      setUserActive: (userId, active) => {
        const user = users.find((u) => u.id === userId)
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u)))
        if (user) {
          logAudit({
            action: active ? 'user_reactivated' : 'user_deactivated',
            actor: CURRENT_ACTOR,
            targetUser: user.name,
            summary: `${CURRENT_ACTOR} ${active ? 'reactivated' : 'deactivated'} ${user.name}.`,
          })
        }
      },

      // Real password reset (email delivery, token issuance) lives with
      // Entra/Descope (spec §8) — this just records that an admin asked for
      // one, which is the part Qube Account is positioned to know about.
      forcePasswordReset: (userId) => {
        const user = users.find((u) => u.id === userId)
        if (!user) return
        logAudit({
          action: 'password_reset_forced',
          actor: CURRENT_ACTOR,
          targetUser: user.name,
          summary: `${CURRENT_ACTOR} sent a password reset link to ${user.name} (${user.email}).`,
        })
      },

      addUserToCompany: (companyId, email, name) => {
        const company = companies.find((c) => c.id === companyId)
        if (!company) return { ok: false, reason: 'Company not found.' }

        const check = checkDomainForCompany(company, email)
        if (!check.allowed) return { ok: false, reason: check.reason }

        const normalizedEmail = email.trim().toLowerCase()
        const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail)

        if (existing) {
          if (existing.memberships.some((m) => m.companyId === companyId)) {
            return { ok: false, reason: `${existing.name} is already a member of ${company.displayName}.` }
          }
          setUsers((prev) =>
            prev.map((u) =>
              u.id === existing.id ? { ...u, memberships: [...u.memberships, { companyId, roleAssignments: [] }] } : u,
            ),
          )
          logAudit({
            action: 'user_added_to_company',
            actor: CURRENT_ACTOR,
            targetUser: existing.name,
            companyId,
            summary: `${CURRENT_ACTOR} added ${existing.name} to ${company.displayName}.`,
          })
          return { ok: true }
        }

        // Brand-new identity: create the user, then auto-enroll into every
        // other company that claims this email domain via
        // autoAddDomainUsers — the closest this build gets to spec §4.4's
        // JIT arrival without a real IdP event to trigger it.
        const autoAddCompanies = companiesAutoAddingDomain(companies, normalizedEmail, companyId)
        const membershipCompanyIds = [companyId, ...autoAddCompanies.map((c) => c.id)]
        const newUser: User = {
          id: `u-${crypto.randomUUID()}`,
          name: name.trim() || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          isPortalUser: false,
          active: true,
          memberships: membershipCompanyIds.map((cid) => ({ companyId: cid, roleAssignments: [] })),
        }
        setUsers((prev) => [...prev, newUser])
        logAudit({
          action: 'user_added_to_company',
          actor: CURRENT_ACTOR,
          targetUser: newUser.name,
          companyId,
          summary: `${CURRENT_ACTOR} added ${newUser.name} (${newUser.email}) to ${company.displayName}.`,
        })
        autoAddCompanies.forEach((c) =>
          logAudit({
            action: 'user_added_to_company',
            actor: 'System',
            targetUser: newUser.name,
            companyId: c.id,
            summary: `${newUser.name} auto-added to ${c.displayName} (matching domain, auto-add enabled).`,
          }),
        )
        return { ok: true }
      },

      importUsersToCompany: (companyId, rows) => {
        const company = companies.find((c) => c.id === companyId)
        if (!company) return { created: 0, added: 0, skipped: rows.length, reasons: ['Company not found.'] }

        const reasons: string[] = []
        const existingIdsToAdd = new Set<string>()
        const newUsers: User[] = []
        const seenEmails = new Set(users.map((u) => u.email.toLowerCase()))
        let created = 0
        let added = 0

        for (const row of rows) {
          const email = row.email.trim().toLowerCase()
          if (!email) continue
          const check = checkDomainForCompany(company, email)
          if (!check.allowed) {
            reasons.push(`${email}: ${check.reason}`)
            continue
          }
          const existingUser = users.find((u) => u.email.toLowerCase() === email)
          if (existingUser) {
            if (existingUser.memberships.some((m) => m.companyId === companyId)) {
              reasons.push(`${email}: already a member.`)
              continue
            }
            existingIdsToAdd.add(existingUser.id)
            added++
          } else if (seenEmails.has(email)) {
            reasons.push(`${email}: duplicate in file.`)
            continue
          } else {
            seenEmails.add(email)
            newUsers.push({
              id: `u-${crypto.randomUUID()}`,
              name: row.name.trim() || email.split('@')[0],
              email,
              isPortalUser: false,
              active: true,
              memberships: [{ companyId, roleAssignments: [] }],
            })
            created++
          }
        }

        if (created + added > 0) {
          setUsers((prev) => [
            ...prev.map((u) =>
              existingIdsToAdd.has(u.id)
                ? { ...u, memberships: [...u.memberships, { companyId, roleAssignments: [] }] }
                : u,
            ),
            ...newUsers,
          ])
          logAudit({
            action: 'user_added_to_company',
            actor: CURRENT_ACTOR,
            companyId,
            summary: `${CURRENT_ACTOR} imported ${created + added} user(s) into ${company.displayName} via CSV (${created} new, ${added} existing).`,
          })
        }

        return { created, added, skipped: reasons.length, reasons }
      },
    }),
    [companies, users, auditLog],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function serviceName(serviceId: string) {
  return services.find((s) => s.id === serviceId)?.name ?? serviceId
}

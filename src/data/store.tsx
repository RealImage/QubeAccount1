import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Company, RoleAssignment, User } from './types'
import { companies as seedCompanies } from './companies'
import { users as seedUsers } from './users'
import { services } from './services'

interface Store {
  companies: Company[]
  users: User[]
  addCompany: (company: Company) => void
  updateCompany: (id: string, patch: Partial<Company>) => void
  setCompanySubscriptions: (companyId: string, serviceIds: string[]) => void
  assignRole: (userId: string, companyId: string, assignment: RoleAssignment) => void
  removeRole: (userId: string, companyId: string, serviceId: string) => void
  invitePortalUser: (email: string, roleId: string) => void
  setUserActive: (userId: string, active: boolean) => void
}

const INTERNAL_COMPANY_ID = 'c-qube-internal'
const COMPANY_MANAGEMENT_SERVICE_ID = 'company-management'

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies)
  const [users, setUsers] = useState<User[]>(seedUsers)

  const value = useMemo<Store>(
    () => ({
      companies,
      users,
      addCompany: (company) => setCompanies((prev) => [company, ...prev]),
      updateCompany: (id, patch) =>
        setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
      setCompanySubscriptions: (companyId, serviceIds) =>
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? { ...c, subscribedServiceIds: serviceIds } : c)),
        ),
      assignRole: (userId, companyId, assignment) =>
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            const membership = u.memberships.find((m) => m.companyId === companyId)
            if (!membership) {
              return { ...u, memberships: [...u.memberships, { companyId, roleAssignments: [assignment] }] }
            }
            return {
              ...u,
              memberships: u.memberships.map((m) =>
                m.companyId === companyId
                  ? {
                      ...m,
                      roleAssignments: [
                        ...m.roleAssignments.filter((r) => r.serviceId !== assignment.serviceId),
                        assignment,
                      ],
                    }
                  : m,
              ),
            }
          }),
        ),
      removeRole: (userId, companyId, serviceId) =>
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
        ),
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
        setUsers((prev) => {
          const existing = prev.find((u) => u.email.toLowerCase() === email.toLowerCase())
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
            id: `u-${Date.now()}`,
            name,
            email,
            isPortalUser: true,
            active: true,
            memberships: [{ companyId: INTERNAL_COMPANY_ID, roleAssignments: [assignment] }],
          }
          return [...prev, newUser]
        })
      },
      setUserActive: (userId, active) =>
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active } : u))),
    }),
    [companies, users],
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

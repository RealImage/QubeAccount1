import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, FileText, Layers, UserPlus, Users as UsersIcon } from 'lucide-react'
import clsx from 'clsx'
import { useStore, serviceName } from '../data/store'
import { services } from '../data/services'
import { effectiveAccess } from '../data/access'
import type { User } from '../data/types'
import { ActionMenu, Button, Card, Modal, StatusBadge, Toast } from '../components/ui'

type Tab = 'details' | 'users' | 'subscriptions'

export function CompanyDetail() {
  const { id } = useParams()
  const { companies, users, setCompanySubscriptions, setUserActive } = useStore()
  const [tab, setTab] = useState<Tab>('details')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [detailsUser, setDetailsUser] = useState<User | null>(null)
  const [auditUser, setAuditUser] = useState<User | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const company = companies.find((c) => c.id === id)
  if (!company) return <p className="text-[var(--color-muted)]">Company not found.</p>

  const companyUsers = users.filter((u) => u.memberships.some((m) => m.companyId === company.id))
  const subscribedServices = services.filter((s) => company.subscribedServiceIds.includes(s.id))
  const activeServiceId = selectedServiceId ?? subscribedServices[0]?.id ?? null
  const activeService = services.find((s) => s.id === activeServiceId)

  const usersForActiveService = companyUsers
    .map((u) => {
      const membership = u.memberships.find((m) => m.companyId === company.id)
      const assignment = membership?.roleAssignments.find((r) => r.serviceId === activeServiceId)
      return assignment ? { user: u, assignment } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

  function toggleSubscription(serviceId: string) {
    const has = company!.subscribedServiceIds.includes(serviceId)
    setCompanySubscriptions(
      company!.id,
      has ? company!.subscribedServiceIds.filter((s) => s !== serviceId) : [...company!.subscribedServiceIds, serviceId],
    )
  }

  function handleToggleActive(user: User) {
    setUserActive(user.id, !user.active)
    setToast(`${user.name} ${user.active ? 'deactivated' : 'activated'}.`)
  }

  return (
    <div>
      <Link to="/companies" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">{company.displayName}</h1>
      <p className="mt-1 text-[var(--color-muted)]">Manage details for {company.legalName}.</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded bg-[color-mix(in_srgb,var(--color-teal)_8%,white)] text-[var(--color-muted)]">
          <Building2 className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text)]">{company.displayName}</p>
          <p className="text-sm text-[var(--color-muted)]">{company.legalName}</p>
          <p className="text-sm text-[var(--color-muted)]">
            {company.address.city}
            {company.address.state ? `, ${company.address.state}` : ''}
          </p>
          <div className="mt-1">
            <StatusBadge status={company.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] text-sm font-medium">
        {(
          [
            { key: 'details', label: 'Company Details', icon: FileText },
            { key: 'users', label: 'Company Users', icon: UsersIcon },
            { key: 'subscriptions', label: 'Company Subscriptions', icon: Layers },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors',
              tab === key ? 'border-[var(--color-teal)] bg-[var(--color-surface)] text-[var(--color-text)]' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <Detail label="Company Legal Name" value={company.legalName} />
            <Detail label="Company Display Name" value={company.displayName} />
            <Detail label="Company Code" value={company.code} />
            <Detail label="Company UUID" value={company.uuid} />
            <Detail label="Contact Email" value={company.contactEmail} />
            <Detail label="Contact Phone" value={company.contactPhone} />
            <Detail label="Website" value={company.website} />
            <Detail
              label="Address"
              value={[company.address.street, company.address.city, company.address.state, company.address.zip, company.address.country]
                .filter(Boolean)
                .join(', ')}
            />
            <Detail label="Email Domains" value={company.emailDomains.join(', ') || '—'} />
            <Detail label="Excluded Domains" value={company.excludedDomains.join(', ') || '—'} />
          </dl>
          <div className="mt-6">
            <Link to={`/companies/${company.id}/edit`}>
              <Button>Edit Company</Button>
            </Link>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Company Users</h2>
              <p className="text-sm text-[var(--color-muted)]">Manage users associated with {company.displayName}.</p>
            </div>
            <Button icon={<UserPlus className="h-4 w-4" />}>Add User</Button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Service(s)</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {companyUsers.map((u) => {
                const membership = u.memberships.find((m) => m.companyId === company.id)!
                const anyPending = membership.roleAssignments.some((r) => effectiveAccess(company, r) === 'pending')
                return (
                  <tr key={u.id}>
                    <td className="py-3 pr-4 font-medium text-[var(--color-text)]">{u.name}</td>
                    <td className="py-3 pr-4 text-[var(--color-muted)]">{u.email}</td>
                    <td className="py-3 pr-4 text-[var(--color-muted)]">
                      {membership.roleAssignments.map((r) => serviceName(r.serviceId)).join(', ') || '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={company.status === 'Inactive' ? 'Inactive' : anyPending ? 'Pending' : 'Active'} />
                    </td>
                  </tr>
                )
              })}
              {companyUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--color-muted)]">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'subscriptions' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Service Subscriptions</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">Manage Qube Service subscriptions and user roles for {company.displayName}.</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <h3 className="mb-3 font-semibold text-[var(--color-text)]">Subscribed Services</h3>
              <div className="space-y-1">
                {subscribedServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={clsx(
                      'block w-full rounded-md px-3 py-2 text-left text-sm',
                      activeServiceId === s.id ? 'bg-[var(--color-teal)] text-white' : 'border border-[var(--color-line)] text-[var(--color-text)] hover:bg-[var(--color-paper)]',
                    )}
                  >
                    {s.name}
                  </button>
                ))}
                {subscribedServices.length === 0 && <p className="text-sm text-[var(--color-muted)]">No subscriptions yet.</p>}
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-[var(--color-teal)]">Manage subscriptions</summary>
                <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                  {services
                    .filter((s) => s.eligibility === 'all' || company.type === 'Internal')
                    .map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <input
                          type="checkbox"
                          checked={company.subscribedServiceIds.includes(s.id)}
                          onChange={() => toggleSubscription(s.id)}
                        />
                        {s.name}
                      </label>
                    ))}
                </div>
              </details>
            </Card>

            <Card className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--color-text)]">Users & Roles for {activeService?.name ?? '—'}</h3>
                {activeService && (
                  <Button icon={<UserPlus className="h-4 w-4" />} onClick={() => alert('Assign role — demo only.')}>
                    Add User to Service
                  </Button>
                )}
              </div>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
                  <tr>
                    <th className="py-2 pr-4 font-medium">User Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Role in Service</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-line)]">
                  {usersForActiveService.map(({ user, assignment }) => {
                    const access = effectiveAccess(company, assignment)
                    const status = !user.active ? 'Inactive' : access === 'allowed' ? 'Active' : access === 'pending' ? 'Pending' : 'Inactive'
                    return (
                      <tr key={user.id}>
                        <td className="py-3 pr-4 font-medium text-[var(--color-text)]">{user.name}</td>
                        <td className="py-3 pr-4 text-[var(--color-muted)]">{user.email}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs text-white">{assignment.roleId}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <ActionMenu
                            items={[
                              { label: 'View User Details', onSelect: () => setDetailsUser(user) },
                              { label: 'View User Access Audit', onSelect: () => setAuditUser(user) },
                              {
                                label: user.active ? 'Deactivate User' : 'Activate User',
                                onSelect: () => handleToggleActive(user),
                                destructive: user.active,
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    )
                  })}
                  {usersForActiveService.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--color-muted)]">
                        No users assigned to this service.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      )}

      <Modal open={detailsUser !== null} onClose={() => setDetailsUser(null)} title="User Details">
        {detailsUser && (
          <dl className="space-y-3 text-sm">
            <UserDetailRow label="Name" value={detailsUser.name} />
            <UserDetailRow label="Email" value={detailsUser.email} />
            <UserDetailRow label="Portal User" value={detailsUser.isPortalUser ? 'Yes' : 'No'} />
            <UserDetailRow label="Account Status" value={detailsUser.active ? 'Active' : 'Deactivated'} />
            <div>
              <dt className="mb-1 text-[var(--color-muted)]">Company Memberships</dt>
              <dd className="space-y-2">
                {detailsUser.memberships.map((m) => {
                  const memberCompany = companies.find((c) => c.id === m.companyId)
                  return (
                    <div key={m.companyId} className="rounded-md border border-[var(--color-line)] p-2.5">
                      <p className="font-medium text-[var(--color-text)]">{memberCompany?.displayName ?? m.companyId}</p>
                      <ul className="mt-1 space-y-0.5">
                        {m.roleAssignments.map((r) => (
                          <li key={r.serviceId} className="flex items-center justify-between text-[var(--color-muted)]">
                            <span>
                              {serviceName(r.serviceId)} — {r.roleId}
                            </span>
                            <StatusBadge status={r.inviteStatus === 'Accepted' ? 'Active' : 'Pending'} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </dd>
            </div>
          </dl>
        )}
      </Modal>

      <Modal open={auditUser !== null} onClose={() => setAuditUser(null)} title="User Access Audit">
        {auditUser && (
          <div className="max-h-96 space-y-3 overflow-y-auto text-sm">
            {auditUser.memberships.flatMap((m) => {
              const memberCompany = companies.find((c) => c.id === m.companyId)
              return m.roleAssignments.map((r) => (
                <div key={`${m.companyId}-${r.serviceId}`} className="border-b border-[var(--color-line)] pb-2 last:border-0">
                  <p className="text-[var(--color-text)]">
                    Role <span className="font-medium">{r.roleId}</span> in {serviceName(r.serviceId)} for{' '}
                    <span className="font-medium">{memberCompany?.displayName ?? m.companyId}</span>
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    Invite {r.inviteStatus.toLowerCase()} · effective access:{' '}
                    {effectiveAccess(memberCompany, r) === 'allowed' ? 'allowed' : effectiveAccess(memberCompany, r) === 'pending' ? 'pending acceptance' : 'denied'}
                  </p>
                </div>
              ))
            })}
            {auditUser.memberships.every((m) => m.roleAssignments.length === 0) && (
              <p className="text-[var(--color-muted)]">No access events recorded for this user.</p>
            )}
          </div>
        )}
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

function UserDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="font-medium text-[var(--color-text)]">{value}</dd>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-[var(--color-muted)]">{label}</dt>
      <dd className="text-sm font-medium text-[var(--color-text)]">{value || '—'}</dd>
    </div>
  )
}

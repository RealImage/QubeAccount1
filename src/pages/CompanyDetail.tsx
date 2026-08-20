import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, FileText, Layers, UserPlus, Users as UsersIcon } from 'lucide-react'
import clsx from 'clsx'
import { useStore, serviceName } from '../data/store'
import { services } from '../data/services'
import { effectiveAccess } from '../data/access'
import { Button, Card, StatusBadge } from '../components/ui'

type Tab = 'details' | 'users' | 'subscriptions'

export function CompanyDetail() {
  const { id } = useParams()
  const { companies, users, setCompanySubscriptions } = useStore()
  const [tab, setTab] = useState<Tab>('details')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const company = companies.find((c) => c.id === id)
  if (!company) return <p className="text-slate-500">Company not found.</p>

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

  return (
    <div>
      <Link to="/companies" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </Link>

      <h1 className="text-3xl font-bold text-slate-900">{company.displayName}</h1>
      <p className="mt-1 text-slate-500">Manage details for {company.legalName}.</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100 text-slate-400">
          <Building2 className="h-7 w-7" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">{company.displayName}</p>
          <p className="text-sm text-slate-500">{company.legalName}</p>
          <p className="text-sm text-slate-400">
            {company.address.city}
            {company.address.state ? `, ${company.address.state}` : ''}
          </p>
          <div className="mt-1">
            <StatusBadge status={company.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex rounded-md border border-slate-200 bg-slate-50 text-sm font-medium">
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
              tab === key ? 'border-blue-600 bg-white text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-slate-200 bg-white p-6">
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
        <div className="mt-6 rounded-b-md border border-t-0 border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Company Users</h2>
              <p className="text-sm text-slate-500">Manage users associated with {company.displayName}.</p>
            </div>
            <Button icon={<UserPlus className="h-4 w-4" />}>Add User</Button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Service(s)</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyUsers.map((u) => {
                const membership = u.memberships.find((m) => m.companyId === company.id)!
                const anyPending = membership.roleAssignments.some((r) => effectiveAccess(company, r) === 'pending')
                return (
                  <tr key={u.id}>
                    <td className="py-3 pr-4 font-medium text-slate-800">{u.name}</td>
                    <td className="py-3 pr-4 text-slate-500">{u.email}</td>
                    <td className="py-3 pr-4 text-slate-500">
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
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'subscriptions' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Service Subscriptions</h2>
          <p className="mb-4 text-sm text-slate-500">Manage Qube Service subscriptions and user roles for {company.displayName}.</p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <h3 className="mb-3 font-semibold text-slate-900">Subscribed Services</h3>
              <div className="space-y-1">
                {subscribedServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={clsx(
                      'block w-full rounded-md px-3 py-2 text-left text-sm',
                      activeServiceId === s.id ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    {s.name}
                  </button>
                ))}
                {subscribedServices.length === 0 && <p className="text-sm text-slate-400">No subscriptions yet.</p>}
              </div>
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-blue-600">Manage subscriptions</summary>
                <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                  {services
                    .filter((s) => s.eligibility === 'all' || company.type === 'Internal')
                    .map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-xs text-slate-600">
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
                <h3 className="font-semibold text-slate-900">Users & Roles for {activeService?.name ?? '—'}</h3>
                {activeService && (
                  <Button icon={<UserPlus className="h-4 w-4" />} onClick={() => alert('Assign role — demo only.')}>
                    Add User to Service
                  </Button>
                )}
              </div>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-medium">User Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Role in Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersForActiveService.map(({ user, assignment }) => (
                    <tr key={user.id}>
                      <td className="py-3 pr-4 font-medium text-slate-800">{user.name}</td>
                      <td className="py-3 pr-4 text-slate-500">{user.email}</td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-white">{assignment.roleId}</span>
                      </td>
                    </tr>
                  ))}
                  {usersForActiveService.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
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
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value || '—'}</dd>
    </div>
  )
}

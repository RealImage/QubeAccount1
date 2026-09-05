import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Users } from 'lucide-react'
import clsx from 'clsx'
import { serviceById } from '../data/services'
import { EligibilityBadge, StatusBadge } from '../components/ui'

type Tab = 'details' | 'roles'

export function ServiceConfigure() {
  const { id } = useParams()
  const [tab, setTab] = useState<Tab>('details')
  const service = serviceById(id ?? '')

  if (!service) return <p className="text-[var(--color-muted)]">Service not found.</p>

  return (
    <div>
      <Link to="/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">Configure: {service.name}</h1>
      <p className="mt-1 text-[var(--color-muted)]">{service.description}</p>

      <div className="mt-6 flex rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] text-sm font-medium">
        {(
          [
            { key: 'details', label: 'Service Details', icon: FileText },
            { key: 'roles', label: 'Service Roles', icon: Users },
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
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Service Details</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">Core information and identifiers for {service.name}.</p>
          <dl className="divide-y divide-[var(--color-line)]">
            <Row label="Service Name" value={service.name} />
            <Row label="Service URL" value={service.accessUrl} />
            <Row label="Service Description" value={service.description} />
            <Row label="Service UUID" value={service.uuid} />
            <Row label="Service Client ID" value={service.clientId} />
            <Row label="Service Token" value="placeholder... (placeholder)" />
            <Row label="Last Updated" value={service.lastUpdated} />
          </dl>
          <p className="mt-4 text-xs text-[var(--color-muted)]">
            Note: Sensitive fields like Service Token are placeholders and would be managed securely in a real system.
          </p>
        </div>
      )}

      {tab === 'roles' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Service Roles</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">Roles available within {service.name}. These roles are defined by the service itself.</p>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
              <tr>
                <th className="py-2 pr-4 font-medium">Role Name</th>
                <th className="py-2 pr-4 font-medium">Description</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Updated On</th>
                <th className="py-2 pr-4 font-medium">Updated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {service.roles.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pr-4 font-medium text-[var(--color-text)]">{r.name}</td>
                  <td className="py-3 pr-4 text-[var(--color-muted)]">{r.description}</td>
                  <td className="py-3 pr-4">
                    <EligibilityBadge eligibility={r.eligibility} />
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-muted)]">{r.updatedOn}</td>
                  <td className="py-3 pr-4 text-[var(--color-muted)]">{r.updatedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 py-3">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[var(--color-text)]">{value}</dd>
    </div>
  )
}

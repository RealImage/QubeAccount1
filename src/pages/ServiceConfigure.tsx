import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Users } from 'lucide-react'
import clsx from 'clsx'
import { serviceById } from '../data/services'
import { StatusBadge } from '../components/ui'

type Tab = 'details' | 'roles'

export function ServiceConfigure() {
  const { id } = useParams()
  const [tab, setTab] = useState<Tab>('details')
  const service = serviceById(id ?? '')

  if (!service) return <p className="text-slate-500">Service not found.</p>

  return (
    <div>
      <Link to="/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Link>

      <h1 className="text-3xl font-bold text-slate-900">Configure: {service.name}</h1>
      <p className="mt-1 text-slate-500">{service.description}</p>

      <div className="mt-6 flex rounded-md border border-slate-200 bg-slate-50 text-sm font-medium">
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
          <h2 className="text-lg font-semibold text-slate-900">Service Details</h2>
          <p className="mb-4 text-sm text-slate-500">Core information and identifiers for {service.name}.</p>
          <dl className="divide-y divide-slate-100">
            <Row label="Service Name" value={service.name} />
            <Row label="Service URL" value={service.accessUrl} />
            <Row label="Service Description" value={service.description} />
            <Row label="Service UUID" value={service.uuid} />
            <Row label="Service Client ID" value={service.clientId} />
            <Row label="Service Token" value="placeholder... (placeholder)" />
            <Row label="Last Updated" value={service.lastUpdated} />
          </dl>
          <p className="mt-4 text-xs text-slate-400">
            Note: Sensitive fields like Service Token are placeholders and would be managed securely in a real system.
          </p>
        </div>
      )}

      {tab === 'roles' && (
        <div className="mt-6 rounded-b-md border border-t-0 border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Service Roles</h2>
          <p className="mb-4 text-sm text-slate-500">Roles available within {service.name}. These roles are defined by the service itself.</p>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Role Name</th>
                <th className="py-2 pr-4 font-medium">Description</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Updated On</th>
                <th className="py-2 pr-4 font-medium">Updated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {service.roles.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pr-4 font-medium text-slate-800">{r.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{r.description}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{r.updatedOn}</td>
                  <td className="py-3 pr-4 text-slate-500">{r.updatedBy}</td>
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
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-900">{value}</dd>
    </div>
  )
}

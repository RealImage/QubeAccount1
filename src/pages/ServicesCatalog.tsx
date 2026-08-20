import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import clsx from 'clsx'
import { services } from '../data/services'
import { useStore } from '../data/store'
import { Button, PageHeader } from '../components/ui'

export function ServicesCatalog() {
  const { companies } = useStore()
  const [tab, setTab] = useState<'all' | 'internal'>('all')
  const filtered = services.filter((s) => (tab === 'all' ? s.eligibility === 'all' : s.eligibility === 'internal'))

  function subscribedCount(serviceId: string) {
    return companies.filter((c) => c.status === 'Active' && c.subscribedServiceIds.includes(serviceId)).length
  }

  return (
    <div>
      <PageHeader title="Qube Services" description="List of Qube Services and their status." />

      <div className="mb-4 flex rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] text-sm font-medium">
        <button
          onClick={() => setTab('all')}
          className={clsx('flex-1 rounded-md px-4 py-2.5', tab === 'all' ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-muted)]')}
        >
          All Company Services
        </button>
        <button
          onClick={() => setTab('internal')}
          className={clsx('flex-1 rounded-md px-4 py-2.5', tab === 'internal' ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm' : 'text-[var(--color-muted)]')}
        >
          Internal Company Services
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Service Name</th>
              <th className="px-6 py-3 font-medium">Access URL</th>
              <th className="px-6 py-3 font-medium">Subscribed Companies (Active)</th>
              <th className="px-6 py-3 font-medium">Last Updated</th>
              <th className="px-6 py-3 font-medium text-right">Configuration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--color-paper)]">
                <td className="px-6 py-4 font-medium text-[var(--color-text)]">{s.name}</td>
                <td className="px-6 py-4">
                  <a href={`https://${s.accessUrl}`} target="_blank" rel="noreferrer" className="text-[var(--color-teal)] hover:underline">
                    {s.accessUrl}
                  </a>
                </td>
                <td className="px-6 py-4 text-[var(--color-muted)]">{subscribedCount(s.id)}</td>
                <td className="px-6 py-4 text-[var(--color-muted)]">{s.lastUpdated.split(',')[0]}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/services/${s.id}`}>
                    <Button variant="outline" icon={<Settings2 className="h-4 w-4" />}>
                      Configure
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-[var(--color-muted)]">
        This list includes all services available for company subscriptions. Service configuration involves managing service-specific
        settings and roles.
      </p>
    </div>
  )
}

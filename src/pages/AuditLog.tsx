import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { useStore, serviceName } from '../data/store'
import type { AuditAction, AuditEntry } from '../data/types'
import { toCSV, downloadCSV } from '../utils/csv'
import { Button, PageHeader, Pagination, SearchSelect, TextInput, usePagination } from '../components/ui'

const PAGE_SIZE = 20

const ACTION_LABELS: Record<AuditAction, string> = {
  user_invited: 'User Invited',
  invite_accepted: 'Invite Accepted',
  user_added_to_company: 'User Added to Company',
  role_assigned: 'Role Assigned',
  role_updated: 'Role Updated',
  role_removed: 'Role Removed',
  subscription_added: 'Subscription Added',
  subscription_removed: 'Subscription Removed',
  company_created: 'Company Created',
  company_updated: 'Company Updated',
  company_deactivated: 'Company Deactivated',
  company_reactivated: 'Company Reactivated',
  user_deactivated: 'User Deactivated',
  user_reactivated: 'User Reactivated',
  password_reset_forced: 'Password Reset Sent',
  user_login: 'User Login',
  service_accessed: 'Service Accessed',
}

const ACTION_OPTIONS = Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label }))

interface Filters {
  actions: string[]
  companyIds: string[]
  from: string
  to: string
}

const emptyFilters: Filters = { actions: [], companyIds: [], from: '', to: '' }

function companyLabel(companies: { id: string; displayName: string }[], id?: string) {
  if (!id) return '—'
  return companies.find((c) => c.id === id)?.displayName ?? id
}

export function AuditLog() {
  const { auditLog, companies } = useStore()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(emptyFilters)

  const companyOptions = useMemo(
    () => companies.map((c) => ({ value: c.id, label: c.displayName })).sort((a, b) => a.label.localeCompare(b.label)),
    [companies],
  )

  const filtered = useMemo(() => {
    const from = filters.from ? new Date(filters.from) : null
    const to = filters.to ? new Date(filters.to) : null
    const q = search.trim().toLowerCase()
    return auditLog.filter((entry) => {
      const matchesSearch =
        !q ||
        entry.summary.toLowerCase().includes(q) ||
        entry.actor.toLowerCase().includes(q) ||
        (entry.targetUser?.toLowerCase().includes(q) ?? false)
      const matchesAction = filters.actions.length === 0 || filters.actions.includes(entry.action)
      const matchesCompany = filters.companyIds.length === 0 || (entry.companyId ? filters.companyIds.includes(entry.companyId) : false)
      const entryDate = new Date(entry.timestamp)
      const matchesFrom = !from || entryDate >= from
      const matchesTo = !to || entryDate <= to
      return matchesSearch && matchesAction && matchesCompany && matchesFrom && matchesTo
    })
  }, [auditLog, search, filters])

  const { page, pageCount, setPage, pageItems } = usePagination(filtered, PAGE_SIZE)

  function handleExport() {
    const csv = toCSV<AuditEntry>(filtered, [
      { key: 'timestamp', header: 'Timestamp', value: (e) => new Date(e.timestamp).toLocaleString() },
      { key: 'actor', header: 'Actor', value: (e) => e.actor },
      { key: 'action', header: 'Action', value: (e) => ACTION_LABELS[e.action] },
      { key: 'targetUser', header: 'Target User', value: (e) => e.targetUser ?? '' },
      { key: 'company', header: 'Company', value: (e) => companyLabel(companies, e.companyId) },
      { key: 'service', header: 'Service', value: (e) => (e.serviceId ? serviceName(e.serviceId) : '') },
      { key: 'summary', header: 'Details', value: (e) => e.summary },
      { key: 'ipAddress', header: 'IP Address', value: (e) => e.ipAddress ?? '' },
      { key: 'region', header: 'Region', value: (e) => e.region ?? '' },
      { key: 'device', header: 'Device', value: (e) => e.device ?? '' },
    ])
    downloadCSV(`audit-log-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Authorization events across every company — invites, role and subscription changes, deactivations, and forced password resets. Login/service-access rows are illustrative until Entra/Descope session events are wired in (spec §8)."
        actions={
          <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <TextInput
          placeholder="Search by actor, target, or details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="min-w-56 max-w-xs flex-1">
          <SearchSelect
            label="Action"
            placeholder="Filter by action..."
            options={ACTION_OPTIONS}
            selected={filters.actions}
            onChange={(actions) => setFilters((prev) => ({ ...prev, actions }))}
          />
        </div>
        <div className="min-w-56 max-w-xs flex-1">
          <SearchSelect
            label="Company"
            placeholder="Filter by company..."
            options={companyOptions}
            selected={filters.companyIds}
            onChange={(companyIds) => setFilters((prev) => ({ ...prev, companyIds }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <TextInput type="date" value={filters.from} onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))} />
          <span className="text-sm text-[var(--color-muted)]">to</span>
          <TextInput type="date" value={filters.to} onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Company / Service</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Device</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {pageItems.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--color-muted)]">
                  {new Date(entry.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-[var(--color-text)]">{entry.actor}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs text-white">
                    {ACTION_LABELS[entry.action]}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{entry.targetUser ?? '—'}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">
                  {companyLabel(companies, entry.companyId)}
                  {entry.serviceId ? ` · ${serviceName(entry.serviceId)}` : ''}
                </td>
                <td className="px-4 py-3 text-[var(--color-text)]">{entry.summary}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">
                  {entry.region ?? '—'}
                  {entry.ipAddress ? <span className="block font-mono text-xs">{entry.ipAddress}</span> : null}
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{entry.device ?? '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[var(--color-muted)]">
                  No audit events match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={setPage}
        totalLabel={`Showing ${pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0}–${(page - 1) * PAGE_SIZE + pageItems.length} of ${filtered.length} events`}
      />
    </div>
  )
}

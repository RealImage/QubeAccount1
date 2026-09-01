import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Plus, Search } from 'lucide-react'
import { useStore, serviceName } from '../data/store'
import { services } from '../data/services'
import { Button, PageHeader, Pagination, Select, StatusBadge, TextInput, usePagination } from '../components/ui'

const PAGE_SIZE = 5

export function CompanyList() {
  const { companies } = useStore()
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        !search ||
        c.displayName.toLowerCase().includes(search.toLowerCase()) ||
        c.address.city.toLowerCase().includes(search.toLowerCase())
      const matchesService = !serviceFilter || c.subscribedServiceIds.includes(serviceFilter)
      const matchesStatus = !statusFilter || c.status === statusFilter
      return matchesSearch && matchesService && matchesStatus
    })
  }, [companies, search, serviceFilter, statusFilter])

  const { page, pageCount, setPage, pageItems } = usePagination(filtered, PAGE_SIZE)

  return (
    <div>
      <PageHeader
        title="Company Management"
        description="Manage all company accounts."
        actions={
          <Link to="/companies/new">
            <Button icon={<Plus className="h-4 w-4" />}>Add New Company</Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <TextInput
            placeholder="Search companies by name, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-56">
          <option value="">Filter by service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="">Filter by status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] ">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Logo</th>
              <th className="px-6 py-3 font-medium">Display Name</th>
              <th className="px-6 py-3 font-medium">Subscribed Services</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Last Updated</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {pageItems.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--color-paper)]">
                <td className="px-6 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[color-mix(in_srgb,var(--color-teal)_8%,white)] text-[var(--color-muted)]">
                    <Building2 className="h-5 w-5" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/companies/${c.id}`} className="font-medium text-[var(--color-teal)] hover:underline">
                    {c.displayName}
                  </Link>
                  <p className="text-[var(--color-muted)]">{c.legalName}</p>
                  <p className="text-[var(--color-muted)]">
                    {c.address.city}
                    {c.address.state ? `, ${c.address.state}` : ''}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.subscribedServiceIds.slice(0, 2).map((id) => (
                      <span key={id} className="rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs text-white">
                        {serviceName(id)}
                      </span>
                    ))}
                    {c.subscribedServiceIds.length > 2 && (
                      <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs text-white">
                        +{c.subscribedServiceIds.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-6 py-4 text-[var(--color-muted)]">{c.lastUpdated}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/companies/${c.id}`} className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                    &hellip;
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[var(--color-muted)]">
                  No companies match your filters.
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
        totalLabel={`Showing ${pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0}–${(page - 1) * PAGE_SIZE + pageItems.length} of ${filtered.length} companies`}
      />
    </div>
  )
}

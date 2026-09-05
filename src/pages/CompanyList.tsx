import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useStore, serviceName } from '../data/store'
import { services } from '../data/services'
import { auditLog } from '../data/audit'
import type { Company, CompanyStatus } from '../data/types'
import {
  ActionMenu,
  Button,
  CheckboxGroup,
  Drawer,
  SearchSelect,
  Modal,
  PageHeader,
  Pagination,
  StatusBadge,
  TextInput,
  usePagination,
} from '../components/ui'

const PAGE_SIZE = 20

interface Filters {
  cities: string[]
  states: string[]
  countries: string[]
  serviceIds: string[]
  statuses: CompanyStatus[]
  updatedFrom: string
  updatedTo: string
  updatedBy: string[]
}

const emptyFilters: Filters = {
  cities: [],
  states: [],
  countries: [],
  serviceIds: [],
  statuses: [],
  updatedFrom: '',
  updatedTo: '',
  updatedBy: [],
}

function filterCount(f: Filters) {
  return (
    f.cities.length +
    f.states.length +
    f.countries.length +
    f.serviceIds.length +
    f.statuses.length +
    f.updatedBy.length +
    (f.updatedFrom ? 1 : 0) +
    (f.updatedTo ? 1 : 0)
  )
}

export function CompanyList() {
  const navigate = useNavigate()
  const { companies } = useStore()
  const [search, setSearch] = useState('')
  const [auditCompany, setAuditCompany] = useState<Company | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters)

  const cityOptions = useMemo(() => [...new Set(companies.map((c) => c.address.city).filter(Boolean))].sort(), [companies])
  const stateOptions = useMemo(() => [...new Set(companies.map((c) => c.address.state).filter(Boolean))].sort(), [companies])
  const countryOptions = useMemo(() => [...new Set(companies.map((c) => c.address.country).filter(Boolean))].sort(), [companies])
  const updatedByOptions = useMemo(() => [...new Set(companies.map((c) => c.updatedBy).filter(Boolean))].sort(), [companies])

  const filtered = useMemo(() => {
    const from = filters.updatedFrom ? new Date(filters.updatedFrom) : null
    const to = filters.updatedTo ? new Date(filters.updatedTo) : null
    return companies.filter((c) => {
      const matchesSearch = !search || c.displayName.toLowerCase().includes(search.toLowerCase())
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(c.address.city)
      const matchesState = filters.states.length === 0 || filters.states.includes(c.address.state)
      const matchesCountry = filters.countries.length === 0 || filters.countries.includes(c.address.country)
      const matchesServices =
        filters.serviceIds.length === 0 || filters.serviceIds.some((id) => c.subscribedServiceIds.includes(id))
      const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(c.status)
      const matchesUpdatedBy = filters.updatedBy.length === 0 || filters.updatedBy.includes(c.updatedBy)
      const updatedDate = new Date(c.lastUpdated)
      const matchesFrom = !from || updatedDate >= from
      const matchesTo = !to || updatedDate <= to
      return (
        matchesSearch &&
        matchesCity &&
        matchesState &&
        matchesCountry &&
        matchesServices &&
        matchesStatus &&
        matchesUpdatedBy &&
        matchesFrom &&
        matchesTo
      )
    })
  }, [companies, search, filters])

  const { page, pageCount, setPage, pageItems } = usePagination(filtered, PAGE_SIZE)
  const activeFilterCount = filterCount(filters)

  function openFilters() {
    setDraftFilters(filters)
    setFiltersOpen(true)
  }

  function applyFilters() {
    setFilters(draftFilters)
    setFiltersOpen(false)
  }

  function clearDraftFilters() {
    setDraftFilters(emptyFilters)
  }

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
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={openFilters}>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </Button>
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
                  <ActionMenu
                    items={[
                      { label: 'View Company Details', onSelect: () => navigate(`/companies/${c.id}`) },
                      { label: 'Edit Company Details', onSelect: () => navigate(`/companies/${c.id}/edit`) },
                      { label: 'View Company Audit Log', onSelect: () => setAuditCompany(c) },
                    ]}
                  />
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

      <Modal open={auditCompany !== null} onClose={() => setAuditCompany(null)} title="Company Audit Log">
        {auditCompany && (
          <div className="max-h-96 space-y-3 overflow-y-auto text-sm">
            {auditLog
              .filter((entry) => entry.companyId === auditCompany.id)
              .map((entry) => (
                <div key={entry.id} className="border-b border-[var(--color-line)] pb-2 last:border-0">
                  <p className="text-[var(--color-text)]">{entry.summary}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {new Date(entry.timestamp).toLocaleString()}
                    {entry.actor !== 'System' && ` · by ${entry.actor}`}
                  </p>
                </div>
              ))}
            {auditLog.filter((entry) => entry.companyId === auditCompany.id).length === 0 && (
              <p className="text-[var(--color-muted)]">No audit events recorded for {auditCompany.displayName}.</p>
            )}
          </div>
        )}
      </Modal>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={clearDraftFilters}>
              Clear All
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        }
      >
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Location</h3>
          <div className="space-y-4">
            <SearchSelect
              label="City"
              placeholder="Search cities..."
              options={cityOptions}
              selected={draftFilters.cities}
              onChange={(cities) => setDraftFilters((prev) => ({ ...prev, cities }))}
            />
            <SearchSelect
              label="State"
              placeholder="Search states..."
              options={stateOptions}
              selected={draftFilters.states}
              onChange={(states) => setDraftFilters((prev) => ({ ...prev, states }))}
            />
            <SearchSelect
              label="Country"
              placeholder="Search countries..."
              options={countryOptions}
              selected={draftFilters.countries}
              onChange={(countries) => setDraftFilters((prev) => ({ ...prev, countries }))}
            />
          </div>
        </div>

        <SearchSelect
          label="Subscribed Services"
          placeholder="Search services..."
          options={services.map((s) => ({ value: s.id, label: s.name }))}
          selected={draftFilters.serviceIds}
          onChange={(serviceIds) => setDraftFilters((prev) => ({ ...prev, serviceIds }))}
        />

        <CheckboxGroup
          label="Status"
          options={['Active', 'Inactive']}
          selected={draftFilters.statuses}
          onChange={(statuses) => setDraftFilters((prev) => ({ ...prev, statuses: statuses as CompanyStatus[] }))}
        />

        <div>
          <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">Updated Between</h3>
          <div className="flex items-center gap-2">
            <TextInput
              type="date"
              value={draftFilters.updatedFrom}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, updatedFrom: e.target.value }))}
            />
            <span className="text-[var(--color-muted)]">to</span>
            <TextInput
              type="date"
              value={draftFilters.updatedTo}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, updatedTo: e.target.value }))}
            />
          </div>
        </div>

        <SearchSelect
          label="Updated By"
          placeholder="Search by name..."
          options={updatedByOptions}
          selected={draftFilters.updatedBy}
          onChange={(updatedBy) => setDraftFilters((prev) => ({ ...prev, updatedBy }))}
        />
      </Drawer>
    </div>
  )
}

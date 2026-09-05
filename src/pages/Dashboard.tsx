import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Users, Package, UserPlus, Shield } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { companies } from '../data/companies'
import { users } from '../data/users'
import { services } from '../data/services'
import { auditLog } from '../data/audit'
import { Button, Card, PageHeader } from '../components/ui'

function monthKey(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

/**
 * Cumulative companies/users onboarded per month, derived from the actual
 * dataset (each company's lastUpdated as an onboarding-date proxy, since
 * there's no separate "created" timestamp) rather than a hand-picked toy
 * series — so the chart tracks the real ~1,200 company / ~13,000 user scale.
 */
function useGrowthData() {
  return useMemo(() => {
    const userCountByCompany = new Map<string, number>()
    for (const u of users) {
      for (const m of u.memberships) {
        userCountByCompany.set(m.companyId, (userCountByCompany.get(m.companyId) ?? 0) + 1)
      }
    }

    const buckets = new Map<string, { companies: number; users: number }>()
    for (const c of companies) {
      const key = monthKey(c.lastUpdated)
      const bucket = buckets.get(key) ?? { companies: 0, users: 0 }
      bucket.companies += 1
      bucket.users += userCountByCompany.get(c.id) ?? 0
      buckets.set(key, bucket)
    }

    let cumulativeCompanies = 0
    let cumulativeUsers = 0
    return [...buckets.keys()].sort().map((key) => {
      const bucket = buckets.get(key)!
      cumulativeCompanies += bucket.companies
      cumulativeUsers += bucket.users
      return { month: monthLabel(key), companies: cumulativeCompanies, users: cumulativeUsers }
    })
  }, [])
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.max(1, Math.round(diffMs / 3_600_000))
  return `about ${hours} hour${hours === 1 ? '' : 's'} ago`
}

export function Dashboard() {
  const growthData = useGrowthData()

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your Qube Account system."
        actions={
          <>
            <Link to="/companies/new">
              <Button icon={<Building2 className="h-4 w-4" />}>Add Company</Button>
            </Link>
            <Link to="/portal-users">
              <Button variant="secondary" icon={<UserPlus className="h-4 w-4" />}>
                Manage Portal Users
              </Button>
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Total Companies</span>
            <Building2 className="h-5 w-5 text-[var(--color-teal)]" />
          </div>
          <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">
            {companies.length.toLocaleString()}
          </div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">All registered companies</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Total Users</span>
            <Users className="h-5 w-5 text-[var(--color-teal)]" />
          </div>
          <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">
            {users.length.toLocaleString()}
          </div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Across all companies and portal</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Active Services</span>
            <Package className="h-5 w-5 text-[var(--color-teal)]" />
          </div>
          <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">{services.length}</div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Currently in use</p>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Growth Trends</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Cumulative companies and users onboarded, {growthData[0]?.month}–{growthData[growthData.length - 1]?.month}
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growthData} margin={{ left: 4, right: 8 }}>
              <defs>
                <linearGradient id="companiesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c7c73" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1c7c73" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c89b3c" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#c89b3c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e1d6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6e6f76' }} stroke="#e5e1d6" interval="preserveStartEnd" />
              <YAxis yAxisId="companies" tick={{ fontSize: 12, fill: '#1c7c73' }} stroke="#e5e1d6" width={44} />
              <YAxis yAxisId="users" orientation="right" tick={{ fontSize: 12, fill: '#a67a26' }} stroke="#e5e1d6" width={50} />
              <Tooltip
                contentStyle={{ borderColor: '#e5e1d6', borderRadius: 8, fontSize: 13 }}
                formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area
                yAxisId="companies"
                type="monotone"
                dataKey="companies"
                name="companies"
                stroke="#1c7c73"
                fill="url(#companiesFill)"
                strokeWidth={2}
              />
              <Area
                yAxisId="users"
                type="monotone"
                dataKey="users"
                name="users"
                stroke="#c89b3c"
                fill="url(#usersFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Recent Activity</h2>
          <ul className="space-y-4">
            {auditLog.map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-teal)_10%,white)]">
                  <Shield className="h-4 w-4 text-[var(--color-teal)]" />
                </span>
                <div>
                  <p className="text-sm text-[var(--color-text)]">{entry.summary}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {timeAgo(entry.timestamp)}
                    {entry.actor !== 'System' && ` by ${entry.actor}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/companies/new">
            <Button variant="outline" icon={<Building2 className="h-4 w-4" />}>
              Add New Company
            </Button>
          </Link>
          <Link to="/portal-users">
            <Button variant="outline" icon={<UserPlus className="h-4 w-4" />}>
              Invite Portal User
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="outline" icon={<Package className="h-4 w-4" />}>
              View Services Catalog
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

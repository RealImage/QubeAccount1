import { Link } from 'react-router-dom'
import { Building2, Users, Package, UserPlus, Shield } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { companies } from '../data/companies'
import { users } from '../data/users'
import { services } from '../data/services'
import { auditLog } from '../data/audit'
import { Button, Card, PageHeader } from '../components/ui'

const growthData = [
  { month: 'January', companies: 180, users: 90 },
  { month: 'February', companies: 300, users: 210 },
  { month: 'March', companies: 260, users: 110 },
  { month: 'April', companies: 80, users: 190 },
  { month: 'May', companies: 210, users: 120 },
  { month: 'June', companies: 200, users: 140 },
]

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.max(1, Math.round(diffMs / 3_600_000))
  return `about ${hours} hour${hours === 1 ? '' : 's'} ago`
}

export function Dashboard() {
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
          <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">{companies.length}</div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">All registered companies</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted)]">Total Users</span>
            <Users className="h-5 w-5 text-[var(--color-teal)]" />
          </div>
          <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]">{users.length}</div>
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
          <p className="mb-4 text-sm text-[var(--color-muted)]">Company and User Growth Over Time</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e1d6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6e6f76' }} stroke="#e5e1d6" />
              <YAxis tick={{ fontSize: 12, fill: '#6e6f76' }} stroke="#e5e1d6" />
              <Tooltip contentStyle={{ borderColor: '#e5e1d6', borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="companies" name="companies" fill="#1c7c73" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" name="users" fill="#c89b3c" radius={[4, 4, 0, 0]} />
            </BarChart>
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

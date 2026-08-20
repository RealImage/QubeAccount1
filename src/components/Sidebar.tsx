import { NavLink } from 'react-router-dom'
import { LayoutGrid, Building2, Users, Package, Settings, Moon, LogOut } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/companies', label: 'Company Management', icon: Building2 },
  { to: '/portal-users', label: 'Portal Users', icon: Users },
  { to: '/services', label: 'Services', icon: Package },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-[var(--color-ink)] text-[var(--color-ink-muted)]">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--color-gold)] font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-gold)]">
          Q
        </span>
        <span className="font-[family-name:var(--font-display)] text-lg font-medium text-white">Qube Account</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-[var(--color-gold)] bg-[var(--color-ink-line)] text-white'
                  : 'border-transparent text-[var(--color-ink-muted)] hover:bg-[var(--color-ink-line)] hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-[var(--color-ink-line)] px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-ink-line)] hover:text-white">
          <Moon className="h-4 w-4" />
          Dark Mode
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-ink-line)] hover:text-white">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

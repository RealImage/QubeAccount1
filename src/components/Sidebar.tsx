import { NavLink } from 'react-router-dom'
import { LayoutGrid, Building2, Users, Package, Settings, Moon, LogOut, SquaresIntersect } from 'lucide-react'
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
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2 px-5 py-6">
        <SquaresIntersect className="h-6 w-6 text-blue-500" />
        <span className="text-lg font-bold text-blue-500">Qube Account</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-slate-800 px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
          <Moon className="h-4 w-4" />
          Dark Mode
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}

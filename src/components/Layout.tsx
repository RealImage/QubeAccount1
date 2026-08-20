import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <header className="flex justify-end border-b border-slate-200 bg-white px-8 py-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-900" />
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

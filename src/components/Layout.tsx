import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] font-[family-name:var(--font-sans)]">
      <Sidebar />
      <div className="flex-1">
        <header className="flex justify-end border-b border-[var(--color-line)] bg-[var(--color-surface)] px-8 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-teal)] font-[family-name:var(--font-display)] text-sm font-medium text-white">
            N
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

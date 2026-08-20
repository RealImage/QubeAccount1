import type { ReactNode } from 'react'
import clsx from 'clsx'

export function StatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Pending' }) {
  const styles: Record<string, string> = {
    Active: 'bg-emerald-500 text-white',
    Inactive: 'bg-red-500 text-white',
    Pending: 'bg-amber-400 text-amber-950',
  }
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}>
      {status}
    </span>
  )
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-white">
      {children}
    </span>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-lg border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  icon,
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  onClick?: () => void
  type?: 'button' | 'submit'
  icon?: ReactNode
}) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-600 text-white hover:bg-slate-700',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        styles[variant],
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-slate-700">{children}</label>
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        props.className,
      )}
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={clsx(
        'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        props.className,
      )}
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        props.className,
      )}
    />
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="mb-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </Card>
  )
}

export function Field({ full, children }: { full?: boolean; children: ReactNode }) {
  return <div className={clsx(full && 'md:col-span-2')}>{children}</div>
}

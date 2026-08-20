import type { ReactNode } from 'react'
import clsx from 'clsx'

export function StatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Pending' }) {
  const styles: Record<string, string> = {
    Active: 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-[var(--color-success)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-success)_30%,white)]',
    Inactive: 'bg-[color-mix(in_srgb,var(--color-danger)_14%,white)] text-[var(--color-danger)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-danger)_30%,white)]',
    Pending: 'bg-[color-mix(in_srgb,var(--color-warning)_16%,white)] text-[var(--color-warning)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-warning)_32%,white)]',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-ink)] px-3 py-1 font-mono text-xs text-white">
      {children}
    </span>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6', className)}>
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
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--color-text)]" style={{ textWrap: 'balance' }}>
          {title}
        </h1>
        {description && <p className="mt-1.5 text-[var(--color-muted)]">{description}</p>}
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
    primary: 'bg-[var(--color-teal)] text-white hover:bg-[var(--color-teal-strong)]',
    secondary: 'bg-[var(--color-ink)] text-white hover:bg-[color-mix(in_srgb,var(--color-ink)_85%,white)]',
    outline: 'border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-teal)]',
        styles[variant],
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">{children}</label>
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal)]',
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
        'w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal)]',
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
        'w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--color-teal)]',
        props.className,
      )}
    />
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="mb-6">
      <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </Card>
  )
}

export function Field({ full, children }: { full?: boolean; children: ReactNode }) {
  return <div className={clsx(full && 'md:col-span-2')}>{children}</div>
}

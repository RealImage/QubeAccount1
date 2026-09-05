import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'

export function StatusBadge({ status }: { status: 'Active' | 'Inactive' | 'Pending' | 'Invited' }) {
  const styles: Record<string, string> = {
    Active: 'bg-[color-mix(in_srgb,var(--color-success)_14%,white)] text-[var(--color-success)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-success)_30%,white)]',
    Inactive: 'bg-[color-mix(in_srgb,var(--color-danger)_14%,white)] text-[var(--color-danger)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-danger)_30%,white)]',
    Pending: 'bg-[color-mix(in_srgb,var(--color-warning)_16%,white)] text-[var(--color-warning)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-warning)_32%,white)]',
    Invited: 'bg-[color-mix(in_srgb,var(--color-warning)_16%,white)] text-[var(--color-warning)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-warning)_32%,white)]',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', styles[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export function EligibilityBadge({ eligibility }: { eligibility: 'all' | 'internal' }) {
  return eligibility === 'internal' ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-gold)_16%,white)] px-2.5 py-0.5 text-xs font-medium text-[color-mix(in_srgb,var(--color-gold)_70%,black)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-gold)_35%,white)]">
      Internal
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-teal)_10%,white)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-teal-strong)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-teal)_25%,white)]">
      All
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

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-ink)_55%,transparent)] p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Bottom-right auto-dismissing confirmation toast. Renders nothing while `message` is null. */
export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3500)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-ink)] px-4 py-3 text-sm font-medium text-white shadow-lg">
      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--color-teal)]" />
      {message}
    </div>
  )
}

/** Paginates `items` client-side; resets to page 1 whenever the item set changes (e.g. a filter). */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const clampedPage = Math.min(page, pageCount)

  useEffect(() => {
    setPage(1)
  }, [items])

  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, clampedPage, pageSize])

  return { page: clampedPage, pageCount, setPage, pageItems }
}

export function Pagination({
  page,
  pageCount,
  onChange,
  totalLabel,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
  totalLabel?: string
}) {
  if (pageCount <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-[var(--color-muted)]">{totalLabel}</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={clsx(
              'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium',
              p === page
                ? 'bg-[var(--color-teal)] text-white'
                : 'border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)]',
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal)] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

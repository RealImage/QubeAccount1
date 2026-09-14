import { useMemo, useState } from 'react'
import { Download, Upload, UserPlus } from 'lucide-react'
import { useStore } from '../data/store'
import { serviceById } from '../data/services'
import { toCSV, downloadCSV, parseCSVWithHeader, pickCSVFile } from '../utils/csv'
import type { User } from '../data/types'
import {
  ActionMenu,
  Button,
  Field,
  FieldLabel,
  Modal,
  PageHeader,
  Pagination,
  Select,
  StatusBadge,
  TextInput,
  Toast,
  usePagination,
} from '../components/ui'

const PAGE_SIZE = 5
const COMPANY_MANAGEMENT_SERVICE_ID = 'company-management'

export function PortalUsers() {
  const { users, invitePortalUser, setUserActive, forcePasswordReset } = useStore()
  const portal = useMemo(() => users.filter((u) => u.isPortalUser), [users])
  const { page, pageCount, setPage, pageItems } = usePagination(portal, PAGE_SIZE)

  const companyManagementRoles = serviceById(COMPANY_MANAGEMENT_SERVICE_ID)?.roles ?? []

  const [inviteOpen, setInviteOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState(companyManagementRoles[0]?.id ?? '')
  const [toast, setToast] = useState<string | null>(null)

  function openInvite() {
    setEmail('')
    setRoleId(companyManagementRoles[0]?.id ?? '')
    setInviteOpen(true)
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    invitePortalUser(email.trim(), roleId)
    setInviteOpen(false)
    setToast(`Invitation sent to ${email.trim()}.`)
  }

  function handleToggleActive(user: User) {
    setUserActive(user.id, !user.active)
    setToast(`${user.name} ${user.active ? 'deactivated' : 'activated'}.`)
  }

  function handleSendResetLink(user: User) {
    forcePasswordReset(user.id)
    setToast(`Password reset link sent to ${user.email}.`)
  }

  function handleExport() {
    const csv = toCSV(portal, [
      { key: 'name', header: 'Name', value: (u: User) => u.name },
      { key: 'email', header: 'Email', value: (u: User) => u.email },
      {
        key: 'role',
        header: 'Role',
        value: (u: User) =>
          u.memberships
            .flatMap((m) => m.roleAssignments)
            .find((r) => r.serviceId === COMPANY_MANAGEMENT_SERVICE_ID)?.roleId ?? '',
      },
      { key: 'status', header: 'Status', value: (u: User) => (u.active ? 'Active' : 'Inactive') },
    ])
    downloadCSV(`portal-users-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  async function handleImport() {
    const text = await pickCSVFile()
    if (!text) return
    const rows = parseCSVWithHeader(text)
    const seen = new Set<string>()
    let count = 0
    for (const row of rows) {
      const rowEmail = (row.email ?? row.Email ?? '').trim().toLowerCase()
      if (!rowEmail || seen.has(rowEmail)) continue
      seen.add(rowEmail)
      const rowRole = (row.role ?? row.Role ?? companyManagementRoles[0]?.id ?? '').trim()
      invitePortalUser(rowEmail, rowRole)
      count++
    }
    setToast(count > 0 ? `Invited ${count} portal user(s) from CSV.` : 'No valid rows found in that file.')
  }

  return (
    <div>
      <PageHeader
        title="Portal Users"
        description="Internal @qubecinema.com staff with Company Management access (spec §7)."
        actions={
          <>
            <Button variant="outline" icon={<Upload className="h-4 w-4" />} onClick={handleImport}>
              Import CSV
            </Button>
            <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
              Export CSV
            </Button>
            <Button icon={<UserPlus className="h-4 w-4" />} onClick={openInvite}>
              Invite Portal User
            </Button>
          </>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {pageItems.map((u) => {
              const assignment = u.memberships
                .flatMap((m) => m.roleAssignments)
                .find((r) => r.serviceId === COMPANY_MANAGEMENT_SERVICE_ID)
              return (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium text-[var(--color-text)]">{u.name}</td>
                  <td className="px-6 py-4 text-[var(--color-muted)]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-[var(--color-ink)] px-2.5 py-0.5 text-xs text-white">
                      {assignment?.roleId ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={!u.active ? 'Inactive' : assignment?.inviteStatus === 'Accepted' ? 'Active' : 'Invited'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionMenu
                      items={[
                        { label: 'Send Password Reset Link', onSelect: () => handleSendResetLink(u) },
                        {
                          label: u.active ? 'Deactivate Portal User' : 'Activate Portal User',
                          onSelect: () => handleToggleActive(u),
                          destructive: u.active,
                        },
                      ]}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={setPage}
        totalLabel={`Showing ${pageItems.length ? (page - 1) * PAGE_SIZE + 1 : 0}–${(page - 1) * PAGE_SIZE + pageItems.length} of ${portal.length} portal users`}
      />

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Portal User">
        <form onSubmit={handleInvite}>
          <div className="space-y-4">
            <Field>
              <FieldLabel>Email ID</FieldLabel>
              <TextInput
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@qubecinema.com"
              />
            </Field>
            <Field>
              <FieldLabel>Service Role</FieldLabel>
              <Select value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                {companyManagementRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Invite</Button>
          </div>
        </form>
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

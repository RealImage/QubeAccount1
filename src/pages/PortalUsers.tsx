import { UserPlus } from 'lucide-react'
import { useStore } from '../data/store'
import { Button, PageHeader, StatusBadge } from '../components/ui'

export function PortalUsers() {
  const { users } = useStore()
  const portal = users.filter((u) => u.isPortalUser)

  return (
    <div>
      <PageHeader
        title="Portal Users"
        description="Internal @qubecinema.com staff with Company Management access (spec §7)."
        actions={<Button icon={<UserPlus className="h-4 w-4" />}>Invite Portal User</Button>}
      />

      <div className="overflow-x-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-line)] text-[var(--color-muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {portal.map((u) => {
              const assignment = u.memberships
                .flatMap((m) => m.roleAssignments)
                .find((r) => r.serviceId === 'company-management')
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
                    <StatusBadge status={assignment?.inviteStatus === 'Accepted' ? 'Active' : 'Pending'} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

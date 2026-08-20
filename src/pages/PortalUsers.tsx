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

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {portal.map((u) => {
              const assignment = u.memberships
                .flatMap((m) => m.roleAssignments)
                .find((r) => r.serviceId === 'company-management')
              return (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-white">
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

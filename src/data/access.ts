// Access-control model, per spec §3 and §5.3.
//
// Fundamental rule (§3.1): a user has access to a service only if all three
// hold simultaneously — company membership, company subscription to the
// service, and an assigned role in that service.
//
// Effective access table (§5.3):
//   Company Active + Invite Accepted + Role Assigned -> Allowed
//   Company Active + Invite Pending  + Role Assigned -> Not yet allowed
//   Company Inactive (any invite state)              -> Denied

import type { Company, RoleAssignment, User } from './types'

export type EffectiveAccess = 'allowed' | 'pending' | 'denied'

export function effectiveAccess(
  company: Company | undefined,
  assignment: RoleAssignment | undefined,
): EffectiveAccess {
  if (!company || !assignment) return 'denied'
  if (company.status === 'Inactive') return 'denied'
  if (!company.subscribedServiceIds.includes(assignment.serviceId)) return 'denied'
  return assignment.inviteStatus === 'Accepted' ? 'allowed' : 'pending'
}

export function userAccessForCompany(user: User, companyId: string) {
  return user.memberships.find((m) => m.companyId === companyId)
}

export function servicesForUserInCompany(
  user: User,
  company: Company,
): Array<{ assignment: RoleAssignment; access: EffectiveAccess }> {
  const membership = userAccessForCompany(user, company.id)
  if (!membership) return []
  return membership.roleAssignments.map((assignment) => ({
    assignment,
    access: effectiveAccess(company, assignment),
  }))
}

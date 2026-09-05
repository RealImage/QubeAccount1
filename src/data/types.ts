// Core domain types for Qube Account, per spec §2 (Draft v0.2).
// Identity/authentication (Entra/Descope) is out of scope — these types
// model only the authorization layer Qube Account owns.

export type CompanyStatus = 'Active' | 'Inactive'

export type CompanyType = 'External' | 'Internal'

export interface Company {
  id: string
  legalName: string
  displayName: string
  code: string
  uuid: string
  logoUrl: string
  status: CompanyStatus
  type: CompanyType
  contactEmail: string
  contactPhone: string
  website: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  emailDomains: string[]
  excludedDomains: string[]
  onlyDomainUser: boolean
  autoAddDomainUsers: boolean
  billingInfo: string
  deliveryInfo: string
  notes: string
  subscribedServiceIds: string[]
  lastUpdated: string
  updatedBy: string
}

// Every product's set of "products" and their offered services, per spec §2.3.
// `eligibility` mirrors the spec table split: services any company type can
// subscribe to, vs. services restricted to Internal companies.
export type ServiceEligibility = 'all' | 'internal'

export interface ServiceRole {
  id: string
  name: string
  description: string
  status: 'Active' | 'Inactive'
  // Which company types this role can be assigned to — independent of, and
  // never broader than, the parent Service's own `eligibility`. Most roles
  // are 'all'; a service's more privileged roles (e.g. Admin) are typically
  // restricted to 'internal'.
  eligibility: ServiceEligibility
  updatedOn: string
  updatedBy: string
}

export interface Service {
  id: string
  product: string
  name: string
  description: string
  accessUrl: string
  eligibility: ServiceEligibility
  uuid: string
  clientId: string
  lastUpdated: string
  roles: ServiceRole[]
}

// Invite acceptance state, per spec §4.2/§5.3. A role assignment only grants
// effective access once the invite is accepted and the company is active.
export type InviteStatus = 'Pending' | 'Accepted'

export interface RoleAssignment {
  serviceId: string
  roleId: string
  inviteStatus: InviteStatus
}

export interface CompanyMembership {
  companyId: string
  roleAssignments: RoleAssignment[]
}

export interface User {
  id: string
  name: string
  email: string
  memberships: CompanyMembership[]
  // Portal Users: internal @qubecinema.com staff with Company Management
  // access (spec §7), distinct from regular company users.
  isPortalUser: boolean
  // Admin-initiated deactivation of the user themselves, independent of
  // company status (§5.1) and invite acceptance (§5.3) — an internal admin
  // can suspend one user's access without touching the company or their
  // role assignments. Defaults to true (active) for all seed users.
  active: boolean
}

export type AuditAction =
  | 'user_invited'
  | 'invite_accepted'
  | 'user_added_to_company'
  | 'role_assigned'
  | 'role_updated'
  | 'role_removed'
  | 'subscription_added'
  | 'subscription_removed'
  | 'company_deactivated'
  | 'company_reactivated'

export interface AuditEntry {
  id: string
  action: AuditAction
  actor: string
  targetUser?: string
  companyId?: string
  serviceId?: string
  timestamp: string
  summary: string
}

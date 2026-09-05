import type { RoleAssignment, User } from './types'
import { companies } from './companies'
import { serviceById } from './services'
import { chance, pick, randInt } from './generate'

// Total active user count the product runs at (~13,000, well above the
// ~1,200 company count) per product guidance. A handful of hand-authored
// "flagship" users below stay first for a recognizable demo; the rest are
// generated deterministically, distributed across the generated companies.
const TARGET_TOTAL_USERS = 13000

const flagshipUsers: User[] = [
  {
    id: 'u-alice',
    name: 'Alice Smith',
    email: 'alice.smith@warnerbrosentertainment.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-warner',
        roleAssignments: [
          { serviceId: 'cinemasdb-admin', roleId: 'user', inviteStatus: 'Accepted' },
          { serviceId: 'qube-account', roleId: 'user', inviteStatus: 'Accepted' },
        ],
      },
    ],
  },
  {
    id: 'u-bob',
    name: 'Bob Jones',
    email: 'bob.jones@a24films.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-a24',
        roleAssignments: [
          { serviceId: 'icount', roleId: 'user', inviteStatus: 'Accepted' },
          { serviceId: 'moviebuff', roleId: 'viewer', inviteStatus: 'Accepted' },
          { serviceId: 'qube-account', roleId: 'user', inviteStatus: 'Accepted' },
        ],
      },
    ],
  },
  {
    id: 'u-charlie',
    name: 'Charlie Williams',
    email: 'charlie.williams@a24films.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-a24',
        roleAssignments: [
          { serviceId: 'moviebuff', roleId: 'user', inviteStatus: 'Accepted' },
          { serviceId: 'qube-account', roleId: 'user', inviteStatus: 'Accepted' },
        ],
      },
    ],
  },
  {
    id: 'u-quentin',
    name: 'Quentin Garcia',
    email: 'quentin.garcia@warnerbrosentertainment.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-warner',
        roleAssignments: [{ serviceId: 'cinemasdb-admin', roleId: 'user', inviteStatus: 'Accepted' }],
      },
    ],
  },
  {
    id: 'u-george',
    name: 'George White',
    email: 'george.white1@warnerbrosentertainment.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-warner',
        roleAssignments: [{ serviceId: 'cinemasdb-admin', roleId: 'admin', inviteStatus: 'Pending' }],
      },
    ],
  },
  {
    id: 'u-julia-t',
    name: 'Julia Thompson',
    email: 'julia.thompson1@warnerbrosentertainment.com',
    isPortalUser: false,
    active: true,
    memberships: [
      {
        companyId: 'c-warner',
        roleAssignments: [{ serviceId: 'cinemasdb-admin', roleId: 'user', inviteStatus: 'Accepted' }],
      },
    ],
  },
  {
    id: 'u-peter',
    name: 'Peter Pan',
    email: 'peter.pan@qubecinema.com',
    isPortalUser: true,
    active: true,
    memberships: [
      {
        companyId: 'c-qube-internal',
        roleAssignments: [
          { serviceId: 'company-management', roleId: 'admin', inviteStatus: 'Accepted' },
          { serviceId: 'qube-account', roleId: 'admin', inviteStatus: 'Accepted' },
        ],
      },
    ],
  },
  {
    id: 'u-nina',
    name: 'Nina Rao',
    email: 'nina.rao@qubecinema.com',
    isPortalUser: true,
    active: true,
    memberships: [
      {
        companyId: 'c-qube-internal',
        roleAssignments: [
          { serviceId: 'company-management', roleId: 'user', inviteStatus: 'Accepted' },
          { serviceId: 'qube-account', roleId: 'user', inviteStatus: 'Accepted' },
        ],
      },
    ],
  },
]

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
  'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen',
  'Priya', 'Wei', 'Fatima', 'Diego', 'Yuki', 'Amara', 'Liam', 'Noah', 'Emma', 'Olivia',
  'Aiden', 'Sophia', 'Lucas', 'Isabella', 'Mason', 'Mia', 'Ethan', 'Ava', 'Arjun', 'Sofia',
  'Kwame', 'Chidi', 'Hana', 'Mateus', 'Ingrid', 'Rohan', 'Zara', 'Leilani', 'Omar', 'Nadia',
] as const

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Patel', 'Chen', 'Kim', 'Nguyen', 'Singh', 'Khan', 'Ali', 'Silva', 'Costa', 'Rossi',
  'Muller', 'Schmidt', 'Dubois', 'Ivanov', 'Kowalski', 'Tanaka', 'Suzuki', 'Park', 'Osei', 'Mensah',
] as const

function generateRoleAssignments(companyId: string): RoleAssignment[] {
  const company = companies.find((c) => c.id === companyId)
  if (!company || company.subscribedServiceIds.length === 0) return []
  const serviceCount = Math.min(company.subscribedServiceIds.length, randInt(1, 2))
  const chosenServiceIds = [...company.subscribedServiceIds].sort(() => randInt(-1, 1)).slice(0, serviceCount)

  return chosenServiceIds
    .map((serviceId): RoleAssignment | null => {
      const service = serviceById(serviceId)
      const eligibleRoles = service?.roles.filter((r) => r.eligibility === 'all') ?? []
      if (eligibleRoles.length === 0) return null
      return {
        serviceId,
        roleId: pick(eligibleRoles).id,
        inviteStatus: chance(0.9) ? 'Accepted' : 'Pending',
      }
    })
    .filter((a): a is RoleAssignment => a !== null)
}

function generateUsersForCompany(companyId: string, count: number, startIndex: number): User[] {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const company = companies.find((c) => c.id === companyId)
    const domain = company?.emailDomains[0] ?? 'example.com'
    return {
      id: `u-gen-${index}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@${domain}`,
      isPortalUser: false,
      active: chance(0.97),
      memberships: [{ companyId, roleAssignments: generateRoleAssignments(companyId) }],
    }
  })
}

const generatedCompanyIds = companies.filter((c) => c.id.startsWith('c-gen-')).map((c) => c.id)
const remainingUserCount = TARGET_TOTAL_USERS - flagshipUsers.length
const usersPerCompany = Math.max(1, Math.round(remainingUserCount / generatedCompanyIds.length))

let cursor = 0
const generatedUsers: User[] = generatedCompanyIds.flatMap((companyId) => {
  const count = randInt(Math.max(1, usersPerCompany - 5), usersPerCompany + 5)
  const batch = generateUsersForCompany(companyId, count, cursor)
  cursor += count
  return batch
})

export const users: User[] = [...flagshipUsers, ...generatedUsers]

export function usersForCompany(companyId: string) {
  return users.filter((u) => u.memberships.some((m) => m.companyId === companyId))
}

export function portalUsers() {
  return users.filter((u) => u.isPortalUser)
}

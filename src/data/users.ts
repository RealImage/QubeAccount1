import type { User } from './types'

export const users: User[] = [
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

export function usersForCompany(companyId: string) {
  return users.filter((u) => u.memberships.some((m) => m.companyId === companyId))
}

export function portalUsers() {
  return users.filter((u) => u.isPortalUser)
}

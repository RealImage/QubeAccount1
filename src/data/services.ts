import type { Service, ServiceEligibility } from './types'

// Service catalog per spec §2.3. Flagged in spec §8 as an open item pending
// confirmation with product owners — the full list is included here per the
// spec's stated decision to keep it, not the narrower v1 list.
//
// Roles carry their own eligibility, independent of the service's: Admin is
// internal-only (only Qube staff administer a service on a company's behalf),
// while User and Viewer are open to any eligible company. When the service
// itself is internal-only, every role is forced to internal too — a role
// can never be more permissive than its parent service.
function stdRoles(updatedOn: string, serviceEligibility: ServiceEligibility): Service['roles'] {
  const cap = (roleEligibility: ServiceEligibility): ServiceEligibility =>
    serviceEligibility === 'internal' ? 'internal' : roleEligibility

  return [
    { id: 'admin', name: 'Admin', description: 'Standard admin role for this service.', status: 'Active', eligibility: cap('internal'), updatedOn, updatedBy: 'System' },
    { id: 'user', name: 'User', description: 'Standard user role for this service.', status: 'Active', eligibility: cap('all'), updatedOn, updatedBy: 'System' },
    { id: 'viewer', name: 'Viewer', description: 'Standard viewer role for this service.', status: 'Active', eligibility: cap('all'), updatedOn, updatedBy: 'System' },
  ]
}

const NOW = 'Aug 20, 2026, 7:31 AM'

export const services: Service[] = [
  // All company types
  { id: 'qw-distributor', product: 'Qube Wire', name: 'Qube Wire Distributor', description: 'Qube Wire access for distributors.', accessUrl: 'distributors.qubewire.com', eligibility: 'all', uuid: 'uuid-qwd-001', clientId: 'qwd-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'qw-exhibitor', product: 'Qube Wire', name: 'Qube Wire Exhibitor', description: 'Qube Wire access for exhibitors.', accessUrl: 'cinemas.qubewire.com', eligibility: 'all', uuid: 'uuid-qwe-002', clientId: 'qwe-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'qw-partner', product: 'Qube Wire', name: 'Qube Wire Partner', description: 'Qube Wire access for partners.', accessUrl: 'partner.qubewire.com', eligibility: 'all', uuid: 'uuid-qwp-003', clientId: 'qwp-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'icount', product: 'iCount', name: 'iCount Exhibitor', description: 'Service for tracking and reporting box office admissions and related data.', accessUrl: 'app.icount.com', eligibility: 'all', uuid: 'uuid-icnt-007', clientId: 'icnt-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'moviebuff', product: 'MovieBuff', name: 'MovieBuff Access', description: 'MovieBuff data access for eligible companies.', accessUrl: 'access.moviebuff.com', eligibility: 'all', uuid: 'uuid-mbf-004', clientId: 'mbf-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'slate-media', product: 'Slate', name: 'Slate Media Company', description: 'Slate access for media companies.', accessUrl: 'qubeslate.com', eligibility: 'all', uuid: 'uuid-slt-005', clientId: 'slt-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'cheers-exhibitor', product: 'Cheers', name: 'Cheers Exhibitor', description: 'Cheers access for exhibitors.', accessUrl: 'cheers.qubecinema.com', eligibility: 'all', uuid: 'uuid-chr-006', clientId: 'chr-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'dc-distributor', product: 'DigitalCinema.in', name: 'DC Distributor', description: 'DigitalCinema.in access for distributors.', accessUrl: 'digitalcinema.in', eligibility: 'all', uuid: 'uuid-dcd-008', clientId: 'dcd-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'dc-exhibitor', product: 'DigitalCinema.in', name: 'DC Exhibitor', description: 'DigitalCinema.in access for exhibitors.', accessUrl: 'digitalcinema.in', eligibility: 'all', uuid: 'uuid-dce-009', clientId: 'dce-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'dc-integrator', product: 'DigitalCinema.in', name: 'DC Integrator', description: 'DigitalCinema.in access for integrators.', accessUrl: 'digitalcinema.in', eligibility: 'all', uuid: 'uuid-dci-010', clientId: 'dci-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'mw-distributor', product: 'Movie Wire', name: 'MW Distributor', description: 'Movie Wire access for distributors.', accessUrl: 'moviewire.com', eligibility: 'all', uuid: 'uuid-mwd-011', clientId: 'mwd-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'mw-exhibitor', product: 'Movie Wire', name: 'MW Exhibitor', description: 'Movie Wire access for exhibitors.', accessUrl: 'moviewire.com', eligibility: 'all', uuid: 'uuid-mwe-012', clientId: 'mwe-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'qube-account', product: 'Qube Account', name: 'Qube Account', description: 'Base login/profile access for Qube Account.', accessUrl: 'account.qubecinema.com', eligibility: 'all', uuid: 'uuid-qa-013', clientId: 'qa-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },
  { id: 'qube-cinemas', product: 'Qube Cinemas', name: 'Qube Cinemas', description: 'Qube Cinemas exhibitor access.', accessUrl: 'notpublic.qubecinema.com', eligibility: 'all', uuid: 'uuid-qc-014', clientId: 'qc-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'all') },

  // Internal-only
  { id: 'qw-admin', product: 'Qube Wire', name: 'Qube Wire Admin', description: 'Internal admin console for Qube Wire.', accessUrl: 'admin.qubewire.com', eligibility: 'internal', uuid: 'uuid-qwa-101', clientId: 'qwa-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'icount-admin', product: 'iCount', name: 'iCount Admin', description: 'Internal admin console for iCount.', accessUrl: 'admin.icount.com', eligibility: 'internal', uuid: 'uuid-icnta-102', clientId: 'icnta-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'cinemasdb-admin', product: 'CinemasDB', name: 'CinemasDB Admin', description: 'Internal admin console for CinemasDB.', accessUrl: 'admin.cinemasdb.com', eligibility: 'internal', uuid: 'uuid-cdb-103', clientId: 'cdb-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'slate-admin', product: 'Slate', name: 'Slate Admin', description: 'Internal admin console for Slate.', accessUrl: 'admin.qubeslate.com', eligibility: 'internal', uuid: 'uuid-slta-104', clientId: 'slta-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'cheers-admin', product: 'Cheers', name: 'Cheers Admin', description: 'Internal admin console for Cheers.', accessUrl: 'admin.cheers.qubecinema.com', eligibility: 'internal', uuid: 'uuid-chra-105', clientId: 'chra-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'slydes-admin', product: 'Slydes', name: 'Slydes Admin', description: 'Internal admin console for Slydes.', accessUrl: 'admin.slydes.com', eligibility: 'internal', uuid: 'uuid-syda-106', clientId: 'syda-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'dc-admin', product: 'DigitalCinema.in', name: 'DC Admin', description: 'Internal admin console for DigitalCinema.in.', accessUrl: 'admin.digitalcinema.in', eligibility: 'internal', uuid: 'uuid-dca-107', clientId: 'dca-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'mw-admin', product: 'Movie Wire', name: 'MW Admin', description: 'Internal admin console for Movie Wire.', accessUrl: 'admin.moviewire.com', eligibility: 'internal', uuid: 'uuid-mwa-108', clientId: 'mwa-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
  { id: 'company-management', product: 'Qube Account', name: 'Company Management', description: 'Internal control plane for managing companies, users, and subscriptions across all of Qube.', accessUrl: 'account.qubecinema.com/admin', eligibility: 'internal', uuid: 'uuid-cm-109', clientId: 'cm-app-client', lastUpdated: NOW, roles: stdRoles(NOW, 'internal') },
]

export function serviceById(id: string) {
  return services.find((s) => s.id === id)
}

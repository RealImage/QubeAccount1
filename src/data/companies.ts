import type { Company } from './types'
import { chance, pick, pickN, randInt } from './generate'

// Total active company count the product runs at (~1200), per product
// guidance. A handful of hand-authored "flagship" companies below stay
// first for a recognizable demo; the rest are generated deterministically.
const TOTAL_COMPANIES = 1200

const flagshipCompanies: Company[] = [
  {
    id: 'c-warner',
    legalName: 'Warner Bros. Entertainment',
    displayName: 'Warner Bros.',
    code: 'WAR100',
    uuid: 'uuid-c7972f3987165-0',
    logoUrl: '',
    status: 'Inactive',
    type: 'External',
    contactEmail: 'contact@warnerbrosentertainment.com',
    contactPhone: '555-1000',
    website: 'https://warnerbrosentertainment.com',
    address: { street: '100 Main St', city: 'Burbank', state: 'CA', zip: '90000', country: 'USA' },
    emailDomains: ['warnerbrosentertainment.com', 'corp.warnerbrosentertainment.org'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: true,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['cinemasdb-admin', 'qube-account'],
    lastUpdated: 'Aug 20, 2026',
  },
  {
    id: 'c-a24',
    legalName: 'A24 Films LLC',
    displayName: 'A24 Films',
    code: 'A24001',
    uuid: 'uuid-a24-001',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: 'contact@a24films.com',
    contactPhone: '555-2000',
    website: 'https://a24films.com',
    address: { street: '31 Peck Slip', city: 'New York', state: 'NY', zip: '10038', country: 'USA' },
    emailDomains: ['a24films.com'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: false,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['icount', 'moviebuff', 'qube-account'],
    lastUpdated: 'Aug 19, 2026',
  },
  {
    id: 'c-studiocanal',
    legalName: 'StudioCanal S.A.',
    displayName: 'StudioCanal',
    code: 'SCN001',
    uuid: 'uuid-scn-001',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: 'contact@studiocanal.com',
    contactPhone: '555-3000',
    website: 'https://studiocanal.com',
    address: { street: '1 Place du Spectacle', city: 'Los Angeles', state: 'CA', zip: '90028', country: 'USA' },
    emailDomains: ['studiocanal.com'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: false,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['moviebuff', 'qube-cinemas', 'qube-account', 'icount'],
    lastUpdated: 'Aug 18, 2026',
  },
  {
    id: 'c-pixar',
    legalName: 'Pixar Animation Studios',
    displayName: 'Pixar Animation',
    code: 'PIX001',
    uuid: 'uuid-pix-001',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: 'contact@pixar.com',
    contactPhone: '555-4000',
    website: 'https://pixar.com',
    address: { street: '1200 Park Ave', city: 'London', state: '', zip: '', country: 'UK' },
    emailDomains: ['pixar.com'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: false,
    autoAddDomainUsers: false,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['qube-cinemas', 'qube-account'],
    lastUpdated: 'Aug 17, 2026',
  },
  {
    id: 'c-universal',
    legalName: 'Universal Pictures',
    displayName: 'Universal Pictures',
    code: 'UNI001',
    uuid: 'uuid-uni-001',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: 'contact@universalpictures.com',
    contactPhone: '555-5000',
    website: 'https://universalpictures.com',
    address: { street: '100 Universal City Plaza', city: 'Paris', state: '', zip: '', country: 'France' },
    emailDomains: ['universalpictures.com'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: false,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['slate-media', 'qw-admin', 'icount'],
    lastUpdated: 'Aug 16, 2026',
  },
  {
    id: 'c-neon',
    legalName: 'Neon Rated LLC',
    displayName: 'Neon',
    code: 'NEO001',
    uuid: 'uuid-neo-001',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: 'contact@neonrated.com',
    contactPhone: '555-6000',
    website: 'https://neonrated.com',
    address: { street: '150 W 22nd St', city: 'Toronto', state: 'ON', zip: '', country: 'Canada' },
    emailDomains: ['neonrated.com'],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: false,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: ['qw-admin', 'qw-distributor', 'icount', 'moviebuff'],
    lastUpdated: 'Aug 15, 2026',
  },
  {
    id: 'c-qube-internal',
    legalName: 'Qube Cinema Technologies Pvt. Ltd.',
    displayName: 'Qube Cinema (Internal)',
    code: 'QUBE001',
    uuid: 'uuid-qube-001',
    logoUrl: '',
    status: 'Active',
    type: 'Internal',
    contactEmail: 'it@qubecinema.com',
    contactPhone: '555-9000',
    website: 'https://qubecinema.com',
    address: { street: '', city: 'Chennai', state: '', zip: '', country: 'India' },
    emailDomains: ['qubecinema.com'],
    excludedDomains: [],
    onlyDomainUser: true,
    autoAddDomainUsers: true,
    billingInfo: '',
    deliveryInfo: '',
    notes: 'Internal company — Company Management access is restricted to members of this company (spec §7).',
    subscribedServiceIds: ['company-management', 'qube-account', 'qw-admin', 'icount-admin', 'cinemasdb-admin'],
    lastUpdated: 'Aug 20, 2026',
  },
]

const NAME_PREFIXES = [
  'Silver', 'Golden', 'Northern', 'Pacific', 'Atlantic', 'Summit', 'Horizon', 'Crescent', 'Union', 'Metro',
  'Cascade', 'Vantage', 'Lumina', 'Apex', 'Frontier', 'Continental', 'Regal', 'Meridian', 'Solstice', 'Harbor',
  'Ember', 'Vista', 'Cobalt', 'Amber', 'Ridgeline', 'Sable', 'Falcon', 'Marble', 'Ironwood', 'Blue Ridge',
  'Redwood', 'Compass', 'Lantern', 'Northstar', 'Wavelength', 'Kindred', 'Beacon', 'Anchor', 'Skyline', 'Granite',
] as const

const NAME_SUFFIXES = [
  'Pictures', 'Studios', 'Media', 'Entertainment', 'Cinemas', 'Films', 'Motion Pictures', 'Screen Works',
  'Vision Media', 'Reel Works', 'Productions', 'Distribution', 'Digital Cinema', 'Film Group', 'Cinema Partners',
] as const

const LEGAL_SUFFIXES = ['Inc.', 'LLC', 'Ltd.', 'Group', 'Holdings', 'Co.'] as const

const CITIES: Array<{ city: string; state: string; country: string }> = [
  { city: 'Los Angeles', state: 'CA', country: 'USA' },
  { city: 'New York', state: 'NY', country: 'USA' },
  { city: 'Atlanta', state: 'GA', country: 'USA' },
  { city: 'Chicago', state: 'IL', country: 'USA' },
  { city: 'Austin', state: 'TX', country: 'USA' },
  { city: 'Toronto', state: 'ON', country: 'Canada' },
  { city: 'Vancouver', state: 'BC', country: 'Canada' },
  { city: 'London', state: '', country: 'UK' },
  { city: 'Manchester', state: '', country: 'UK' },
  { city: 'Paris', state: '', country: 'France' },
  { city: 'Berlin', state: '', country: 'Germany' },
  { city: 'Madrid', state: '', country: 'Spain' },
  { city: 'Rome', state: '', country: 'Italy' },
  { city: 'Mumbai', state: 'MH', country: 'India' },
  { city: 'Chennai', state: 'TN', country: 'India' },
  { city: 'Bengaluru', state: 'KA', country: 'India' },
  { city: 'Singapore', state: '', country: 'Singapore' },
  { city: 'Sydney', state: 'NSW', country: 'Australia' },
  { city: 'Tokyo', state: '', country: 'Japan' },
  { city: 'Seoul', state: '', country: 'South Korea' },
  { city: 'Mexico City', state: '', country: 'Mexico' },
  { city: 'São Paulo', state: '', country: 'Brazil' },
  { city: 'Dubai', state: '', country: 'UAE' },
  { city: 'Johannesburg', state: '', country: 'South Africa' },
]

const ALL_ELIGIBLE_SERVICE_IDS = [
  'qw-distributor', 'qw-exhibitor', 'qw-partner', 'icount', 'moviebuff', 'slate-media',
  'cheers-exhibitor', 'dc-distributor', 'dc-exhibitor', 'dc-integrator', 'mw-distributor',
  'mw-exhibitor', 'qube-account', 'qube-cinemas',
] as const

function generateCompany(index: number): Company {
  const prefix = pick(NAME_PREFIXES)
  const suffix = pick(NAME_SUFFIXES)
  const displayName = `${prefix} ${suffix}`
  const legalName = `${displayName} ${pick(LEGAL_SUFFIXES)}`
  const location = pick(CITIES)
  const domain = `${prefix.toLowerCase().replace(/\s+/g, '')}${suffix.toLowerCase().replace(/\s+/g, '')}.com`
  const code = `${prefix.slice(0, 3).toUpperCase()}${String(index).padStart(4, '0')}`
  const monthDay = randInt(1, 28)
  const month = pick(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])

  return {
    id: `c-gen-${index}`,
    legalName,
    displayName,
    code,
    uuid: `uuid-gen-${index}`,
    logoUrl: '',
    status: chance(0.95) ? 'Active' : 'Inactive',
    type: 'External',
    contactEmail: `contact@${domain}`,
    contactPhone: `555-${String(randInt(1000, 9999))}`,
    website: `https://${domain}`,
    address: { street: `${randInt(1, 999)} ${pick(['Main St', 'Studio Blvd', 'Broadway', 'Market St', 'Park Ave'])}`, city: location.city, state: location.state, zip: '', country: location.country },
    emailDomains: [domain],
    excludedDomains: ['gmail.com', 'outlook.com'],
    onlyDomainUser: chance(0.5),
    autoAddDomainUsers: chance(0.7),
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: pickN(ALL_ELIGIBLE_SERVICE_IDS, randInt(1, 4)),
    lastUpdated: `${month} ${monthDay}, 2026`,
  }
}

const generatedCompanies: Company[] = Array.from({ length: TOTAL_COMPANIES - flagshipCompanies.length }, (_, i) =>
  generateCompany(i + 1),
)

export const companies: Company[] = [...flagshipCompanies, ...generatedCompanies]

export function companyById(id: string) {
  return companies.find((c) => c.id === id)
}

import type { Company } from './types'

export function domainOf(email: string): string {
  return email.split('@')[1]?.toLowerCase().trim() ?? ''
}

export interface DomainCheckResult {
  allowed: boolean
  reason?: string
}

// Enforces the "User Onboarding" rules captured on Company (excludedDomains,
// onlyDomainUser) wherever a user is added to a company — previously these
// fields were editable in CompanyForm but nothing read them back.
export function checkDomainForCompany(company: Company, email: string): DomainCheckResult {
  const domain = domainOf(email)
  if (!domain) return { allowed: false, reason: 'Enter a valid email address.' }
  if (company.excludedDomains.some((d) => d.toLowerCase() === domain)) {
    return { allowed: false, reason: `"${domain}" is an excluded domain for ${company.displayName}.` }
  }
  if (company.onlyDomainUser && company.emailDomains.length > 0 && !company.emailDomains.some((d) => d.toLowerCase() === domain)) {
    return { allowed: false, reason: `${company.displayName} only allows users from: ${company.emailDomains.join(', ')}.` }
  }
  return { allowed: true }
}

// Companies that would auto-claim a membership for this email address, per
// their `autoAddDomainUsers` flag — used when a brand-new user is created so
// they're transparently enrolled anywhere their domain is auto-added,
// mirroring the JIT-arrival idea in spec §4.4 (recognized identity, applied
// against whichever companies already claim that domain).
export function companiesAutoAddingDomain(companies: Company[], email: string, excludeCompanyId?: string): Company[] {
  const domain = domainOf(email)
  if (!domain) return []
  return companies.filter(
    (c) =>
      c.id !== excludeCompanyId &&
      c.autoAddDomainUsers &&
      c.emailDomains.some((d) => d.toLowerCase() === domain) &&
      !c.excludedDomains.some((d) => d.toLowerCase() === domain),
  )
}

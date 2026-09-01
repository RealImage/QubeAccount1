import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../data/store'
import { services } from '../data/services'
import type { Company } from '../data/types'
import { Button, Field, FieldLabel, FormSection, PageHeader, Select, TextArea, TextInput } from '../components/ui'

function emptyCompany(): Company {
  return {
    id: `c-${Date.now()}`,
    legalName: '',
    displayName: '',
    code: '',
    uuid: '',
    logoUrl: '',
    status: 'Active',
    type: 'External',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
    emailDomains: [],
    excludedDomains: [],
    onlyDomainUser: false,
    autoAddDomainUsers: false,
    billingInfo: '',
    deliveryInfo: '',
    notes: '',
    subscribedServiceIds: [],
    lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  }
}

export function CompanyForm() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { companies, addCompany, updateCompany } = useStore()
  const existing = !isNew ? companies.find((c) => c.id === id) : undefined
  const [form, setForm] = useState<Company>(existing ?? emptyCompany())

  if (!isNew && !existing) {
    return <p className="text-[var(--color-muted)]">Company not found.</p>
  }

  function set<K extends keyof Company>(key: K, value: Company[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setAddress<K extends keyof Company['address']>(key: K, value: string) {
    setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }))
  }

  function toggleService(serviceId: string) {
    setForm((prev) => ({
      ...prev,
      subscribedServiceIds: prev.subscribedServiceIds.includes(serviceId)
        ? prev.subscribedServiceIds.filter((s) => s !== serviceId)
        : [...prev.subscribedServiceIds, serviceId],
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isNew) {
      addCompany(form)
      navigate(`/companies/${form.id}`)
    } else {
      updateCompany(form.id, form)
      navigate(`/companies/${form.id}`)
    }
  }

  return (
    <div>
      <PageHeader
        title={isNew ? 'Add New Company' : `Edit ${form.displayName}`}
        description={isNew ? 'Fill in the details to create a new company account.' : 'Update company details.'}
      />

      <form onSubmit={handleSubmit}>
        <FormSection title="Company Details">
          <Field>
            <FieldLabel>Company Legal Name</FieldLabel>
            <TextInput
              required
              value={form.legalName}
              onChange={(e) => set('legalName', e.target.value)}
              placeholder="Innovatech Solutions Inc."
            />
          </Field>
          <Field>
            <FieldLabel>Company Display Name</FieldLabel>
            <TextInput
              required
              value={form.displayName}
              onChange={(e) => set('displayName', e.target.value)}
              placeholder="Innovatech"
            />
          </Field>
          <Field>
            <FieldLabel>Company Code</FieldLabel>
            <TextInput value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="INN001" />
          </Field>
          <Field>
            <FieldLabel>Company UUID</FieldLabel>
            <TextInput value={form.uuid} disabled placeholder="System Generated" />
          </Field>
          <Field full>
            <FieldLabel>Logo URL</FieldLabel>
            <TextInput
              value={form.logoUrl}
              onChange={(e) => set('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as Company['status'])}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Company Type</FieldLabel>
            <Select value={form.type} onChange={(e) => set('type', e.target.value as Company['type'])}>
              <option value="External">External</option>
              <option value="Internal">Internal</option>
            </Select>
          </Field>
        </FormSection>

        <FormSection title="Contact Information">
          <Field>
            <FieldLabel>Contact Email</FieldLabel>
            <TextInput
              type="email"
              value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              placeholder="contact@example.com"
            />
          </Field>
          <Field>
            <FieldLabel>Contact Phone</FieldLabel>
            <TextInput
              value={form.contactPhone}
              onChange={(e) => set('contactPhone', e.target.value)}
              placeholder="555-123-4567"
            />
          </Field>
          <Field full>
            <FieldLabel>Website</FieldLabel>
            <TextInput value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://example.com" />
          </Field>
        </FormSection>

        <FormSection title="Address">
          <Field full>
            <FieldLabel>Street Address</FieldLabel>
            <TextInput value={form.address.street} onChange={(e) => setAddress('street', e.target.value)} placeholder="123 Main St" />
          </Field>
          <Field>
            <FieldLabel>City</FieldLabel>
            <TextInput value={form.address.city} onChange={(e) => setAddress('city', e.target.value)} placeholder="Anytown" />
          </Field>
          <Field>
            <FieldLabel>State/Province</FieldLabel>
            <TextInput value={form.address.state} onChange={(e) => setAddress('state', e.target.value)} placeholder="CA" />
          </Field>
          <Field>
            <FieldLabel>Zip/Postal Code</FieldLabel>
            <TextInput value={form.address.zip} onChange={(e) => setAddress('zip', e.target.value)} placeholder="90210" />
          </Field>
          <Field>
            <FieldLabel>Country</FieldLabel>
            <TextInput value={form.address.country} onChange={(e) => setAddress('country', e.target.value)} placeholder="USA" />
          </Field>
        </FormSection>

        <FormSection title="User Onboarding">
          <Field full>
            <FieldLabel>Company Email Domains</FieldLabel>
            <TextInput
              value={form.emailDomains.join(', ')}
              onChange={(e) => set('emailDomains', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="example.com, corp.example.org"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">Comma-separated list of email domains associated with this company.</p>
          </Field>
          <Field full>
            <FieldLabel>Excluded Domains</FieldLabel>
            <TextInput
              value={form.excludedDomains.join(', ')}
              onChange={(e) => set('excludedDomains', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="gmail.com, outlook.com"
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">Comma-separated list of email domains explicitly excluded from auto-association.</p>
          </Field>
          <Field full>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input type="checkbox" checked={form.onlyDomainUser} onChange={(e) => set('onlyDomainUser', e.target.checked)} />
              This company is the only user of the specified domains
            </label>
          </Field>
          <Field full>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={form.autoAddDomainUsers}
                onChange={(e) => set('autoAddDomainUsers', e.target.checked)}
              />
              Automatically add all users with the specified email domain to this company
            </label>
          </Field>
        </FormSection>

        <FormSection title="Additional Information">
          <Field full>
            <FieldLabel>Billing Information</FieldLabel>
            <TextArea rows={2} value={form.billingInfo} onChange={(e) => set('billingInfo', e.target.value)} placeholder="Billing terms, PO numbers, etc." />
          </Field>
          <Field full>
            <FieldLabel>Delivery Information</FieldLabel>
            <TextArea rows={2} value={form.deliveryInfo} onChange={(e) => set('deliveryInfo', e.target.value)} placeholder="Preferred delivery methods, contacts, etc." />
          </Field>
          <Field full>
            <FieldLabel>Notes/Remarks</FieldLabel>
            <TextArea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any other relevant notes." />
          </Field>
        </FormSection>

        <FormSection title="Service Subscriptions">
          <Field full>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {services
                .filter((s) => s.eligibility === 'all' || form.type === 'Internal')
                .map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                    <input
                      type="checkbox"
                      checked={form.subscribedServiceIds.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                    />
                    {s.name}
                  </label>
                ))}
            </div>
          </Field>
        </FormSection>

        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}

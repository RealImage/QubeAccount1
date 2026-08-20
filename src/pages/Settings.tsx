import { Card, PageHeader } from '../components/ui'

export function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="System configuration for Qube Account." />
      <Card>
        <h2 className="mb-2 text-lg font-semibold text-[var(--color-text)]">Identity Provider</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Authentication (MFA, SSO/SAML/OIDC, identity threat management) is owned by Microsoft Entra / Descope and configured
          outside Qube Account, per spec §8. This page is a placeholder for authorization-side settings (e.g. default roles,
          invite expiry) as they're defined.
        </p>
      </Card>
    </div>
  )
}

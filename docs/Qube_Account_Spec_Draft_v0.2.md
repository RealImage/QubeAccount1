# Qube Account — Requirements / Spec (Draft v0.2)

*Supersedes: "Qube Account – Requirements Document" (source doc, v1). This draft exists to be debated and revised before any design or build work starts.*

## 0. What changed from v1, and why

The original requirements document treated Qube Account as owning both authentication (MFA, SSO/SAML/OIDC, sessions) and authorization (companies, subscriptions, roles). That has changed:

- **Microsoft Entra and/or Descope now own identity and authentication** — login, MFA, SSO, and identity threat management. This is an external system to Qube Account.
- **Qube Account keeps everything it already owned on the authorization side**, unchanged in shape: the invite flow, JIT-provisioning *logic* (i.e., deciding what happens the first time a known-to-Entra identity shows up), and role assignment. Qube Account now *calls out to* Entra/Descope for authentication instead of implementing MFA/SSO itself.

Concretely, against the v1 section numbers: §14.1 (MFA) and §14.2 (SSO protocol/IdP support) move out of Qube Account's scope entirely — that configuration and enforcement now lives in Entra/Descope. §14.3 (SSO + Role Assignment), §14.4 (SSO + Invite Flow), and §14.5 (Session & Security Controls) are **retained but reinterpreted**: Qube Account still enforces the *rules* in these sections, but it now receives identity as a signal from an external IdP rather than owning the IdP relationship itself. Everything in v1 §§1–13 (core entities, access control model, user lifecycle, user states, service administration, company management, subscription flow, deactivation, audit, non-goals) is unchanged in substance and is restated below for completeness, with edits called out inline where the identity split touches them.

The service catalog below also reflects your decision to keep the fuller product list (Slate, Cheers, DigitalCinema.in, Movie Wire, Slydes, MovieBuff) alongside what the original doc listed — flagged as an open item in §8 since it wasn't in the source doc and should be confirmed with the actual product owners.

## 1. Overview

Qube Account is a centralized **authorization** system (access management) that sits in front of every Qube service. It answers one question: given a user whose identity has already been established by Microsoft Entra / Descope, what are they allowed to do, in which company, in which service?

Identity — who a person is, how they log in, and whether their credentials are compromised — is Entra's and/or Descope's job. Access — whether that person can act inside a given Qube service on behalf of a given company — is Qube Account's job. This split is deliberate and is the central design principle of this revision.

## 2. Core Entities

### 2.1 User
- Identity (credentials, MFA enrollment, SSO account, threat signals) is owned and authenticated by Microsoft Entra / Descope — Qube Account does not store credentials or run authentication.
- Qube Account maintains its own user record, keyed by the same globally unique identifier (email), to track company memberships, invite state, and role assignments. This record is created either through the invite flow or through JIT logic when an Entra/Descope-authenticated identity is first seen (see §5).
- A user can belong to multiple companies, same as v1.

### 2.2 Company (Tenant)
- Unchanged from v1: represents a customer organization, owns service subscriptions, and remains the primary access-control boundary.

### 2.3 Service
Framed by which company types are eligible for access (unchanged principle from v1/the skill draft — eligibility is company-type, not a public/internal naming convention):

*All company types can get access to:*

| Product | Service |
|---|---|
| Qube Wire | Qube Wire Distributor / Exhibitor / Partner |
| iCount | iCount Exhibitor |
| MovieBuff | MovieBuff Access |
| Slate | Slate Media Company |
| Cheers | Cheers Exhibitor |
| DigitalCinema.in | DC Distributor / Exhibitor / Integrator |
| Movie Wire | MW Distributor / Exhibitor |
| Qube Account | Qube Account (base login/profile access) |

*Only Internal Companies can get access to:*

| Product | Service |
|---|---|
| Qube Wire | Qube Wire Admin |
| iCount | iCount Admin |
| CinemasDB | CinemasDB Admin |
| Slate | Slate Admin |
| Cheers | Cheers Admin |
| Slydes | Slydes Admin |
| DigitalCinema.in | DC Admin |
| Movie Wire | MW Admin |
| Qube Account | Company Management (the internal control-plane, §7) |

**Open item:** this catalog is broader than the original requirements doc, which only listed iCount, MovieBuff, Qube Wire, Qube Account, and CinemasDB. Confirm the full list and per-service eligibility with the actual product owners before it's treated as authoritative (see §8).

Services define their own roles and enforce their own in-service permissions; Qube Account only stores the mapping — unchanged from v1.

### 2.4 Company Subscription
Unchanged: a company subscribes to one or more services; users can only be assigned roles in services their company has subscribed to.

### 2.5 Membership
Unchanged: a user must be part of a company to access any service under that company.

### 2.6 Role Assignment
Unchanged: a role is assigned to a user within a (Company + Service) context. Roles are defined and managed by individual services; Qube Account only stores the mapping.

## 3. Access Control Model

### 3.1 Fundamental Rule (Hard Validation) — unchanged
A user has access to a service only if all three hold simultaneously: membership in the company, the company's subscription to the service, and an assigned role in that service.

### 3.2 Authorization Model — unchanged
RBAC only. No fine-grained permissions, no policy engine, no cross-service role inheritance. Each service independently defines its role types and what each role can do.

## 4. User Lifecycle

### 4.1 Invitation Flow — unchanged
A Service Admin invites a user at the service level. The invite carries company context, service context, and assigned role.

### 4.2 Mandatory Acceptance — unchanged
The user must accept the invite before access activates. This is still a Qube Account–owned consent step, independent of whatever Entra/Descope authentication the user goes through to actually click "accept."

### 4.3 Existing Users — unchanged
If the invitee already exists globally and is already a member of the company, the invite collapses into a direct role assignment; they're still notified by email but there's no separate acceptance step.

### 4.4 Identity-side arrival (new, replaces v1 §14.4 "SSO + Invite Flow")
When a user first authenticates through Entra/Descope and Qube Account has never seen that identity before, Qube Account's JIT logic runs: the identity is recognized, but the user still has zero access until they're explicitly associated with a company and assigned a role — exactly as in v1, just with Entra/Descope as the source of the identity event instead of Qube Account's own SSO integration.

## 5. User States

### 5.1 Company-Level Status — unchanged
Active / Inactive. Inactive is a global kill switch blocking access to all services under that company.

### 5.2 Service-Level Status — unchanged
No separate status field; access is purely role assignment + invite acceptance.

### 5.3 Effective Access Logic — unchanged

| Company Status | Invite Status | Role Assigned | Access |
|---|---|---|---|
| Active | Accepted | Yes | Allowed |
| Active | Pending | Yes | Not yet allowed |
| Inactive | Any | Yes | Denied |

## 6. Service Administration — unchanged
Service Admins invite users, assign/modify/revoke roles, but only within their own service. They cannot cross into other services or manage company-level membership directly.

## 7. Company Management (Internal Control Plane) — unchanged
Restricted to @qubecinema.com users in companies designated Internal. Users here can view all companies, all users, and all service access/roles across companies — the "God view."

## 8. Authentication & Identity (replaces v1 §14) — owned by Entra/Descope, consumed by Qube Account

- MFA, SSO protocol support (SAML/OIDC), supported IdP configuration, credential storage, and identity threat detection are entirely Entra's/Descope's responsibility and out of Qube Account's scope.
- Qube Account's obligation is limited to: recognizing an authenticated identity (via whatever token/claims Entra/Descope hands it), mapping it to its own user record, and enforcing §3–§5 above regardless of how that authentication happened.
- Authentication succeeding never implies access — this rule from v1 §14.3 is unchanged and, if anything, more important now that authentication is fully external.

**Open questions that need a decision before design/build starts:**

1. **Single IdP or both, concurrently?** Does every company pick one of Entra or Descope, or can Qube Account need to support both live at once (e.g., different customer segments on each)?
2. **Deactivation propagation.** When a company or user is deactivated in Qube Account, does that need to actively revoke the user's session/token at Entra/Descope (a live API call), or does Qube Account only need to block its own authorization checks going forward and let the existing session expire naturally?
3. **Source of truth for "does this identity exist."** Is Entra/Descope's directory authoritative for whether an email is a known identity, with Qube Account's user record being purely a downstream authorization record — or does Qube Account still need to independently track identity existence?
4. **Non-SSO / small-customer login path.** Does every company authenticate through Entra/Descope (even small customers without their own IdP), or does Qube Account still need any login surface of its own for customers without enterprise SSO?
5. **Audit split.** Does Qube Account's audit log (§9) stay scoped to authorization events only (invites, role changes, subscriptions, deactivation), with authentication events (login attempts, MFA challenges) logged solely inside Entra/Descope? Or does Qube Account need to ingest and correlate authentication events too?
6. **Service catalog confirmation.** See the open item under §2.3.

## 9. Subscription Flow — unchanged
When a company subscribes to a service, at least one Service Admin must be assigned — either during subscription itself, or via internal Qube action.

## 10. Deactivation Behavior — unchanged in shape, pending §8.2 above
- Company-level deactivation immediately disables access to all services; role assignments are preserved and restored on reactivation.
- Service-level access removal (removing a role) removes access to just that service; no separate status flag needed.
- Whether deactivation also needs to call out to Entra/Descope to kill an active session is the open question in §8.2.

## 11. Audit Requirements — unchanged in shape, pending §8.5 above
Qube Account logs: user invited, invite accepted, user added to company, role assigned/updated/removed, subscription changes, company-level deactivation/reactivation. Each entry includes actor, target user, company, service (if applicable), and timestamp.

## 12. Key Design Principles
- Company is the primary access-control boundary.
- Service owns its own in-service authorization logic; Qube Account owns the mapping.
- **Identity and access are separate systems by design**: Entra/Descope answer "who is this," Qube Account answers "what can they do, where."
- User consent is mandatory via invite acceptance, independent of authentication method.
- Minimal states, to avoid ambiguity.

## 13. Non-Goals — unchanged, with one addition
Qube Account explicitly does not do: fine-grained permission systems, policy-based access control (PBAC), temporary/time-bound access, cross-service role standardization, **and, as of this revision, authentication itself (MFA, SSO protocol handling, credential storage) — that responsibility has moved to Entra/Descope.**

## 14. Summary
Qube Account is responsible for: user↔service↔role mapping, user↔company mapping, and company↔service mapping — a simple, enforceable, auditable authorization layer, deliberately decoupled from identity, which is Entra's/Descope's domain.

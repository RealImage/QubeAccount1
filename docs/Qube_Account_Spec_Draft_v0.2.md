# Qube Account — Spec Draft v0.2

> Spec doc to be re-attached. This placeholder exists so `CLAUDE.md`'s
> references to spec sections (§1–§14) resolve to a real file in this repo.
> The section numbers below reflect what this build implements and assumes;
> replace this file with the authoritative source document when available.

## Referenced sections

- **§2** — Domain model: companies, services, users, role assignments
  (see `src/data/types.ts`).
- **§2.3** — Service catalog: the products and per-product services Qube
  Account manages (see `src/data/services.ts`).
- **§3 / §3.1** — Fundamental access rule: a user has access to a service
  only if company membership, company subscription, and an assigned role
  all hold simultaneously (see `src/data/access.ts`).
- **§4.2** — Invite acceptance flow (Pending → Accepted).
- **§5.3** — Effective access table:
  - Company Active + Invite Accepted + Role Assigned → Allowed
  - Company Active + Invite Pending + Role Assigned → Not yet allowed
  - Company Inactive (any invite state) → Denied
- **§7** — Portal Users: internal `@qubecinema.com` staff with Company
  Management access, distinct from regular company users.
- **§8** — Authentication, identity provider (Microsoft Entra / Descope),
  and related open questions. See `CLAUDE.md` for the defaults this build
  assumes for each open question.
- **§11** — Audit logging requirements.
- **§14** — (unresolved in this placeholder — restore from source spec.)

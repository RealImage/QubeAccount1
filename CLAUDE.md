# Qube Account

Internal access-management admin portal (Company Management control plane), per
`Qube_Account_Spec_Draft_v0.2.md`.

## Stack

Vite + React + TypeScript + Tailwind CSS v4, `react-router-dom` for routing,
`recharts` for the dashboard chart, `lucide-react` for icons.

- `npm run dev` — start dev server
- `npm run build` — typecheck (`tsc -b`) + production build
- `npm run lint` — oxlint

## What this is

A working UI implementing spec §§1–14 (Draft v0.2): companies, users,
services, subscriptions, role assignments, and the effective-access rules in
§3/§5. There is **no real backend** — data lives in an in-memory store
(`src/data/store.tsx`, seeded from `src/data/{companies,users,services,audit}.ts`)
that resets on reload. There is **no real authentication** — the app assumes
an already-authenticated internal admin (per spec §7/§8, identity is owned by
Microsoft Entra / Descope and out of scope here).

## Structure

- `src/data/types.ts` — domain types (Company, User, Service, RoleAssignment, …)
- `src/data/access.ts` — effective-access logic, spec §3.1 and §5.3, as pure functions
- `src/data/services.ts` — service catalog, spec §2.3
- `src/data/companies.ts`, `src/data/users.ts`, `src/data/audit.ts` — seed data
- `src/data/store.tsx` — React context holding mutable in-memory state
- `src/components/` — shared layout (`Sidebar`, `Layout`) and UI primitives (`ui.tsx`)
- `src/pages/` — one file per route (Dashboard, CompanyList, CompanyForm,
  CompanyDetail, ServicesCatalog, ServiceConfigure, PortalUsers, Settings)

## Defaults assumed for spec §8 open questions

The spec's six open questions are unresolved by design; this build picks a
default for each so the UI has a coherent story, called out here so they're
easy to revisit:

1. **Single IdP or both** — not modeled; the app doesn't talk to Entra/Descope at all.
2. **Deactivation propagation** — assumed Qube Account only blocks its own
   authorization checks (§5.3); no session-revocation API call is simulated.
3. **Identity source of truth** — assumed Qube Account's user record is a
   downstream authorization record, not an independent identity store.
4. **Non-SSO login path** — not modeled; no login screen exists in this build.
5. **Audit split** — `src/data/audit.ts` logs authorization events only
   (invites, role changes, subscriptions, deactivation), not authentication events.
6. **Service catalog** — the fuller list from spec §2.3 is used as-is (Slate,
   Cheers, DigitalCinema.in, Movie Wire, Slydes, MovieBuff included), pending
   confirmation with product owners per the spec's own open item.

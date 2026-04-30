# praxis — DOSSIER

**Identity:** EthiksLabs production control plane — Paperclip fork
**Version:** Paperclip upstream + EthiksLabs overlay
**Status:** `lab` — running locally, not yet deployed to EC2
**Authority:** John Coates
**Repo:** ethikslabs/praxis
**URL:** localhost:3100 (dev)

---

## Visual Identity

| Field | Value |
|-------|-------|
| Glyph | 🎯 |
| Color | `#1e293b` |

---

## What This Repo Owns

PRAXIS is the production orchestration layer replacing ops360. Where ops360 was the hand-rolled proof, PRAXIS is the production runtime.

It is a fork of [paperclipai/paperclip](https://github.com/paperclipai/paperclip) — a multi-agent control plane with companies, agents, tasks, issues, and approvals. EthiksLabs configuration lives exclusively in `/ethikslabs/`. Paperclip upstream source is never modified.

**The boundary:**
- Paperclip source (`server/`, `ui/`, `packages/`, `cli/`) — never touch without explicit instruction.
- EthiksLabs config (`/ethikslabs/`) — all our companies, missions, agent configs, and PM2 config live here only.

---

## Role in the 360 Stack

```
praxis (production control plane — replaces ops360)
├── proof360      — entity onramp company
├── research360   — knowledge substrate company
├── raise360      — capital intelligence company
├── posture360    — enterprise vendor trust portal company
├── portfolio360  — investor intelligence panel company
└── procurement360 — enterprise buyer panel company
```

Each 360 product is a separate isolated company in Paperclip with its own agents, budgets, and audit trail.

---

## Architecture

**Monorepo (TypeScript ESM, pnpm):**
| Package | Purpose |
|---------|---------|
| `server/` | Express API + all backend services |
| `ui/` | React + Vite frontend |
| `cli/` | CLI tool |
| `packages/db/` | Drizzle ORM, Postgres/PGlite |
| `packages/shared/` | Types and constants |
| `packages/adapters/<name>/` | One package per agent runtime |

**Adapters available:** `claude-local`, `codex-local`, `cursor-local`, `gemini-local`, `openclaw-gateway`, `opencode-local`, `pi-local`

**Database:** PGlite (embedded, no external DB) in dev. Postgres (`DATABASE_URL`) in prod. Drizzle ORM, migrations in `packages/db/src/migrations/`.

**Plugin system** — the most complex subsystem. Plugins run in separate worker processes. Discovery scans `~/.paperclip/plugins/` + `node_modules/paperclip-plugin-*`.

---

## EthiksLabs Overlay (`/ethikslabs/`)

| Path | Purpose |
|------|---------|
| `ethikslabs/missions/north-star.md` | Source text for all company missions |
| `ethikslabs/companies/` | One file per 360 product — definition, mission, agent roles |
| `ethikslabs/agents/` | Agent configs (Claude Code verifier, etc.) |
| `ethikslabs/ecosystem.config.cjs` | PM2 config for EC2 deployment |
| `ethikslabs/UPSTREAM_TRACKING.md` | Upstream merge log |

Company configuration is done through the Paperclip UI at `localhost:3100`. Files in `companies/` are the authoritative reference — not the live DB state.

---

## Agent Model in PRAXIS

| Agent | Role | Adapter |
|-------|------|---------|
| Claude Code | Verifier — tests, small fixes | `claude-local` |
| Kiro | Builder — new features, large builds | HTTP webhook adapter |
| Claude.ai | Operator — strategy, briefs | Out of band |

---

## Current State

- Running locally at `localhost:3100`
- Company setup not yet complete for all 360 products
- Not yet deployed to EC2
- Upstream tracking: log in `ethikslabs/UPSTREAM_TRACKING.md`

---

## Open Items

- Complete company setup for all 360 products in Paperclip UI
- EC2 deployment (PM2 config exists in `ethikslabs/ecosystem.config.cjs`)
- Define production `DATABASE_URL` and migrate from PGlite
- Wire agent adapters to live Kiro and Claude Code instances

---

## Related

- `IMPERIUM/` — control plane (CLI pipeline + serve layer, live on EC2)
- `VERITAS/` — truth plane (independent, peer to both)
- Global `/init` context — `CLAUDE.md`
- `WHY.md` — origin story and the Ethiks360 context — why any of this exists

---

## MCP Surface (planned)

```
mcp://praxis/
└── tools/
    ├── list_companies        — list all 360 companies configured in Paperclip
    ├── list_agents           — list agents for a company with status and adapter
    ├── create_task           — create a task for an agent in a company
    ├── get_task_status       — fetch task status and output by task ID
    ├── list_issues           — list open issues for a company
    └── get_audit_trail       — retrieve decision and approval history for a company
```

---

## A2A Agent Card

```json
{
  "agent_id": "praxis",
  "display_name": "praxis — EthiksLabs production control plane (Paperclip fork)",
  "owner": "john-coates",
  "version": "1.0.0",
  "port": 3100,
  "capabilities": [
    "agent_orchestration",
    "task_management",
    "issue_tracking",
    "approval_workflow",
    "audit_trail",
    "multi_company_isolation"
  ],
  "authority_level": "control_plane",
  "contact_protocol": "http",
  "human_principal": "john-coates"
}
```

---

## Commercial

| Field | Value |
|-------|-------|
| Status | pre-revenue |
| Founder | john-coates |
| ABN / UEN | pending |
| Capital path | bootstrap |
| Revenue model | Platform orchestration — control plane for 360 products; revenue flows through products (proof360, raise360, etc.), not praxis directly. Future: white-label Paperclip control plane. |
| IP boundary | EthiksLabs overlay (/ethikslabs/), company isolation model, agent routing configuration, upstream tracking discipline |
| Stack dependency | VECTOR (inference via adapters), ARGUS (monitoring), VERITAS (peer, independent) |
| First customer | internal: proof360 (first company configured in Paperclip) |

### Traction

| Metric | Value | Source |
|--------|-------|--------|
| Build status | lab — running locally | manual |
| Companies configured | pending completion | manual |
| Upstream tracking | active | ethikslabs/UPSTREAM_TRACKING.md |

---

*Last updated: 2026-04-25*
*Authority: john-coates*

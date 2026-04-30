# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Universal init

On `/init`, follow `../../CONTROL/INIT_PROTOCOL.md`. This repo file adds local rules only; it does not own the workspace init protocol.

---

## What this repo is

**PRAXIS** — the EthiksLabs control plane. A fork of [paperclipai/paperclip](https://github.com/paperclipai/paperclip), configured as the governing runtime for the entire EthiksLabs 360 portfolio.

PRAXIS replaces ops360 as the orchestration layer. ops360 was the hand-rolled proof. PRAXIS is the production runtime.

---

## The two layers in this repo

```
/                        — Paperclip upstream (do not modify without explicit instruction)
/ethikslabs/             — EthiksLabs overlay (all our config, missions, company definitions)
```

**Never touch Paperclip source** (`server/`, `ui/`, `packages/`, `cli/`) unless John explicitly directs a patch. Upstream improvements are pulled via `git merge upstream/master`. Our changes live exclusively in `/ethikslabs/`.

---

## Commands

```bash
pnpm install              # install deps (pnpm 9.15.4, node >=20)
pnpm dev                  # API + UI at http://localhost:3100
pnpm dev:server           # API only
pnpm dev:ui               # UI only (Vite)
pnpm build                # build all packages
pnpm typecheck            # typecheck all packages
pnpm test                 # run all tests (vitest watch mode)
pnpm test:run             # run all tests once (no watch)
```

**Run a single test file:**
```bash
pnpm --filter @paperclipai/server exec vitest run src/__tests__/<file>.test.ts
```

**E2E / smoke tests (Playwright):**
```bash
# E2E (requires running dev server)
pnpm --filter tests/e2e exec playwright test

# Release smoke tests (Docker-based)
pnpm --filter tests/release-smoke exec playwright test
```

**DB ops:**
```bash
pnpm db:generate          # generate Drizzle migrations from schema changes
pnpm db:migrate           # apply migrations
pnpm db:backup            # backup DB (runs scripts/backup-db.sh)
```

**Reset dev DB:**
```bash
rm -rf data/pglite && pnpm dev
```

Health check: `curl http://localhost:3100/api/health`

---

## Upstream tracking

```bash
git fetch upstream
git log upstream/master ^HEAD --oneline    # see what's new
git merge upstream/master                  # merge it in
```

Log every upstream merge in `/ethikslabs/UPSTREAM_TRACKING.md`.

---

## Architecture

### Monorepo structure

| Package | What it is |
|---------|-----------|
| `server/` | Express API + all backend services |
| `ui/` | React + Vite frontend |
| `cli/` | CLI tool |
| `packages/db/` | Drizzle ORM schema, migrations, embedded PGlite client |
| `packages/shared/` | Types and constants shared across server/ui/cli |
| `packages/adapter-utils/` | Shared adapter utilities |
| `packages/adapters/<name>/` | One package per agent adapter |

All packages are TypeScript ESM modules.

### Server architecture (`server/src/`)

**Routes → Services** pattern: `routes/` handlers are thin wires into `services/`. Business logic lives exclusively in services.

**Execution workspaces** (`services/workspace-runtime.ts`) — manages how agent tasks get a working directory. Two strategies: `project_primary` (shared checkout) or `git_worktree` (isolated branch per task). The service handles spawning, port allocation, and lifecycle.

**Plugin system** — the most complex subsystem. Plugins run in separate worker processes:
- `plugin-loader.ts` — discovery (scans `~/.paperclip/plugins/` + `node_modules/paperclip-plugin-*`), installation from npm, runtime activation
- `plugin-worker-manager.ts` — spawns/terminates worker processes
- `plugin-job-scheduler.ts` / `plugin-job-coordinator.ts` — job scheduling and coordination
- `plugin-event-bus.ts` — cross-plugin and host↔plugin event routing
- `plugin-tool-registry.ts` / `plugin-tool-dispatcher.ts` — tool discovery and dispatch

**Config** — loaded from `~/.paperclip/.env` (checked first) then `.env` in CWD. Dev uses embedded PGlite (no external DB needed). Prod needs `DATABASE_URL`.

### Database (`packages/db/`)

Drizzle ORM. Schema files in `packages/db/src/schema/` (one file per entity). Migrations in `packages/db/src/migrations/`. `client.ts` is Postgres-only — it auto-selects SSL based on URL (local = none, remote = `rejectUnauthorized: false` for RDS). Embedded-postgres/PGlite support is in `runtime-config.ts` and `migration-runtime.ts`.

### Adapters (`packages/adapters/`)

One package per agent runtime. Currently: `claude-local`, `codex-local`, `cursor-local`, `gemini-local`, `openclaw-gateway`, `opencode-local`, `pi-local`. Each exports `server`, `ui`, and `cli` sub-paths.

### UI (`ui/src/`)

React + Vite. `pages/` maps to major concepts (Companies, Agents, Issues, Approvals, Goals, Costs, etc.). `hooks/` for data fetching. `components/` for shared UI.

### Reference docs (`doc/`)

Key references in `doc/`:
- `DATABASE.md` — DB architecture and migration patterns
- `DEPLOYMENT-MODES.md` — dev / Docker / prod deployment options
- `DEVELOPING.md` — contributor setup and dev workflow
- `plugins/` — plugin authoring guide

---

## EthiksLabs overlay (`/ethikslabs/`)

| Path | Purpose |
|------|---------|
| `ethikslabs/missions/north-star.md` | Source text for all company missions |
| `ethikslabs/companies/` | One file per 360 product — definition, mission, agent roles |
| `ethikslabs/agents/` | Agent configs (Claude Code verifier, etc.) |
| `ethikslabs/ecosystem.config.cjs` | PM2 config for EC2 deployment |
| `ethikslabs/UPSTREAM_TRACKING.md` | Upstream merge log — version, date, what changed |

**Skills** (`skills/`) — reusable agent skill definitions for Paperclip operations (creating agents, creating plugins, memory file patterns). Not upstream code — EthiksLabs additions.

Company setup is done through the Paperclip UI at `localhost:3100`. These files are the authoritative reference for what each company should look like — not the source of truth for what's currently configured in the DB.

---

## The 360 portfolio (companies in PRAXIS)

| Company | What it is |
|---------|-----------|
| `proof360` | Entity onramp — live at proof360.au |
| `research360` | Knowledge substrate |
| `raise360` | Capital intelligence |
| `posture360` | Enterprise vendor trust portal |
| `portfolio360` | Investor intelligence panel |
| `procurement360` | Enterprise buyer panel |

Each is a separate isolated company in Paperclip with its own agents, budgets, and audit trail.

---

## Agent model

| Agent | Role in PRAXIS | Maps to |
|-------|---------------|---------|
| Claude Code | Verifier — runs tests, small fixes | `claude-local` adapter |
| Kiro | Builder — new features, large builds | HTTP webhook adapter |
| Claude.ai | Operator — strategy, briefs | Out of band (John's interface) |

---

## Constraints

- Node.js only. No Python.
- Do not modify Paperclip source without explicit instruction.
- All EthiksLabs config belongs in `/ethikslabs/` — never scattered through Paperclip source.
- No git push — John in Terminal only.
- Do not declare done — report results, John confirms.

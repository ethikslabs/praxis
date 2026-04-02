# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

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

## Upstream tracking

```bash
# Pull latest from Paperclip team
git fetch upstream
git merge upstream/master

# Check what's changed upstream since last merge
git log upstream/master ^HEAD --oneline
```

Log every upstream merge in `/ethikslabs/UPSTREAM_TRACKING.md`.

---

## Running PRAXIS locally

```bash
pnpm install
pnpm dev        # API + UI at http://localhost:3100
```

No external DB needed in dev — uses embedded PGlite. Reset dev DB:
```bash
rm -rf data/pglite
pnpm dev
```

Health check: `curl http://localhost:3100/api/health`

---

## EthiksLabs overlay (`/ethikslabs/`)

| Path | Purpose |
|------|---------|
| `ethikslabs/missions/north-star.md` | Source text for all company missions |
| `ethikslabs/companies/` | One file per 360 product — definition, mission, agent roles |
| `ethikslabs/agents/` | Agent configs (Claude Code verifier, Kiro builder, etc.) |
| `ethikslabs/UPSTREAM_TRACKING.md` | Upstream merge log — version, date, what changed |

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

Adapter docs: `packages/adapters/claude-local/`

---

## Constraints

- Node.js only. No Python.
- Do not modify Paperclip source without explicit instruction.
- All EthiksLabs config belongs in `/ethikslabs/` — never scattered through Paperclip source.
- No git push — John in Terminal only.
- Do not declare done — report results, John confirms.

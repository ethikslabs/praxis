# proof360 — PRAXIS Company Definition

*Reference definition for proof360 in PRAXIS. Configure via the Paperclip UI at localhost:3100.*

---

## Identity

| Field | Value |
|-------|-------|
| Name | proof360 |
| Domain | proof360.au |
| Status | Live |
| Repo | github.com/ethikslabs/proof360 |

## Mission (paste into Paperclip)

> proof360 is the entity onramp for the EthiksLabs trust stack. It takes any organisation's URL and returns a scored trust readiness report with gap analysis and vendor recommendations. Every assessment is a signal. Every signal feeds the portfolio view in PRAXIS.
>
> The goal is to make enterprise-grade trust assessment available to any founder in under 60 seconds — and to feed every result back into the EthiksLabs intelligence layer.

## Org structure

| Role | Agent | Adapter |
|------|-------|---------|
| Verifier | Claude Code | claude-local |
| Builder | Kiro | HTTP webhook |

## Budget policy

- Claude Code verifier: set a monthly token budget appropriate for test runs + small fixes
- Kiro builder: set per-task budget with approval gate for anything > 2hr estimated work

## First task (proof of loop)

> Run the proof360 test suite. Report: total tests, pass/fail count, any failures with classification (spec violation / implementation bug / ambiguity). Do not fix anything — report only.

Repo path: `/Users/johncoates/Library/CloudStorage/Dropbox/Projects/proof360`
Test command: `npm test`

# UPSTREAM_TRACKING.md

Tracks merges from `upstream` (paperclipai/paperclip) into PRAXIS.

Upstream remote: `https://github.com/paperclipai/paperclip.git`

---

## Merge log

| Date | Upstream commit | What changed | Notes |
|------|----------------|--------------|-------|
| 2026-04-02 | Initial fork | Fork created at `ethikslabs/praxis` | Baseline — no local patches |

---

## Local patches

None yet. All EthiksLabs customisation lives in `/ethikslabs/` — not in Paperclip source.

---

## How to merge upstream

```bash
git fetch upstream
git log upstream/master ^HEAD --oneline    # see what's new
git merge upstream/master                  # merge it in
# resolve any conflicts, then:
# add a row to this file
git add ethikslabs/UPSTREAM_TRACKING.md
git commit -m "chore: merge upstream paperclip [date]"
```

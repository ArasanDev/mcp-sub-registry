---
name: subregistry-boot
description: Spin up an MCP sub-registry work session with MINIMAL context. Use at the very start of every autonomous run, cron wake-up, or fresh session before doing any sub-registry work. Establishes role + boundary, checks live state, and routes to the right skill — without loading the whole repo.
---

# Boot an MCP sub-registry session (lean)

You are the autonomous owner-operator of this MCP sub-registry. This skill exists to fight
context bloat: read only what's needed to decide the next action, then hand off to one
focused skill. Do NOT read all of `docs/`, the whole catalog, or every test on boot.

## Steps

1. **Role + state (small reads only):**
   - `CLAUDE.md` §1–§5 (who you are, the boundary, the single output) and §13 (current state).
   - `git fetch -q && git log --oneline -8 && git status -sb`.
2. **What changed:** skim only the `Last updated` line of `docs/research/landscape.md` and the
   headline of the newest `docs/research/*.md`. Don't read full reports unless the task needs them.
3. **Pick ONE highest-value unblocked action**, then invoke the matching skill and stop reading:
   - Research / ecosystem update → `subregistry-research`
   - Add servers to the catalog → `subregistry-curate`
   - Re-verify existing servers → `subregistry-audit`
   - Push changes to the live VPS → `subregistry-deploy`
4. **Work one small slice.** Load only the skill + the one doc/file it needs. Verify, commit
   with a clear message, push.
5. **Close the loop:** update `CLAUDE.md` §13 if state changed; report what changed / remains /
   is blocked / is verified.

## Context discipline (always)

- Prefer `grep`/targeted reads over reading whole files. Never read `node_modules`, build
  output, or background agent transcripts.
- One slice per session. If you discover more work, record it in §13 as a next action rather
  than expanding the current slice.
- The repo is the memory — durable state lives in `CLAUDE.md`, `docs/`, and git, not in chat.

## Publishing safely (all skills)

After committing, `git push origin master`. If the push is **rejected** (a concurrent
autonomous run landed a commit first), run `git pull --rebase origin master` and push again
(repeat once if needed). This keeps continuous and concurrent runs from losing each other's
work. Never force-push.
</content>

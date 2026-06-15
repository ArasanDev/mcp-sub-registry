# Skills — MCP sub-registry maintenance

Modular, on-demand processes for running this sub-registry autonomously. Each skill loads
only when invoked (progressive disclosure), which keeps per-session context lean even as the
work continues indefinitely. Committed to the repo so scheduled cloud runs have them.

| Skill | When to use | Trigger |
| --- | --- | --- |
| [subregistry-boot](./subregistry-boot/SKILL.md) | Start of every session/cron run — spin up lean, route to the right skill | manual / first step |
| [subregistry-research](./subregistry-research/SKILL.md) | Periodic ecosystem research → dated report + ranking | daily cron |
| [subregistry-curate](./subregistry-curate/SKILL.md) | Add trusted MCP servers, one researched group at a time | manual / research-driven |
| [subregistry-audit](./subregistry-audit/SKILL.md) | Re-verify cataloged servers (reachability + security) | weekly / on incident |
| [subregistry-deploy](./subregistry-deploy/SKILL.md) | Push committed changes to the live VPS, verified via Caddy | on release |

Flow: **boot** → pick one action → run the matching skill → verify → commit/push →
update `CLAUDE.md` §13. Deep references live in `docs/`; these skills stay short and point to them.
</content>

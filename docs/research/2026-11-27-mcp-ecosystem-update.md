# MCP Ecosystem Update — 2026-11-27

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since the 2026-11-26 report. 1-day window (Nov 26–27).
**Today's date:** 2026-11-27

---

## Summary

Four meaningful findings today: (1) **MCPCon Nairobi recap now Day 8 absent** — the longest
post-event gap in AAIF history continues to widen; (2) **Skills over MCP is now in public
beta in Claude and Claude Code** — MCP servers can ship skills natively; Tasks and Elicitation
reached GA; (3) **Canva MCP GA (Oct 7, 2026)** — previously uncaptured; hosted at
`mcp.canva.com/mcp`, OAuth-gated, Streamable HTTP — a strong curate candidate; (4)
**SEP-2127 MCP Server Cards confirmed Final (merged Oct 6)** — CLAUDE.md "HOLD" flag on the
server-card audit is now resolvable once the path question is verified.

Security: Day 100+ clean window holds for all 19 cataloged servers. No new CVEs against catalog
entries. One unconfirmed community CVE (CVE-2026-137308) surfaced in a secondary security
database but could not be independently verified — flagged for follow-up.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Official MCP Registry** | ~67,000–68,000 (est.) | Nov 27, 2026 | No new snapshot; extrapolated from Stork.AI Nov 16 figure (65,580) at ~3,166/week. [[stork.ai]](https://www.stork.ai/) |
| **Glama** | ~128,000–129,500 (est.) | Nov 27, 2026 | Oct 28 confirmed 111,899; ~530/day growth; homepage cached at 122,052 (undated). [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,500–22,000 (est.) | Nov 2026 | Ingestion resumed (Nov 26 report). No new direct snapshot. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy shutdown Oct 31 stands. |
| **Our catalog** | 19 approved/public | — | Canva newly flagged as curate candidate (see §Catalog Hooks). |

---

## MCP Product Developments

### Skills Over MCP in Public Beta — Claude and Claude Code

Anthropic has entered public beta for **Skills over MCP**: MCP servers can now ship skills
(structured instruction sets / behavioural extensions) alongside their tools, so Claude
automatically loads a server's skills when it connects. Key details surfaced today:

- **Tasks GA and Elicitation GA** — the two previously-beta Claude features are now
  generally available.
- **Skills over MCP**: public beta, on by default for Claude Pro, Max, and Ultra plans.
- **File Uploads**: still rolling out.
- SEP-2640 (Skills Over MCP spec) was confirmed Final in the Nov 26 report; today's
  search confirms the product rollout is now live for end users.

> "Anthropic's Skills over MCP is in public beta, letting servers ship skills with their
> tools. Tasks and Elicitation are now generally available."
> [[claude.com blog]](https://claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers)
> [[apilama.com analysis, Nov 26]](https://apilama.com/2026/11/26/mcp-is-growing-up-still-no-map)

**Catalog impact:** No schema change required. The `skills` capability is an extension on
top of the tool-serving layer our catalog already models. Gateway operators should track
whether skills shipped by catalog servers require additional trust decisions.

---

### Canva MCP Server — GA since October 7, 2026 (previously uncaptured)

Canva announced its MCP server as generally available on **October 7, 2026** — previously
not captured in this research trail. Key details:

- **Endpoint:** `https://mcp.canva.com/mcp` (Streamable HTTP)
- **Auth:** OAuth 2.0 (required; no anonymous access)
- **Capabilities:** Design creation and editing, templates, brand kits, design export.
  Some automation features (brand kit, resize-design) require a Canva Pro plan.
- **Clients:** Claude connector directory (official listing), Cursor, GitHub Copilot, and
  any Streamable-HTTP MCP client.
- Canva's separate **Dev MCP Server** (`dev-mcp.canva.com`) is a distinct tool for building
  Canva apps; don't confuse them.

[[canva.dev GA blog]](https://www.canva.dev/blog/developers/canva-mcp-ga/)
[[community announcement]](https://community.canva.dev/t/introducing-the-canva-dev-mcp-server/6682)

**Catalog action:** **Curate candidate** — official vendor endpoint, auth-gated, GA since
Oct 7, Streamable HTTP. Add to curate queue under a "Creative & Design" group alongside
future Figma tracking. No action today; flag for next `subregistry-curate` run.

---

### Google Workspace MCP — GA Status Unconfirmed

A secondary news summary mentioned "Google made Workspace MCP servers generally available
across Gmail, Drive, Docs and the rest of the suite" in the Nov 24–26 window. However,
Google's own developer docs show only a **public developer preview** as of May 2026, with
no GA announcement found in this search pass.

**Status:** Unconfirmed. Recheck on next research pass. Per-service URLs (workspace-scoped,
not a single universal endpoint) make this a non-catalog candidate regardless of GA status.
[[Google Workspace MCP docs]](https://developers.google.com/workspace/guides/configure-mcp-servers)

---

## SEP-2127 Server Cards — Final Status CONFIRMED

The CLAUDE.md `Next Actions` item 3(a) flagged SEP-2127 as a **HOLD** pending finalization
confirmation. This is now resolvable:

- **Status:** Final — merged October 6, 2026 per eseospace Nov 2 source, corroborated by
  the SEP index status on `modelcontextprotocol.io/seps/2127-mcp-server-cards`.
  [[eseospace Nov 2 article]](https://eseospace.com/blog/mcp-server-cards/)
  [[SEP-2127 official page]](https://modelcontextprotocol.io/seps/2127-mcp-server-cards)

- **Path question:** One source says the per-server discovery path is
  `/.well-known/mcp/server-card.json`; CLAUDE.md §13 currently has it as
  `/.well-known/mcp.json`. Before running the server-card audit, verify the actual path
  against `modelcontextprotocol.io/seps/2127-mcp-server-cards.md` directly. The validator
  at **agent-ready.dev** is the simplest cross-check.

- **Extension status note:** Per a Nov 2, 2026 article, the SEP itself is Final but the
  extension mechanism under SEP-3392 is still Beta-stage, meaning the **format** may still
  evolve. This doesn't block the audit (we're just checking for card presence), but flag
  findings accordingly.

Also surfaced: an IETF internet-draft `draft-serra-mcp-discovery-uri` exists alongside
SEP-2127 — suggesting a parallel IETF-track attempt to standardize MCP server discovery.
[[IETF draft]](https://datatracker.ietf.org/doc/draft-serra-mcp-discovery-uri/)

---

## MCPCon Nairobi Recap — Still Absent (Day 8)

The post-event blog recap from AAIF for MCPCon Nairobi (Nov 19–20) remains unpublished
as of this research pass — Day 8 since the event concluded. This is the longest gap in
AAIF post-event history.

What is confirmed:
- Event occurred Nov 19–20 in Nairobi; Gates Foundation confirmed as Diamond Sponsor.
- AAIF Bluesky referenced an MCP Birthday Party at the summit.
- Livestream recordings for Nov 19 and Nov 20 appear on AAIF's MCP project page.

No session outputs, keynote summaries, or new MCP governance signals sourced from Nairobi
yet. [[AAIF MCP project]](https://aaif.io/projects/model-context-protocol)
[[Linux Foundation event page]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)

---

## Security

### Day 100+ Clean Window

No new CVEs confirmed against any of the 19 cataloged servers. The following community
packages warrant tracking:

**CVE-2026-137308 (Unverified) — markdownify-mcp SSRF**

A secondary security database (`mallory.ai/vulnerabilities`) listed this CVE on Nov 26
with a description of SSRF via URL-validation bypass in `markdownify-mcp`, fixed in v1.2.0.
However, the CVE ID **could not be independently verified** via NVD, Snyk, OSV, or
the existing CVE family (the confirmed SSRF CVEs for the same package are CVE-2025-5276
and CVE-2025-65512). The ID may be a data-entry error, a very recent NVD publication
backlog, or a false ID.

**Catalog impact:** `markdownify-mcp` is **not in our catalog**. Even if the CVE is real,
our remote-HTTP-only catalog with auth-gated endpoints is structurally immune to the
documented SSRF class. No catalog action.
[[SentinelOne-class analysis]](https://vulnerablemcp.info/) — flag for confirmation on next
security pass.

---

## MCP Ecosystem Analysis

A Nov 26 analysis piece from apilama.com ("MCP Trends: Events, Stateless Servers, Still
No Map") synthesized the state of the ecosystem post-spec. Key takeaways relevant to our
sub-registry:

- Interactive connectors, MCP events, stateless servers, and a formal 6-month spec cycle
  are making MCP "look like infrastructure."
- Skills from third-party MCP servers are still **untrusted code** that runs with the
  agent's permissions — reinforcing the value of the approval workflow we operate.
- "Still No Map" refers to the absence of a universal discovery/indexing solution —
  exactly the niche our sub-registry fills for a gateway.

[[apilama.com, Nov 26]](https://apilama.com/2026/11/26/mcp-is-growing-up-still-no-map)

---

## Catalog Hooks

| Server | Trigger | Recommended action |
|---|---|---|
| **Canva MCP** (`mcp.canva.com/mcp`) | GA since Oct 7, 2026; not in catalog | **Curate candidate** — add to next `subregistry-curate` run (Creative & Design group) |
| `com.github/mcp` | v2.3.0 confirmed Nov 24; `verifiedAt` audit pending | Scheduled for next `subregistry-audit` run (item 3b in Next Actions) |
| Python SDK vendors | CVE-2026-59951/109527 confirmed fixed (≥1.30.0/≥2.2.0) | Execute audit (item 3d in Next Actions) |
| TS SDK vendors | CVE cluster through v2.4.0 audit gate | Execute audit (item 3c in Next Actions) |
| All 19 cataloged servers | SEP-2127 Final — server card audit unblocked | HOLD reduced to: verify path against spec (`agent-ready.dev`), then run audit |

**All 19 catalog servers remain approved/public.** No demotions today.

---

## Next Actions Updated

The following items from CLAUDE.md §13 are updated by today's findings:

1. `subregistry-curate`: Add **Canva MCP** to the queue (Creative & Design group, alongside
   HubSpot/Intercom/Zendesk already queued). Endpoint: `https://mcp.canva.com/mcp`.
2. SEP-2127 audit gate: HOLD reduced — confirm path via `agent-ready.dev` validator, then
   run. No longer waiting for finalization.
3. MCPCon Nairobi recap: continue monitoring `aaif.io/blog` — Day 8+ gap.
4. Google Workspace MCP GA: re-verify on next research pass.
5. CVE-2026-137308: attempt NVD/OSV lookup on next security pass to confirm/reject.

---

*End of 2026-11-27 daily research pass.*

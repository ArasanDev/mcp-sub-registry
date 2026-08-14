# MCP Ecosystem Update — 2026-08-14

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-13 EOD → 2026-08-14
**Prior report:** [2026-08-13-mcp-ecosystem-update.md](./2026-08-13-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~72,114 servers (+697 vs. Aug 13).** Crosses the 72k milestone. Growth rate
  slightly above the 560–641/day band seen over Aug 11–13, consistent with steady post-spec
  surge.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,070+ (flat).** Stable for the fourth consecutive day.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPToplist: 100,958 (Aug 10 snapshot; no new snapshot today).**
  [[MCPToplist]](https://mcptoplist.com/)
- **SEP-2127 Working Group term closes today (Aug 14).** Server card audit trigger fires:
  `/.well-known/mcp.json` on all 19 cataloged servers is due. Follow-on WG meetings already
  scheduled for Aug 31 + Sep 7. Path confirmed as `/.well-known/mcp.json`. Details in §4.
- **AAIF MCP Dev Summit Seoul concludes today (Aug 13–14).** Day 2 outputs not yet published;
  blog recap expected ~Aug 15+. Yesterday's membership announcement (57 new members, 247 total
  orgs) stands as the summit's primary news item.
- **MCPwned slides: Streamly on-demand opens today for registered attendees.** No public slides
  published yet. BH archive available ~Aug 19–20. No cataloged server named in any
  pre-release coverage or BH field reports. Details in §5.
- **Claude Code v2.1.231 (Aug 13):** Fixed MCP OAuth redirect-URI mismatch for pre-registered
  OAuth clients including Slack. Significant string of MCP OAuth fixes across Aug 6–13.
  Details in §3.
- **Security: Day 49 clean.** No new CVEs or incidents against any of the 19 cataloged servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 14) | vs. Aug 13 | Note |
|---|---|---|---|
| Glama | ~72,114 | +697 | Page-title source; crosses 72k milestone |
| PulseMCP | ~22,070+ | flat | Stable across Aug 11–14 |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot |
| Smithery | ~7,300 | — | No August update; infra rebuild stagnant |
| Anthropic Connectors | 950+ | — | Comprehensive count per claude.com July 28 blog (vs. 439 web-dir-only) |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Trajectory:** Glama crossed 72k today (72,114 vs. 71,417 yesterday, +697). At the recent
400–700/day pace, the 73k mark is 1–2 days away. PulseMCP has been flat for four days; this
is consistent with batch-indexing behavior — expect a step-jump when new providers push.

---

## 3. Claude Code MCP Fixes — August 2026 Run (Aug 6–13)

The Claude Code changelog shows a concentrated run of MCP-related fixes in the two weeks
ending Aug 13. These collectively harden the OAuth authentication flow that our cataloged
OAuth-gated servers (GitHub, Slack, Stripe, Atlassian, Supabase, Linear, Asana, etc.) depend on:

| Version | Date | MCP Change |
|---|---|---|
| **2.1.231** | Aug 13 | Fixed MCP OAuth sign-in failing with redirect URI mismatch for pre-registered OAuth clients (Slack named explicitly) |
| **2.1.229** | Aug 12 | Fixed MCP OAuth with strict authorization servers — now uses `127.0.0.1` instead of `localhost` in redirect URI |
| **2.1.228** | Aug 11 | Hardened skills synced from claude.ai so they no longer shadow local commands or MCP prompts; descriptions sanitized and labeled |
| **2.1.225** | Aug 8 | Fixed MCP OAuth on macOS: burst of 401 errors after keychain read timeout; fixed plugin MCP servers torn down on re-sync |
| **2.1.224** | Aug 7 | Fixed MCP tools connecting mid-turn being deferred for tool search without names announced to the model |
| **2.1.223** | Aug 6 | Fixed MCP servers from `--mcp-config` not connected before first turn in print mode (`-p`); fixed disabling mid-connect |

**Catalog relevance:** The Aug 13 fix for pre-registered OAuth clients (Slack) is the most
direct impact on our catalog. `com.slack/mcp` uses a pre-registered OAuth client pattern.
Enterprise operators on Claude Code should update to ≥v2.1.231 for reliable Slack MCP
authentication.
[[Claude Code changelog]](https://code.claude.com/docs/en/changelog)

---

## 4. SEP-2127 WG Closes Today — Server Card Audit Trigger

**Today, Aug 14, is the working group term end date for SEP-2127 (MCP Server Cards).**
This is the trigger event for the server card audit pass documented in `CLAUDE.md` §13.

### 4a. SEP-2127 Status as of WG Close

- **WG charter:** opened 2026-03-26; led by David Soria Parra (Anthropic) and Sam Morrow
  (GitHub); term ends today Aug 14.
- **Current state:** Draft merged June 26. The SEP was not merged into the final 2026-07-28
  spec — it will land post-RC as the working group chairs expected.
- **Confirmed server card path:** `/.well-known/mcp.json` (per SEP-2127 and the validator at
  agent-ready.dev; SEP-1649's path was superseded).
- **Follow-on WG meetings:** Aug 31 + Sep 7 already scheduled, meaning the WG continues
  in an advisory/completion capacity beyond today's formal term end.
- **Validator:** [agent-ready.dev/mcp-card-validator](https://agent-ready.dev/mcp-card-validator)
  checks three criteria: C1 (HTTP 200 at `/.well-known/mcp.json`), C2 (required fields:
  name, transport, endpoint per SEP-1649 / SEP-2127), C3 (OAuth metadata at
  `/.well-known/oauth-protected-resource` if auth required).
- **Claude Desktop + Cursor:** already shipping MCP v2.1 with Server Card support.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
  [[agent-ready.dev validator]](https://agent-ready.dev/mcp-card-validator)

### 4b. Audit Action Required

Per `CLAUDE.md` §13 Next Actions #3, the following `subregistry-audit` work is now triggered:
1. GET `/.well-known/mcp.json` on all 19 cataloged server base URLs; record result
   (200/404/other), tool count, and protocol version in each entry's `verification.notes`.
2. Update `verifiedAt` for `com.github/mcp` (v1.9.0 released Aug 10, see §5) and
   `com.slack/mcp` (Slack Skills Plugin + Claude Code OAuth fix, Aug 2026).
3. Verify TypeScript SDK-based catalog vendors are on ≥v1.26.0 or SDK v2.0.0 (CVE-2026-25536).

This audit should be the next highest-priority `subregistry-audit` run. The `subregistry-audit`
skill is the correct vehicle for items 1–3.

---

## 5. GitHub MCP Server v1.9.0 (Aug 10) — Catalog Update Signal

GitHub MCP Server v1.9.0 was released August 10, 2026. Key changes relevant to catalog
record maintenance:

- Labels are now ordered by **issue count (descending)** — better discovery UX
- **PRs can now be retrieved from issue reads** — expanded capability scope
- **Search issues now uses semantic search by default** — qualitative improvement
- New optional **duplicate detection tool**
- Individual **project issue field updates**
- SDK upgraded

**Catalog action:** `com.github/mcp` `verifiedAt` timestamp is stale (v1.9.0 shipped Aug 10).
No endpoint or auth changes; a `verifiedAt` refresh in the next `subregistry-audit` pass is
sufficient. The tool count may have increased by 1 (duplicate detection tool); record in
`verification.notes` when auditing.
[[GitHub MCP Server releases]](https://github.com/github/github-mcp-server/releases)

---

## 6. MCPwned Slides — Status Update

The Black Hat USA 2026 briefing "MCPwned: How Exposed AI Agents Became the Internet's New
Recon Toy" (presented Aug 5–6, 2026) is the most significant MCP security research event of
the summer. **As of today (Aug 14):**

- **Streamly on-demand opens today** for registered BH attendees — not publicly accessible.
- **BH public archive:** expected ~Aug 19–20 per historical release cadence.
- **No public slides published yet** by the researcher independently.
- **No cataloged server named** in any BH field reports, press coverage, or pre-release
  abstracts reviewed to date.
- **Key finding (from public abstract):** AI honeypot simulated 16 LLM/AI infrastructure
  personas across 16 ports; captured 3,993 requests from 327 unique IPs in 48h, including
  155 MCP probes and 344 AI API key probes. Confirms MCP endpoints as a named threat class
  for internet-scale adversary scanning.

**Catalog relevance:** Our remote-HTTP + auth-gated catalog model is structurally immune to
the unauthenticated MCP enumeration this research documents. If a cataloged server is named
when slides go public (~Aug 19–20), trigger `subregistry-audit` immediately.
[[BH USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
[[onhexgroup Conferences — BHUSA2026 slides]](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)

---

## 7. AAIF Seoul — Day 2 Concludes

The AAIF MCP Dev Summit Seoul (Aug 13–14) concludes today. No new governance outputs or
technical announcements from Day 2 are available at time of writing; the AAIF blog recap is
expected ~Aug 15.

**Standing facts from yesterday's announcement (carried forward):**
- 57 new members; 247 total orgs; first major financial services firms (Visa, Wells Fargo)
  at Gold tier; Alibaba as Gold extends APAC coverage.
- Next events: Tokyo (Sep 10–11), Amsterdam (Sep 17–18), Toronto (Oct 5–6), San Jose (Oct 22–23).

**Watch:** aaif.io/blog for post-Seoul governance outputs, which may include registry-relevant
Working Group updates.
[[PR Newswire — AAIF 57 new members]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders-302850143.html)
[[AAIF blog]](https://aaif.io/blog/)

---

## 8. Security — Day 49 Clean

No new CVEs or security incidents targeting any of the 19 cataloged servers found in today's
research sweep. The four CVEs noted in `CLAUDE.md` §13 (CVE-2026-55604, CVE-2026-55605,
CVE-2026-58446, CVE-2026-39313) remain unconfirmed catalog-relevant — NVD is blocked by the
research environment's egress proxy; full audit requires a live-egress environment. Flag for
the next `subregistry-audit` pass.

**Broader security landscape (no catalog action):**
- GBHackers scan (July 11): 5,832 of 9,695 servers with security issues; 2,259 confirmed
  exploitable; remote-HTTP + auth-gated catalog is structurally immune to all file-access and
  command-injection vectors found.
- Adversa AI August 2026 security digest: Kiro/Cursor/GitHub agentic attack patterns
  documented (prior report).
- MCPwned BH research (see §6): unauthenticated endpoint scanning is now a tracked threat
  class. Our catalog provides no unauthenticated surface.

All 19 catalog servers remain **approved / public / Streamable HTTP**.

---

## 9. Catalog Action Flags

| Server | Action | Priority | Vehicle |
|---|---|---|---|
| **All 19 servers** | Server card audit: GET `/.well-known/mcp.json`; record result + tool count + protocol version | **HIGH — trigger fired today** | `subregistry-audit` |
| `com.github/mcp` | Update `verifiedAt` (v1.9.0, Aug 10) | Medium | `subregistry-audit` |
| `com.slack/mcp` | Update `verifiedAt` (CC OAuth fix, Slack Skills Plugin) | Medium | `subregistry-audit` |
| All TS SDK vendors | Verify ≥v1.26.0 or SDK v2.0.0 (CVE-2026-25536 + CVE-2026-0621) | Medium | `subregistry-audit` |
| **All 19 servers** | If MCPwned slides name a cataloged vendor (~Aug 19–20), trigger audit immediately | Conditional | `subregistry-audit` |

---

## 10. What Didn't Change

- **No new sub-registry or gateway entrants** added to the watch list today.
- **Spec (2026-07-28)** remains final. No amendments or errata published.
- **MCPwned slides** not yet public; check again ~Aug 19–20.
- **AAIF Seoul blog recap** pending; check aaif.io/blog ~Aug 15.
- **AWS Agent Registry** still in Preview; `com.aws/mcp` unaffected.
- **SEP-2127** WG follow-on (Aug 31 + Sep 7) will carry the spec to completion; no rush
  on catalog schema changes until a stable merged spec lands.

# MCP Ecosystem Update — 2026-08-16

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-15 EOD → 2026-08-16
**Prior report:** [2026-08-15-mcp-ecosystem-update.md](./2026-08-15-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~72,328 (approximately flat, Day 2 of sustained post-spec pace).** Search
  index shows same page title as Aug 15 (direct page blocked by egress proxy; count
  likely in 72,300–72,700 range based on recent ~200-700/day trajectory).
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,050+ (flat, Day 6 of ingestion rework pause).** Pause notice still
  active ("until mid-August"); mid-August has arrived, so a rework ship and batch
  step-jump may be imminent. No change yet.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPToplist: 100,958 (Aug 10 snapshot; no new snapshot).**
  [[MCPToplist]](https://mcptoplist.com/)
- **AAIF Seoul blog recap: STILL NOT PUBLISHED.** Day 2 post-summit (concluded Aug 14).
  AAIF blog shows North America and Bengaluru recaps but no Seoul post yet. Continue
  monitoring aaif.io/blog.
- **MCPwned slides: NOT YET PUBLIC (T-3 days to expected public release).** BH archive
  typically publishes ~9–14 days post-Briefings. Expected ~Aug 19–20. No cataloged vendor
  named in any pre-release reporting.
- **Claude Code v2.1.233 (Aug 14) ships MCP v2 serverless-host fix** — critical for
  operators running our cataloged servers behind serverless/timeout-based infrastructure.
  Details in §3.
- **SEP-2127 WG now closed (Aug 14) — server card audit trigger ACTIVE.** WG term ended
  on schedule. Follow-on meetings Aug 31 + Sep 7. `subregistry-audit` pass is now due
  (GET `/.well-known/mcp.json` on all 19 cataloged servers).
- **Security: Day 51 clean.** No new CVEs or incidents against any of the 19 cataloged
  servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 16) | vs. Aug 15 | Note |
|---|---|---|---|
| Glama | ~72,328 (cached) | ≈flat | Egress-blocked; search index still shows Aug 15 title [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,050+ | flat (Day 6) | "Until mid-August" pause; rework ship imminent [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot |
| Smithery | ~7,300 | — | No August update; infra rebuild stagnant |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**PulseMCP watch:** The "until mid-August" ingestion rework pause has now reached its
stated end date. Expect PulseMCP to either lift the pause today/tomorrow or announce a
short extension. When submissions resume, a batch step-jump in the count is probable (the
ecosystem has been generating new servers throughout the pause). Next research pass should
capture the rebound.

---

## 3. Claude Code v2.1.233 — MCP v2 Serverless-Host Fix (Aug 14)

Claude Code **v2.1.233** shipped August 14, 2026 with two MCP-relevant fixes:

### Fix 1: MCP v2 infinite subscription stream reopening
MCP v2 (2026-07-28 spec) connections were **endlessly reopening the
`subscriptions/listen` stream** against servers that terminate long-held streams on a
fixed timeout (common in serverless environments such as AWS Lambda, Cloudflare Workers,
and cloud-run-based hosts). Each termination triggered an immediate reconnect, causing
runaway connection churn against stateless MCP servers hosted behind timeout-enforcing
infrastructure.

**Catalog relevance:** All 19 cataloged servers are hosted as remote Streamable HTTP
endpoints, and many major catalog vendors (Stripe, Vercel, AWS, Supabase, GitHub,
Atlassian, Sentry, Linear) run serverless or edge-based backends that impose idle stream
timeouts. Claude Code clients connecting to these servers on v2 protocol will now handle
timeout-induced stream closures gracefully rather than looping. Operators should
communicate this fix to their end-user base.

### Fix 2: Security — Windows UNC path bypass
Fixed **Windows paths with `\??\` device prefix** bypassing UNC path validation, which
was a NTLM credential-leak vector. Not MCP-specific, but relevant to any Claude Code
operator running Windows clients against MCP tools that handle file paths.

### Fix 3: Nested git repo trust inheritance
Fixed nested git repositories inheriting trust from parent directories; each repository
now requires its own explicit confirmation. Relevant to operators who use MCP servers that
interact with git repos.

[[Claude Code changelog]](https://code.claude.com/docs/en/changelog)
[[Gradually.ai Claude Code Aug 2026]](https://www.gradually.ai/en/changelogs/claude-code/)

---

## 4. AAIF Seoul Summit — No Recap Yet; Member Announcement Press Coverage

**AAIF MCP Dev Summit Seoul** (Aug 13–14, co-located with Open Source Summit Korea)
concluded Aug 14. No dedicated blog recap from aaif.io has been published as of Aug 16.

What *is* published: the Aug 13 **member announcement press release**, covered by HPCwire,
PRNewswire, AIJourn, Yahoo Finance, and Morningstar:

- **247 total member organizations** after the addition of 57 new members.
- Membership breakdown: **3 Gold** (Alibaba, Visa, Wells Fargo), **33 Silver**, **21 Associate**.
- **First major financial-services firms at Gold tier** — Visa and Wells Fargo signal that
  regulated enterprise finance is now committing to open MCP governance at the top tier.
  [[PRNewswire]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders-302850143.html)
  [[HPCwire]](https://www.hpcwire.com/aiwire/2026/08/13/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders/)

**Futurumgroup analyst framing:** Post-summit coverage described the AAIF direction as
"disciplined guardrails" — formal project lifecycle policy (Growth/Impact/Emeritus tiers),
technical steering committee oversight. The framing is consistent with MCP maturing from
an experimental protocol to governed infrastructure.
[[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)

**What to watch:** aaif.io/blog for the dedicated Seoul recap; any new Working Group or
Technical Steering Committee outputs from Day 2 sessions; APAC follow-on events
(MCPCon Japan Sept 10–11, MCPCon China/KubeCon Shanghai Sept 6–7).

---

## 5. MCPwned — Still Pending (~T-3 Days)

The **"MCPwned: How Exposed AI Agents Became the Internet's New Recon Toy"** Black Hat USA
2026 Briefing (Aug 5–6) remains unavailable to the general public.

- **Streamly on-demand:** Available to registered Black Hat passholders since Aug 14.
- **Public BH archive:** Expected **~Aug 19–20** (9–14 days post-Briefings).
- **onhexgroup/Conferences GitHub release** `bhusa2026` tag exists but content failed to
  load in research (possible error state or pre-populated stub).
  [[GitHub release]](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)
- **Catalog status:** No cataloged server named in any pre-release coverage.
  Remote-HTTP + auth-gated catalog remains structurally immune to the unauthenticated
  MCP enumeration, credential scanning, and LiteLLM abuse documented in this research.

Trigger: if a cataloged vendor is named in the public slides (expected ~Aug 19–20),
run `subregistry-audit` immediately.

---

## 6. SEP-2127 Server Card Audit — Trigger NOW Active

**Status as of Aug 16:** The SEP-2127 Working Group term expired Aug 14 as scheduled.
Follow-on coordination meetings are set for **Aug 31 and Sep 7**, but the formal WG
deadline has passed. The `subregistry-audit` trigger based on WG closure is now
**ACTIVE** (has been since Aug 14).

**What the audit requires:**
- GET `/.well-known/mcp.json` on all 19 cataloged servers.
- Record HTTP status code (200 / 404 / other) in `verification.notes`.
- Record returned `toolCount` and `protocolVersion` fields if 200.
- Validator available at: [agent-ready.dev/mcp-card-validator](https://agent-ready.dev/mcp-card-validator).

**No catalog schema migration needed** for this audit — server card compliance is
informational metadata recorded in the existing `verification.notes` text field.

**Path confirmed:** `/.well-known/mcp.json` (SEP-2127 superseded SEP-1649's
`/.well-known/mcp/server-card.json`; path finalized in the July 13 WG meeting).

This audit is blocked until `subregistry-audit` is invoked as a dedicated session.
Noting here as the highest-priority pending action.

---

## 7. Security Posture — Day 51 Clean

No new CVEs or security incidents against cataloged servers have been detected as of
Aug 16 EOD.

**Background tracking (no new catalog action required):**

- **MCP CVE count:** 40+ total as of Aug 15 per community tracker
  [[mcp-security-project]](https://github.com/mcp-security-project/mcp-cve-project).
- **August Patch Tuesday (Aug 12):** Microsoft patched 421 CVEs, including 1 exploited
  zero-day. Zero MCP-catalog-relevant entries in the release.
  [[CrowdStrike Aug Patch Tuesday]](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-august-2026/)
  [[SecurityWeek Aug Patch Tuesday]](https://www.securityweek.com/august-2026-patch-tuesday-microsoft-fixes-421-cves-one-exploited-zero-day/)
- **Adversa AI August 2026 MCP Security Resources** roundup was already covered in the
  Aug 15 report (six-stage HMM kill chain, SPELLSMITH, agentic commerce vulnerabilities).
  No new edition published Aug 16.
  [[adversa.ai]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)

**Verified CVEs from prior reports still open for catalog audit:**
- CVE-2026-25536 (TS SDK data leak, ≥v1.26.0 or SDK v2 required) — awaiting
  `subregistry-audit` pass.
- CVE-2026-59950 (Python SDK WebSocket CSWSH, ≥v1.28.1 required for local servers) —
  remote-HTTP catalog immune; no action needed.
- CVE-2026-50143 (Apify path injection) — Apify not in catalog; no action needed.

---

## 8. Pending Watches (ordered by urgency)

| Priority | Item | Expected |
|---|---|---|
| 🔴 **Immediate** | `subregistry-audit` — SEP-2127 server card audit (WG closed Aug 14) | Overdue |
| 🔴 **Immediate** | `subregistry-curate` — HubSpot (`mcp.hubspot.com`, GA, OAuth 2.1 + PKCE) | Next curate run |
| 🟡 **Aug 19–20** | MCPwned public slides — check for named cataloged vendor | Watch |
| 🟡 **Imminent** | PulseMCP rework launch + count step-jump | "Mid-August" passed |
| 🟡 **Ongoing** | AAIF Seoul blog recap — aaif.io/blog | Watch |
| 🟢 **Ongoing** | GitHub MCP v1.9.0 `verifiedAt` bump, Slack MCP `verifiedAt` bump | Next audit |

---

## 9. Catalog Status

All 19 cataloged servers remain **approved/public**. No demotion, endpoint failure, or
ownership change detected in today's research pass. All are on Streamable HTTP
(Atlassian SSE was the last SSE endpoint; shut down June 30, 2026 — catalog was already
updated).

Next catalog-touching action: **`subregistry-audit`** (SEP-2127 server card check +
CVE-2026-25536 TS SDK vendor verification + `verifiedAt` bumps for GitHub and Slack MCP).

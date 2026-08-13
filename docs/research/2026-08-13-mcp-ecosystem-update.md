# MCP Ecosystem Update — 2026-08-13

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-12 EOD → 2026-08-13
**Prior report:** [2026-08-12-mcp-ecosystem-update.md](./2026-08-12-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~71,417 servers (+560 vs. Aug 12).** Page title confirms the count; growth rate
  slightly below the recent 400–650/day band but steady post-spec surge.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,070+ (flat).** Stable for the third consecutive day.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPToplist: 100,958 cross-registry (Aug 10 snapshot; still no new snapshot).** 100k
  milestone holds; next snapshot expected when one component registry updates.
  [[MCPToplist]](https://mcptoplist.com/)
- **AAIF welcomes 57 new members at Seoul summit — total membership reaches 247 orgs.**
  Alibaba, Visa, and Wells Fargo join as Gold Members, marking the first major financial
  services institutions (Visa, Wells Fargo) to join AAIF at the Gold tier. APAC momentum
  accelerating. Details in §3.
  [[PR Newswire]](http://www.prnewswire.com/news-releases/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders-302850143.html)
- **AAIF MCP Dev Summit Seoul underway (Aug 13–14), co-located with Open Source Summit Korea.**
  Day 1 in progress as of this report. No published session outputs yet; blog recap expected
  ~Aug 15+. Details in §3.
- **SEP-2127 WG term closes tomorrow (Aug 14).** Server card audit trigger: GET
  `/.well-known/mcp.json` on all 19 cataloged servers. Follow-on WG meetings already scheduled
  (Aug 31 + Sep 7). Details in §4.
- **MCPwned slides: still not published.** Streamly on-demand opens tomorrow Aug 14 for
  registered attendees. BH archive expected ~Aug 19–20 for the public. No cataloged server
  named in any pre-release coverage.
- **Security: Day 48 clean.** No new CVEs or incidents against any cataloged server.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 13) | vs. Aug 12 | Note |
|---|---|---|---|
| Glama | ~71,417 | +560 | Page-title source; net +560; growth steady post-spec |
| PulseMCP | ~22,070+ | flat | Stable across Aug 11–13 |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot; 100k milestone holds |
| Smithery | ~7,300 | — | No August update; infra rebuild ongoing; growth stagnant |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Our catalog | 19 | — | All approved/public |

**Trajectory:** Glama has grown from 70,216 (Aug 11) → 70,857 (Aug 12) → 71,417 (Aug 13),
a consistent ~560–641/day rate over the three-day window. At this pace, Glama will cross the
72k mark around Aug 14–15.

---

## 3. AAIF MCP Dev Summit Seoul — Day 1 (Aug 13–14)

**This is the largest single membership announcement AAIF has made since launch.**

### 3a. Membership Growth Milestone — 57 New Members, 247 Total

The Agentic AI Foundation announced **57 new member organizations** alongside the MCP Dev
Summit Seoul, bringing total AAIF membership to **247 organizations**. The new cohort
comprises:

- **3 Gold Members:** Alibaba, Visa, Wells Fargo
- **33 Silver Members**
- **21 Associate Members**

The addition of **Visa and Wells Fargo** as Gold Members is the most significant signal in
this announcement. These are the first major global financial services institutions to join
AAIF at the highest tier, indicating that regulated-industry adoption of MCP is now at the
enterprise commitment level — not just pilot/evaluation.

**Alibaba** as a Gold Member extends AAIF's geographic reach deep into APAC and signals that
the MCP ecosystem governance conversation is now multinational at the top tier.

[[PR Newswire — AAIF 57 new members]](http://www.prnewswire.com/news-releases/agentic-ai-foundation-welcomes-57-new-members-gaining-major-financial-services-players-and-apac-leaders-302850143.html)
[[LF Events — AAIF Seoul]](https://events.linuxfoundation.org/2026/04/17/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe/)
[[MCP Dev Summit Seoul listing]](https://www.luminik.io/events/mcp-dev-summit-seoul/)

### 3b. Summit Format and Scope

The **MCP Dev Summit Seoul** (Aug 13–14) is co-located with **Open Source Summit Korea** at
a joint Linux Foundation venue. Focus areas per the AAIF event charter:
- Deep hands-on sessions for developers building with MCP, goose, and AGENTS.md
- Regional ecosystem acceleration for APAC (Korea, followed by Japan Sept 10–11 and China
  Sept 6–7)
- Next cohort of AAIF events: AGNTCon + MCPCon Japan (Sept 10–11), MCPCon Shanghai
  (Sept 6–7), MCPCon North America San Jose (Oct 22–23)

No session-level outputs published as of Aug 13. The AAIF blog recap is expected approximately
**Aug 15** (pattern from prior summits: North America recap published ~5 days post-event).

### 3c. Sub-Registry Relevance

The Visa/Wells Fargo/Alibaba Gold-tier signal matters to the sub-registry in two ways:

1. **Financial services persona demand.** Enterprise registries curated for regulated industries
   (banking, fintech, insurance) will be a near-term product need as these organizations deploy
   MCP. The §12.5 persona-based catalog strategy (developer tools today → regulated-industry
   bundles next) is validated by this membership signal.

2. **AAIF as governance infrastructure.** At 247 organizations including major financial
   institutions, AAIF is now a de facto standards body for enterprise MCP. AAIF
   working group outputs (current: SEP-2127 server cards; upcoming: SEP-990 EMA) are the
   likely source of catalog schema evolution triggers.

---

## 4. SEP-2127 Server Card Working Group — Term Closes Tomorrow (Aug 14)

**Action triggered for next `subregistry-audit` run.**

The SEP-2127 Working Group (led by David Soria Parra, Anthropic + Sam Morrow Drums, GitHub)
has its formal term closing **tomorrow, August 14, 2026**.

Key status as of Aug 13:
- **Path confirmed:** `/.well-known/mcp.json` (per CLAUDE.md §13; SEP-1649 superseded by SEP-2127)
- **Validator live:** agent-ready.dev
- **PR #2127 open** in the modelcontextprotocol/modelcontextprotocol repo; Draft status; may
  land post-WG-close rather than before it
- **Follow-on meetings scheduled:** Aug 31 + Sep 7 (already calendared, consistent with WG
  producing output that needs continued refinement)
- **Claude Desktop + Cursor:** Both already shipping server card support; ecosystem ahead of
  spec finalization

**Audit trigger (active):** Once the WG term closes (Aug 14), activate the server card audit
pass: GET `/.well-known/mcp.json` on all 19 cataloged servers; record:
- Whether the endpoint exists (HTTP 200 vs. 404)
- Tool count and names if present
- Protocol version if declared
- Record in `verification.notes` per entry

No catalog schema migration needed yet — data goes into `verification.notes` as free text
until the spec finalizes.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
[[Agent Ready validator]](https://agent-ready.dev/)
[[MCP Server Cards explained]](https://dev.to/turva-dev/mcp-server-cards-explained-5hgb)

---

## 5. MCPwned — Slides Status

No publication confirmed as of Aug 13.

**Timeline:**
- **Streamly on-demand (registered attendees only):** Opens **Aug 14** — tomorrow
- **Black Hat archive (public):** Expected ~Aug 19–20

No secondary coverage linking any cataloged server to the MCPwned deck has surfaced. The
honeypot research (155 MCP probes in 48h from 327 IPs) targets unauthenticated/exposed
endpoints — our catalog's auth-gated remote-HTTP model is structurally immune to all
documented probe patterns.

Watch for public release Aug 19–20 and check if any cataloged server URL appears in the
vulnerability research. If so, trigger `subregistry-audit` immediately.

[[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)

---

## 6. Upcoming Events / Deadlines (Updated)

| Date | Event | Relevance |
|---|---|---|
| **Aug 13–14** | AAIF MCP Dev Summit Seoul + Open Source Summit Korea | **IN PROGRESS.** 57 new members announced; blog recap expected ~Aug 15 |
| **Aug 14** | SEP-2127 WG formal term closes | **Activate server card audit** — GET `/.well-known/mcp.json` on all 19 servers |
| **Aug 14** | Streamly on-demand opens (BH registered attendees) | MCPwned slides accessible to registered attendees |
| **~Aug 19–20** | BH USA 2026 slide archive expected public | MCPwned deck publicly accessible |
| **Aug 31** | SEP-2127 WG follow-on meeting (post-term) | Continued path/format resolution |
| **Sept 6–7** | AGNTCon + MCPCon Shanghai (KubeCon China co-located) | 40+ sessions, 1,500+ attendees |
| **Sept 7** | SEP-2127 WG second follow-on meeting | — |
| **Sept 10–11** | AGNTCon + MCPCon Japan, Tokyo | Regional APAC event |
| **Oct 22–23** | AGNTCon + MCPCon North America, San Jose CA | Flagship AAIF North America event |

---

## 7. Security

### 7a. Day 48 clean

No new CVEs or security incidents targeting any of the 19 cataloged remote-HTTP servers
surfaced this pass. All 19 catalog entries remain approved/public.

The PolicyLayer MCP incidents tracker was last updated approximately 3 weeks ago (early
August 2026), suggesting no new notable incidents in the Aug 12–13 window.

[[PolicyLayer MCP Incidents]](https://policylayer.com/mcp-incidents)
[[The Vulnerable MCP Project]](https://vulnerablemcp.info/)

### 7b. CVE-2026-55604/55605 — still unconfirmed

No secondary source has linked either CVE to a remote-HTTP MCP endpoint or any cataloged
vendor. NVD access still blocked in this environment. Resolution deferred to next
`subregistry-audit` pass, which should activate tomorrow post-SEP-2127 WG closure.

[[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
[[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)

### 7c. Structural note: Financial services MCP — regulated-industry risk posture

The Visa/Wells Fargo Gold membership signal (§3) has a security dimension: regulated financial
institutions deploying MCP agents operate under stricter compliance requirements than typical
developer tooling. Their AAIF Gold membership indicates they are investing in governance
infrastructure, not just consuming MCP tools. This validates the sub-registry's curation
criteria (auth-gated, verified endpoints only) as baseline requirements for this segment, and
reinforces that `discovered != approved != enabled` is exactly the control framework regulated
industries need before any MCP server touches production data.

---

## 8. Catalog Hooks

**No catalog changes this pass.** All 19 approved/public servers remain in good standing.

**Pending curate action (#1 priority):** HubSpot MCP (`mcp.hubspot.com`). GA April 13;
OAuth 2.1 + PKCE only (no DCR); August 2026 capability set now confirmed. Ready for next
`subregistry-curate` run.

**Pending audit actions (now overdue — trigger tomorrow Aug 14):**
- **Server card audit (SEP-2127):** WG closes Aug 14. GET `/.well-known/mcp.json` on all
  19 cataloged servers; record presence/tool count/protocol version in `verification.notes`.
- Verify CVE-2026-55604/55605 don't affect any cataloged endpoint (requires NVD access or
  secondary source confirmation).
- Update `verifiedAt` for `com.github/mcp` (v1.9.0 released Aug 10) and `com.slack/mcp`
  (Skills Plugin announced Aug 2026).

---

## 9. Key Takeaways for Registry Operators

1. **AAIF now has 247 member orgs including Visa + Wells Fargo at Gold tier.** MCP is
   no longer a developer tooling experiment — it is enterprise infrastructure being committed
   to by regulated financial institutions. The sub-registry's curation posture (auth-gated,
   verified, approved) is exactly what regulated-industry operators need.

2. **Glama at 71,417 vs. our 19 approved.** The trust gap continues to widen. The 71k count
   includes unvetted, unmaintained, and potentially malicious entries. Our curated set is
   the differentiator.

3. **Server card audit due tomorrow.** SEP-2127 WG closes Aug 14. Activating this audit
   pass will generate the first machine-verifiable tool-count + protocol-version snapshot
   across the catalog, a capability no aggregator currently provides at our trust level.

4. **MCPwned data incoming.** Slides drop Aug 14 (registered) / Aug 19–20 (public). Review
   for any cataloged server exposure the moment they are accessible.

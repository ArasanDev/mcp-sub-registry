# MCP Ecosystem Update — 2026-08-15

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-14 EOD → 2026-08-15
**Prior report:** [2026-08-14-mcp-ecosystem-update.md](./2026-08-14-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~72,328 (+214 vs. Aug 14).** Steady post-spec growth; pace has moderated to
  ~200–700/day range. [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,070+ (flat, Day 5).** Submissions and listing changes were paused
  through mid-August while PulseMCP reworked its ingestion pipeline and listing
  management processes. Expect a step-jump count when the rework ships.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **MCPToplist: 100,958 (Aug 10 snapshot; no new snapshot).** No update today.
  [[MCPToplist]](https://mcptoplist.com/)
- **AAIF Seoul blog recap: NOT YET PUBLISHED.** Summit concluded Aug 14. Blog recap
  (expected ~Aug 15+) not yet visible in public search. Monitor aaif.io/blog.
- **MCPwned slides: NOT YET PUBLIC.** Black Hat briefing was Aug 5–6; BH archives
  slides ~9–14 days after briefings. Public availability expected **~Aug 19–20**.
  No cataloged server named in any pre-release coverage or field reports.
- **Two new MCP CVEs published:** CVE-2026-59950 (MCP Python SDK WebSocket CSWSH,
  CVSS 7.6, patched in v1.28.1) and CVE-2026-50143 (Apify actors-mcp-server path
  authority injection, CVSS 8.1, patched in v0.10.11). Neither affects remote-HTTP
  cataloged servers. Details in §5.
- **Adversa AI August 2026 security digests published** — MCP, AI Coding Agent, and
  Agentic AI. New research: six-stage MCP kill chain (HMM-based), SPELLSMITH
  tool-description hardening, 33 structural agentic commerce vulnerabilities. Details in §6.
- **Agent Plugins 1.0 extended to VS Code, Copilot CLI, and Copilot app (Aug 12).**
  Open standard packages MCP server configs + agent skills in one portable plugin.
  Details in §7.
- **Security: Day 50 clean.** No new CVEs or incidents against any of the 19 cataloged
  servers.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 15) | vs. Aug 14 | Note |
|---|---|---|---|
| Glama | ~72,328 | +214 | Page-title source [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,070+ | flat | Submissions paused mid-Aug for rework [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap) | No new snapshot |
| Smithery | ~7,300 | — | No August update; infra rebuild stagnant |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Trajectory note — PulseMCP pause:** The PulseMCP team paused new submissions and
listing changes through mid-August to rework their ingestion and listing management
processes. This explains five consecutive flat days. Once the rework ships, expect a
batch-style jump in the count. The pause affects the directory count only; the underlying
MCP ecosystem growth continues as measured by Glama.

---

## 3. AAIF Seoul Summit — Day 2 Outputs Pending

The **AAIF MCP Dev Summit Seoul** (Aug 13–14, co-located with Open Source Summit Korea)
concluded on Aug 14. The previously reported Day 1 outputs (57 new members, 247 total orgs;
Alibaba + Visa + Wells Fargo Gold tier; APAC momentum) stand. No Day 2 governance outputs
or session recordings have been published as of Aug 15 EOD.

The **Futurumgroup** analyst report published after Day 1 framed the summit's direction as
"disciplined guardrails" — AAIF setting a clear direction with formal project lifecycle
policy (Growth / Impact / Emeritus tiers) and technical steering committee oversight.
[[Futurumgroup]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)

**What to watch (Aug 15+):** aaif.io/blog for the full summit recap; any new Working Group
or Technical Steering Committee outputs from Day 2 sessions.

---

## 4. MCPwned — Slides Still Pending

The **"MCPwned: How Exposed AI Agents Became the Internet's New Recon Toy"** Black Hat USA
2026 Briefing (Aug 5–6) remains unreleased to the general public. Key confirmed facts:

- **Honeypot data:** Purpose-built AI honeypot across 16 ports captured 3,993 requests in
  48 hours from 327 unique source IPs; 155 of those were MCP probes; 344 were AI API key
  probes. [[Black Hat briefings]](https://blackhat.com/us-26/briefings.html)
- **Attack patterns catalogued:** LiteLLM model-registration abuse, MCP resource
  enumeration, framework-aware credential brute-forcing, coordinated scanning for local
  inference services.
- **On-demand via Streamly:** Available to registered event passholders since Aug 14.
  Public BH archive expected **~Aug 19–20**.
- **Catalog status:** No cataloged server named in any pre-release coverage or field
  reports. Remote-HTTP + auth-gated catalog is structurally immune to the unauthenticated
  enumeration and credential scanning documented in this research.

Trigger: if a cataloged vendor is named in the public slides (~Aug 19–20), run
`subregistry-audit` immediately.

---

## 5. New MCP CVEs (Aug 14–15)

### CVE-2026-59950 — MCP Python SDK WebSocket CSWSH (CVSS 7.6 High)

**Package:** `mcp` (Python SDK) — deprecated WebSocket server transport
**Affected:** all versions < 1.28.1
**Fix:** 1.28.1 (already shipped)
**Mechanism:** The deprecated WebSocket transport accepted incoming connection handshakes
without validating `Host` or `Origin` headers. Because browsers do not apply Same-Origin
Policy to WebSocket connections, malicious third-party websites can hijack the user's local
MCP server session (Cross-Site WebSocket Hijacking / CSWSH), executing unauthorized tool
calls on behalf of the local user.
**Catalog impact:** NONE. This is a client-side, local-process vulnerability targeting the
*deprecated* WebSocket transport. All 19 of our cataloged servers are remote Streamable
HTTP endpoints; none run Python SDK WebSocket listeners. Operators running local Python SDK
MCP servers should be on ≥v1.28.1.
[[CVEReports]](https://cvereports.com/reports/CVE-2026-59950)
[[OffSeq]](https://radar.offseq.com/threat/cve-2026-59950-cwe-346-origin-validation-error-in--7f9c3dc7ebb08466)

### CVE-2026-50143 — Apify actors-mcp-server Path Authority Injection (CVSS 8.1 High)

**Package:** `@apify/actors-mcp-server` (npm)
**Affected:** all versions < 0.10.11
**Fix:** 0.10.11
**Mechanism:** The server built Actor standby URLs by directly concatenating a trusted base
URL with an attacker-controlled `webServerMcpPath` value from an Actor definition returned
by the Apify API. An attacker who publishes a malicious Actor with a crafted
`webServerMcpPath` (e.g., `@attacker.example/mcp`) causes the MCP client to resolve the
final URL to an entirely different host, and because the client unconditionally attaches
`Authorization: Bearer <APIFY_TOKEN>` to every outbound connection, the victim's Apify API
token is exfiltrated to the attacker's server.
**Catalog impact:** NONE. Apify is not in our catalog. This is an npm package
vulnerability affecting the Apify actor MCP server. Remote-HTTP-only catalog is
structurally immune to actor definition injection attacks.
[[GitLab Advisory]](https://advisories.gitlab.com/npm/@apify/actors-mcp-server/CVE-2026-50143/)

**CVE tally update:** MCP-related CVEs now total 40+, per the community CVE tracker.
[[mcp-security-project/mcp-cve-project]](https://github.com/mcp-security-project/mcp-cve-project)
[[dev.to tracker]](https://dev.to/piiiico/mcp-security-vulnerabilities-in-2026-40-cves-and-counting-4pco)

---

## 6. Adversa AI August 2026 Security Digests

Adversa AI published three separate August 2026 security resource digests:
1. **MCP Security Resources — August 2026**
   [[adversa.ai]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
2. **Top AI Coding Agent Security Resources — August 2026**
   [[adversa.ai]](https://adversa.ai/blog/top-ai-coding-agent-security-resources-august-2026/)
3. **Top Agentic AI Security Resources — August 2026**
   [[adversa.ai]](https://adversa.ai/blog/top-agentic-ai-security-resources-august-2026/)

**Notable new research surfaced in these digests:**

- **Six-stage MCP kill chain + Hidden Markov Model (HMM) detection:** Researchers modelled
  MCP attacks as a six-stage kill chain and applied a Hidden Markov Model to tool call
  sequences to detect malicious chains assembled from individually benign invocations. This
  is a promising behavioral-detection approach that complements the current registry-level
  approval control.

- **SPELLSMITH — tool description hardening:** Embeds security guidance directly into tool
  descriptions to steer agents away from unsafe argument patterns (e.g., path traversal).
  Proposed mitigation for taint-style vulnerabilities. Relevant to catalog curation: a
  trusted MCP server that applies SPELLSMITH-style descriptions earns additional trust signal
  beyond endpoint reachability.

- **33 structural vulnerabilities in agentic commerce:** Cross-platform analysis of agentic
  commerce systems found 33 structural vulnerabilities that succeed deterministically
  regardless of the underlying model. Three chain into a payment hijack. Protocol-layer
  defences bring structural attack success toward zero for most vulnerability classes.

- **Taint-style flaws widespread and slow to fix:** Systematic study confirmed that taint-
  style vulnerabilities (unsafe argument propagation) are a substantial fraction of MCP server
  flaws and that remediation timelines are long. Corroborates the value of `verifiedAt`
  timestamps and periodic re-auditing in our catalog.

**Catalog relevance:** No new CVEs from these digests target our 19 cataloged remote-HTTP
servers. The HMM kill-chain research is gateway/runtime-layer (not registry-layer); the
taint-style finding reinforces the audit cadence.

---

## 7. Agent Plugins 1.0 — Extended to VS Code, Copilot CLI, Copilot App (Aug 12)

**Agent Plugins 1.0** is an open, vendor-neutral standard (announced Aug 6, 2026) for
packaging reusable agent components — skills and MCP server configurations — into a single
portable plugin installable across multiple AI agent clients. Co-founded by GitHub, AWS,
Anysphere (Cursor), Microsoft, OpenAI, Vercel, and Google (which joined as a core
maintainer on launch day).

**Aug 12 extension:** The standard is now live in VS Code, Copilot CLI, and the Copilot
app. [[GitHub Changelog]](https://github.blog/changelog/2026-08-12-agent-plugins-1-0-in-vs-code-copilot-cli-and-the-copilot-app/)

**Structure:** A plugin is a directory with a `plugin.json` manifest at root, an optional
`skills/` folder (immediate subdirectories each contain a `SKILL.md`), an optional
`mcp.json` describing MCP servers, and optional reverse-domain directories for
client-specific extensions.

**Relationship to MCP:** Agent Plugins *packages* MCP; it does not replace it. An MCP
server specification in `mcp.json` inside a plugin becomes auto-configured when the plugin
is installed. This is a distribution mechanism, not a registry or governance layer.

**Landscape relevance:** The cross-vendor adoption (GitHub, AWS, Cursor/Anysphere,
Microsoft, OpenAI, Vercel, Google) makes Agent Plugins a credible distribution standard.
The `mcp.json` inside a plugin is a new surface for MCP server allowlisting — it could
reference catalog-provided `remotes[].url` values, reinforcing the "approved catalog as
input to allowlist" pattern from GitHub Enterprise MCP Allowlists (GA Aug 6) and Kiro IDE.
[[agentplugins.codes]](https://agentplugins.codes/)

---

## 8. Security Posture — Day 50 Clean

All 19 cataloged servers remain **approved / public / Streamable HTTP**. No new CVEs or
incidents against any cataloged endpoint were published on Aug 14–15.

Running security timeline:
- **CVE-2026-59950** (Aug 14–15): Python SDK WebSocket CSWSH — patched in v1.28.1; not
  a catalog concern (remote-HTTP model immune).
- **CVE-2026-50143** (Aug 14–15): Apify actor path injection — patched in v0.10.11; not
  in catalog.
- **MCPwned** BH briefing (Aug 5–6): unauthenticated endpoint scanning documented at
  scale — remote-HTTP + auth-gated catalog is structurally immune.
- **Azure DevOps MCP Confused Deputy Attack** (Aug 11 research flag): no CVE, MSRC
  triaging; `com.github/mcp` is separate and unaffected.
- **Security Day 50 clean window** continues against all 19 cataloged servers since
  June 26.

---

## 9. Catalog Action Flags

| Server | Action | Priority | Vehicle |
|---|---|---|---|
| **All 19 servers** | SEP-2127 server card audit: GET `/.well-known/mcp.json`; record HTTP status, tool count, protocol version | **HIGH — trigger fired Aug 14** | `subregistry-audit` |
| `com.github/mcp` | Update `verifiedAt` (v1.9.0, Aug 10; semantic search default, PR-from-issue read, duplicate detection tool) | Medium | `subregistry-audit` |
| `com.slack/mcp` | Update `verifiedAt` (Slack Skills Plugin GA; CC v2.1.231 OAuth fix) | Medium | `subregistry-audit` |
| All Python SDK vendors | Verify on `mcp>=1.28.1` (CVE-2026-59950 CSWSH) or migrated to SDK v2.0.0 | Low-Medium | `subregistry-audit` |
| All TS SDK vendors | Verify ≥v1.26.0 or SDK v2.0.0 (CVE-2026-25536 + CVE-2026-0621) | Medium | `subregistry-audit` |
| **All 19 servers** | If MCPwned public slides (~Aug 19–20) name a cataloged vendor, trigger audit immediately | Conditional | `subregistry-audit` |

---

## 10. What Didn't Change

- **No new sub-registry or gateway entrants** added to the watch list today.
- **Spec (2026-07-28)** remains final. No amendments or errata.
- **MCPwned slides** not yet public; re-check **~Aug 19–20**.
- **AAIF Seoul blog recap** not yet published; re-check aaif.io/blog daily until live.
- **AWS Agent Registry** still in Preview; `com.aws/mcp` unaffected.
- **SEP-2127** WG follow-on meetings Aug 31 + Sep 7; no rush on catalog schema changes
  until a stable merged spec lands.
- **HubSpot MCP** (`mcp.hubspot.com`) remains #1 next curate candidate; no new capability
  announcements today.
- **PulseMCP rework** in progress; count remains flat until mid-August rework ships.

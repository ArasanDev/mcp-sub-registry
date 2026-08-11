# MCP Ecosystem Update — 2026-08-11

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-10 EOD → 2026-08-11
**Prior report:** [2026-08-10-mcp-ecosystem-update.md](./2026-08-10-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama crosses 70k milestone: ~70,216 servers (+404 vs Aug 10).** The 70k threshold was
  breached overnight. Sustained post-spec indexing surge at ~400–500/day net continues.
  [[Glama]](https://glama.ai/mcp/servers)
- **MCPToplist crosses 100k milestone: 100,958 cross-registry servers (Aug 10 snapshot).**
  The aggregated cross-registry index (Official MCP Registry + Glama + Smithery + mcp.so +
  PulseMCP) has passed 100,000 for the first time, up from ~96,771 (Aug 2 snapshot).
  This is a significant ecosystem-scale signal. [[MCPToplist]](https://mcptoplist.com/)
- **PulseMCP: ~22,070+ (flat).** No material change vs. prior days.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **Azure DevOps MCP Confused Deputy Attack disclosed (Manifold Security).** Hidden HTML
  comments in PR descriptions carry indirect prompt injection; the Microsoft Azure DevOps MCP
  server returns them without applying spotlighting. A hijacked AI review agent can approve PRs,
  trigger cross-project pipelines, read confidential wikis, and exfiltrate data via PR comments.
  No CVE assigned; no fix shipped as of reporting date. MSRC acknowledged and triaged.
  Client-side / server-implementation concern; remote-HTTP catalog structurally immune.
  [[Manifold Security]](https://www.manifold.security/blog/azure-devops-mcp-server-vulnerability)
  [[eSecurity Planet]](https://www.esecurityplanet.com/threats/azure-devops-prompt-injection-targets-ai-coding-agents/)
  [[Mallory]](https://mallory.ai/stories/019f8983-e78d-7da1-a7bb-3589a7b269a0)
- **Adversa AI "MCP Security Best Practices & Resources: August 2026" digest published.**
  Covers the Azure DevOps attack, 2026-07-28 spec authorization hardening, taint-style
  propagation flaws in MCP servers, and 33 structural vulnerabilities in agentic commerce flows.
  Also separately published "Top AI Coding Agent Security Resources — August 2026."
  [[Adversa AI August 2026]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
  [[Adversa AI coding agent August 2026]](https://adversa.ai/blog/top-ai-coding-agent-security-resources-august-2026/)
- **AAIF MCP Dev Summit Seoul begins tomorrow (Aug 13–14).** Co-located with Open Source
  Summit Korea. Confirmed speakers include Ana Jiménez Santamaria (Linux Foundation) and Ian Y.
  Choi (AWS). Post-summit governance outputs expected ~Aug 15+ on aaif.io.
  [[MCP Dev Summit Seoul]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
- **SEP-2127 WG closes Thursday (Aug 14 — 3 days).** Follow-up meetings already scheduled for
  Aug 31 and Sep 7, indicating the working group intends to continue as a recurring forum even
  after the formal charter term closes. Path `/.well-known/mcp.json` confirmed as the primary
  site-level discovery endpoint; per-server endpoint is `<mcp-endpoint-url>/server-card`.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
- **MCPwned slides: still not published.** No materials on BH site as of Aug 11. Streamly
  opens Aug 14 for registered attendees; BH archive ~Aug 19–20 for the public.
  [[Team Cymru BH2026]](https://event.team-cymru.com/black-hat-usa-2026)
- **Security: Day 46 clean.** No new CVEs confirmed against any cataloged server. All 19
  catalog entries remain approved/public.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 11) | vs. Aug 10 | Note |
|---|---|---|---|
| Glama | ~70,216 | +404 | **Crosses 70k milestone** (page title source; BH-page confirmed) |
| PulseMCP | ~22,070+ | flat | Stable; no new batch indexing observed |
| MCPToplist (cross-registry) | **100,958** | (Aug 10) | **Crosses 100k milestone** — aggregates Official Registry + Glama + Smithery + mcp.so + PulseMCP |
| Anthropic Connectors (vetted web dir.) | 439 | — | Stable |
| Our catalog | 19 | — | All approved/public; no changes this pass |

Both the Glama 70k and the MCPToplist 100k milestones land in the same 24-hour window —
reflecting the accelerating indexing rate following the 2026-07-28 spec final release.
The trust gap between indexed and approved continues to widen: ~100k+ indexed across
registries vs. 19 approved in our curated catalog.

---

## 3. Azure DevOps MCP Confused Deputy Attack

**Newly documented attack class this pass:** Manifold Security disclosed a prompt injection
vulnerability in Microsoft's official Azure DevOps MCP server. The mechanism:

1. An attacker embeds malicious instructions inside HTML comments in a pull request description.
2. In the Azure DevOps web UI, these comments are invisible to human reviewers.
3. The Azure DevOps MCP API returns PR descriptions verbatim, including HTML comments.
4. The `get_pull_request` MCP tool in Microsoft's server hands the raw content to the AI agent
   **without applying spotlighting** (Microsoft's own mitigation that marks untrusted content).
5. The agent interprets the embedded instructions as legitimate commands.

**Demonstrated impact in PoC:** The hijacked AI reviewer approved a PR, triggered a pipeline
in a different project, read a confidential wiki page, and exfiltrated the stolen content
by posting it back in a PR comment — all using the victim developer's own legitimate permissions.

**Root cause:** Inconsistent application of spotlighting across MCP server tools. Tools
returning pipeline and wiki content did apply spotlighting; the PR description tool did not.

**Status:** Manifold Security reported to Microsoft Security Response Center (MSRC). MSRC
acknowledged and triaged. **No CVE assigned. No fix shipped as of Aug 11, 2026.**

**Catalog impact:** None. This is a server-implementation flaw in Microsoft's own Azure DevOps
MCP server, not in any cataloged endpoint. Azure DevOps is an org-specific SaaS product with
per-tenant URLs — not catalogable in our universal registry regardless. The attack is a
client-host concern; our remote-HTTP catalog posture is structurally immune.

**Wider significance:** Third distinct spotlighting/data-exfiltration pattern in 2026 (after
Sentry DSN injection / Agentjacking in June and GitHub Agentic Workflows data leak in Adversa
August digest). Reinforces that MCP server operators — including major vendors — must apply
content sanitization or spotlighting consistently across every tool that returns user-controlled
data. This pattern is relevant to our `subregistry-audit` criteria: when auditing new catalog
candidates, verify whether the vendor has documented their spotlighting/sanitization policy.

[[Manifold Security blog]](https://www.manifold.security/blog/azure-devops-mcp-server-vulnerability)
[[eSecurity Planet coverage]](https://www.esecurityplanet.com/threats/azure-devops-prompt-injection-targets-ai-coding-agents/)
[[Mallory summary]](https://mallory.ai/stories/019f8983-e78d-7da1-a7bb-3589a7b269a0)

---

## 4. Adversa AI August 2026 Security Digest

Adversa AI published its monthly "MCP Security Best Practices & Resources" installment for
August 2026. Key items covered (direct access blocked in this environment; summary from search
snippets):

- **Azure DevOps confused deputy attack** (§3 above) — primary featured incident.
- **2026-07-28 spec authorization hardening** — DCR deprecated in favor of CIMD; issuer
  parameter validation per RFC 9207 (closes authorization-server mix-up class); client
  credentials now issuer-bound. Analysis of how spec changes shift security responsibilities
  from the protocol to server operators and gateway platforms.
- **Taint-style propagation flaws** — systematic study finds these are common in MCP server
  implementations and slow to be patched. User-supplied data flows through tool return values
  into agent context without sanitization.
- **33 structural vulnerabilities in agentic commerce flows** — cross-platform analysis showing
  deterministic exploitation regardless of the underlying model, indicating architectural
  rather than model-specific weaknesses.
- Also published separately: **"Top AI Coding Agent Security Resources — August 2026"** (first
  time Adversa added a coding-agent-specific digest alongside the MCP digest — signals maturing
  of the coding-agent attack surface as a distinct research domain).

**Catalog impact:** None. All attack patterns are server-implementation or client-host concerns;
remote-HTTP catalog immune.
[[Adversa AI August 2026 MCP digest]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
[[Adversa AI August 2026 coding agent digest]](https://adversa.ai/blog/top-ai-coding-agent-security-resources-august-2026/)

---

## 5. SEP-2127 Server Cards — WG Close Imminent (Aug 14)

The SEP-2127 Working Group's formal charter term closes in **3 days (Aug 14)**. Key status:

- **Follow-up meetings already scheduled:** Aug 31 and Sep 7. This indicates the WG intends
  to continue as a recurring community forum even after the formal term closes, likely to
  drive final merges and resolve path/format edge cases.
- **Path clarification:** `/.well-known/mcp.json` is the confirmed primary site-level
  discovery endpoint. Per-server cards are also accessible at `<mcp-endpoint>/server-card`.
  A site-level catalog variant (`/.well-known/mcp/catalog.json`) is proposed for multi-server
  domains. Claude Desktop and Cursor already ship support.
- **Validator live:** agent-ready.dev. Multiple implementation guides published (turva.dev,
  ekamoira.com, agent-ready.dev).

**Sub-registry action triggered when WG closes (Aug 14):** extend `subregistry-audit` to
GET `/.well-known/mcp.json` on each of the 19 cataloged servers; record tool count and
protocol version in `verification.notes`. No schema migration needed.
[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Server Card WG Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
[[Server Card Validator]](https://agent-ready.dev/mcp-card-validator)

---

## 6. AAIF Seoul Summit — Starts Tomorrow

MCP Dev Summit Seoul (Aug 13–14, co-located with Open Source Summit Korea) begins tomorrow.
Key context:

- Confirmed speakers include Ana Jiménez Santamaria (Sr. Project Manager, Linux Foundation)
  and Ian Y. Choi (AWS).
- Previous summits produced governance outputs: AAIF North America produced the enterprise
  infrastructure characterization ("78% of enterprise AI teams have MCP-backed agents in
  production"; "97M monthly SDK downloads"), and the MCP North America blog triggered the
  SEP-990/EMA stable announcement. Seoul outputs on aaif.io expected ~Aug 15+.
- Monitor: governance policy updates, new AAIF project lifecycle decisions, and any spec
  roadmap announcements from Anthropic/AWS speakers.

[[MCP Dev Summit Seoul]](https://events.linuxfoundation.org/mcp-dev-summit-seoul/)
[[AAIF blog]](https://aaif.io/)

---

## 7. Security

### 7a. Day 46 clean

No new CVEs or security incidents targeting any of the 19 cataloged remote-HTTP servers
surfaced this pass. The standing threat landscape (Miasma waves 1–3, SANDWORM_MODE, IronWorm,
Hades wave, UNC1069/WAVESHAPER.V2) is unchanged; remote-HTTP-only catalog structurally immune
to all npm/repo-based worm vectors.

### 7b. CVE-2026-55604/55605 (still unconfirmed)

NVD pages confirmed to exist. No secondary source links either CVE to any remote-HTTP MCP
endpoint or cataloged vendor. Verification still blocked pending NVD access. Will attempt
resolution in next `subregistry-audit` pass.
[[NVD CVE-2026-55604]](https://nvd.nist.gov/vuln/detail/CVE-2026-55604)
[[NVD CVE-2026-55605]](https://nvd.nist.gov/vuln/detail/CVE-2026-55605)

### 7c. HubSpot MCP — August 2026 capability expansion (curate queue priority #1)

HubSpot confirmed that conditional field logic (custom pipeline stage validations) is now
respected when agents create or update records via the MCP server. Combined with the
previously confirmed August capability expansion (leads, landing pages, content analytics,
marketing email tools, quotes/revenue beta, conversations, conditional rules, verified domain
controls), the server has materially grown in scope since the last curate window. Remains
the highest-priority next curate target.
[[HubSpot MCP docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)
[[HubSpot GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 8. Upcoming Events / Deadlines

| Date | Event | Relevance |
|---|---|---|
| **Aug 13–14** | AAIF MCP Dev Summit Seoul + Open Source Summit Korea | Governance signals, roadmap; blog expected ~Aug 15+ |
| **Aug 14** | SEP-2127 WG formal term closes | Activate server card audit pass on all 19 servers |
| **Aug 14** | Streamly on-demand for Black Hat USA 2026 | MCPwned deck accessible (registered attendees) |
| **~Aug 19–20** | BH USA 2026 slide archive expected public | MCPwned deck publicly accessible |
| **Aug 31** | SEP-2127 WG follow-on meeting (post-term) | Continued path/format resolution |
| **Sept 6–7** | AGNTCon + MCPCon Shanghai (KubeCon China) | 40+ sessions, 1,500+ attendees |
| **Sept 7** | SEP-2127 WG second follow-on meeting | Further resolution |
| **Oct 22–23** | AGNTCon + MCPCon North America, San Jose | Flagship AAIF North America event |

---

## 9. Catalog Hooks

**No catalog changes this pass.** All 19 approved/public servers remain in good standing.
No cataloged server was named in any new security incident.

**Pending curate action (#1 priority):** HubSpot MCP (`mcp.hubspot.com`). GA April 13;
OAuth 2.1 + PKCE only (no DCR); August 2026 capability expansion confirmed. Ready for
next `subregistry-curate` run.

**Pending audit actions (unchanged from prior pass):**
- **Aug 14+:** Poll all 19 cataloged servers for `/.well-known/mcp.json` compliance; record
  tool count + protocol version in `verification.notes` (SEP-2127 server card audit trigger).
- Verify CVE-2026-55604/55605 don't affect any cataloged endpoint (requires NVD access).
- Verify all TypeScript-SDK-based vendors on SDK ≥1.26.0 or v2.0.0 (CVE-2026-25536 patch gate).
- Verify CIMD compliance for OAuth-gated vendors (DCR deprecated in 2026-07-28 spec).
- New audit criterion: verify new catalog candidates have documented spotlighting/sanitization
  policy for tools returning user-controlled data (per Azure DevOps MCP disclosure pattern §3).

---

## 10. Sources

| # | Source | URL |
|---|---|---|
| 1 | Glama MCP Registry | https://glama.ai/mcp/servers |
| 2 | PulseMCP Server Directory | https://www.pulsemcp.com/servers |
| 3 | MCPToplist cross-registry rankings | https://mcptoplist.com/ |
| 4 | Manifold Security — Azure DevOps MCP confused deputy | https://www.manifold.security/blog/azure-devops-mcp-server-vulnerability |
| 5 | eSecurity Planet — Azure DevOps MCP prompt injection | https://www.esecurityplanet.com/threats/azure-devops-prompt-injection-targets-ai-coding-agents/ |
| 6 | Mallory summary — Azure DevOps MCP flaw | https://mallory.ai/stories/019f8983-e78d-7da1-a7bb-3589a7b269a0 |
| 7 | Adversa AI — MCP Security Best Practices Aug 2026 | https://adversa.ai/blog/top-mcp-security-resources-august-2026/ |
| 8 | Adversa AI — AI Coding Agent Security Aug 2026 | https://adversa.ai/blog/top-ai-coding-agent-security-resources-august-2026/ |
| 9 | SEP-2127 PR | https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127 |
| 10 | MCP Server Card WG Charter | https://modelcontextprotocol.io/community/working-groups/server-card |
| 11 | Agent Ready Server Card Validator | https://agent-ready.dev/mcp-card-validator |
| 12 | MCP Dev Summit Seoul | https://events.linuxfoundation.org/mcp-dev-summit-seoul/ |
| 13 | AAIF Blog | https://aaif.io/ |
| 14 | NVD CVE-2026-55604 | https://nvd.nist.gov/vuln/detail/CVE-2026-55604 |
| 15 | NVD CVE-2026-55605 | https://nvd.nist.gov/vuln/detail/CVE-2026-55605 |
| 16 | HubSpot MCP Integration Docs | https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server |
| 17 | HubSpot Remote MCP GA Changelog | https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available |
| 18 | Team Cymru Black Hat USA 2026 | https://event.team-cymru.com/black-hat-usa-2026 |
| 19 | Agentgateway v1.4 blog | https://agentgateway.dev/blog/2026-08-03-new-mcp-spec-revision/ |

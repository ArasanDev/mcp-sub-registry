# MCP Ecosystem Update — 2026-06-22

Daily research pass. Covers developments since the June 21 report
([2026-06-21-mcp-ecosystem-update.md](./2026-06-21-mcp-ecosystem-update.md)).
Focus: Trend Micro cloud threat escalation (1,467 exposed servers, CSP-hosted, CVSS 9.8);
new CVE-2026-20205 (Splunk MCP Server token leak); Adversa AI AIRQ Framework (100+ agents
scored); The Vulnerable MCP Project database; Pinterest enterprise case study; MCP 2026
Roadmap published; CoSAI white paper stats; Authzed breach timeline; Glama count update
(44,392, up from 38,524).

All external claims cited with source URLs.

---

## 1. Threat Widens to the Cloud: Trend Micro 1,467 Exposed MCP Servers

Trend Micro published a follow-up to their earlier MCP exposure research with substantially
escalated findings:

- **1,467 publicly exposed MCP servers** — nearly triple the baseline from their initial scan.
- **74% are hosted on major cloud service providers:** AWS, Azure, GCP, and Oracle Cloud.
- **CVSS 9.8 command-injection vulnerabilities** found in *unofficial* AWS and Azure MCP
  servers (not the vendors' own official servers — third-party community implementations
  targeting these cloud platforms).
- A separate AI-powered sweep of over **19,000 open-source MCP server repositories** found:
  - SQL injection: 26% of vulnerabilities
  - Remote code execution (RCE): 22.5%
- Finding: exposed MCP servers enable credential theft, lateral movement, and full cloud
  compromise — not just data exfiltration.

[[Trend Micro — Update on Exposed MCP Servers: The Threat Widens to the Cloud]](https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud)
[[Trend Micro — Hunt Them All: AI-Powered Vulnerability Sweep of 19,000 MCP Servers]](https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/hunt-them-all-an-ai-powered-vulnerability-sweep-of-19-000-mcp-servers)

### Catalog implication

None of our 19 catalog entries are affected — all are official, vendor-operated remote
HTTP servers with auth requirements (verified 401 on unauthenticated access). The CVSS 9.8
findings are in unofficial, community-built MCP servers for cloud platforms. The Censys
count (12,520 accessible MCP services, ~40% unauthenticated) documented in prior reports
now has a tighter vendor breakdown: most of the exposure is CSP-hosted, not on enterprise
on-prem.

---

## 2. CVE-2026-20205 — Splunk MCP Server Token Leak (Patched in v1.0.3)

**Advisory SVD-2026-0407** (published April 15, 2026) discloses an information disclosure
vulnerability in the **Splunk MCP Server** app:

- In versions below 1.0.3, session and authorization tokens are written to log files in
  clear text.
- Exploitable by any user with access to the `_internal` Splunk index or the
  `mcp_tool_admin` capability (both privileged roles).
- CVSS v3.1: **7.2 High** (`AV:N/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H`).
- Fixed in Splunk MCP Server app **v1.0.3**, which prevents tokens from being written to
  log files.

[[Splunk Advisory SVD-2026-0407]](https://advisory.splunk.com/advisories/SVD-2026-0407)
[[SentinelOne CVE-2026-20205]](https://www.sentinelone.com/vulnerability-database/cve-2026-20205/)
[[RedPacket Security CVE-2026-20205]](https://www.redpacketsecurity.com/cve-alert-cve-2026-20205-splunk-splunk-mcp-server/)

**Catalog implication:** Splunk MCP Server is an on-premise/self-hosted app, not a
vendor-operated remote HTTP endpoint. It is not in our catalog and is not a candidate
under the current remote-HTTP-only policy. Documenting here for ecosystem context:
this is the first known CVE against a major enterprise vendor's packaged MCP Server app.

---

## 3. CVE-2026-23744 — MCPJam Inspector RCE

**CVE-2026-23744** was disclosed against the **MCPJam Inspector** (an MCP server debugging
and inspection tool):

- Crafted HTTP requests to the Inspector's management interface can trigger automatic
  installation of MCP servers and execute arbitrary code on the host machine.
- Attack vector: any browser or HTTP client that can reach the Inspector's listening port.

[[The Vulnerable MCP Project — CVE-2026-23744]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)
[[The Vulnerable MCP Project — main database]](https://vulnerablemcp.info/)

**Catalog implication:** MCPJam Inspector is a development tool, not a catalog entry.
Documenting as ecosystem context. This follows the pattern of MCP tooling around the
protocol being as vulnerable as the servers themselves.

---

## 4. The Vulnerable MCP Project — New Security Database

**vulnerablemcp.info** is a new open-source comprehensive security database for MCP
vulnerabilities, maintained at `github.com/vineethsai/vulnerablemcp`. Key features:

- Tracks CVEs, exploits, and security research specific to MCP implementations.
- Includes entries for CVE-2026-25536, CVE-2026-23744, and others.
- Also hosts the "Damn Vulnerable MCP Server" (DVMCPS) lab environment for security
  training and penetration testing research.

[[The Vulnerable MCP Project]](https://vulnerablemcp.info/)
[[GitHub — vineethsai/vulnerablemcp]](https://github.com/vineethsai/vulnerablemcp)
[[ReversingLabs — Vulnerable MCP Servers Lab]](https://www.reversinglabs.com/blog/vulnerable-mcp-servers-lab)

**Relevance:** This is now a citable external reference for MCP security tracking,
complementing the OWASP MCP Top 10 and Adversa AI TOP 25. `subregistry-audit` should
cross-reference this database when verifying cataloged endpoints.

---

## 5. Adversa AI AIRQ Framework — 100+ AI Agents Scored

Adversa AI launched the **AI Risk Quadrant (AIRQ) Framework** on June 4, 2026 — billed
as the first independent, open-source AI agent security rating system:

- Scores 100+ popular AI agents across 10 agent classes on three dimensions:
  - **Attack surface:** how easily the agent can be compromised
  - **Blast radius:** how much damage a compromise can cause
  - **Defense controls:** what hardening exists
- Framework contributors include reviewers from OWASP, CoSAI, CSA, and NIST.
- Published as open-source at `airq.adversa.ai`; any organization can run it on their
  own agent stack.

[[Adversa AI — AIRQ Framework]](https://adversa.ai/blog/adversa-ai-launches-airq-framework-report/)
[[PR Newswire — AIRQ Launch]](https://www.prnewswire.com/news-releases/airq-the-first-independent-ai-agent-security-rating-and-open-source-risk-scoring-framework-ranks-100-ai-agents-302790957.html)
[[AIRQ live framework]](https://airq.adversa.ai/report)

**Relevance:** The AIRQ blast-radius dimension maps directly to our `gateway_compatibility`
and `readiness` fields — the *consequence* of a compromise scales with what data and actions
the server can access. This is the kind of scoring we should consider encoding in
`verification.notes` for high-privilege catalog entries (Sentry, Slack, GitHub).

---

## 6. CoSAI MCP Security White Paper — Key Statistics

The Coalition for Secure AI (CoSAI, operating under OASIS) published a comprehensive MCP
security taxonomy white paper in January 2026. The key quantitative findings remain
the clearest public numbers on MCP security posture in the wild:

- **43% of public MCP servers** have at least one vulnerability.
- **5.5% already have poisoned tool descriptions** in production (live rug-pull/tool-poisoning
  attempts in the wild).
- Identifies 12 threat categories and ~40 distinct threats across all-local, single-tenant
  hybrid, and multi-tenant cloud deployments.
- Recommends end-to-end agent identity, least-privilege authorization, input sanitization
  at trust boundaries, and sandbox isolation for MCP server execution.

[[CoSAI — Securing the AI Agent Revolution: A Practical Guide to MCP Security]](https://www.coalitionforsecureai.org/securing-the-ai-agent-revolution-a-practical-guide-to-mcp-security/)
[[OASIS Open — CoSAI MCP Security Taxonomy announcement]](https://www.oasis-open.org/2026/01/27/coalition-for-secure-ai-releases-extensive-taxonomy-for-model-context-protocol-security/)
[[Adversa AI — CoSAI white paper key takeaways]](https://adversa.ai/blog/mcp-security-whitepaper-2026-cosai-top-insights/)

**Relevance:** The 5.5% poisoned-descriptions figure is the strongest published signal
that tool poisoning is not theoretical — it is actively deployed in the wild. Our catalog
entries are vendor-operated official servers, but this number should inform how we score
`security.toolPoisoningRisk` and what triggers a `subregistry-audit` demotion.

---

## 7. Authzed Breach Timeline — Documented Incident History

Authzed published and is maintaining a running timeline of documented MCP security breaches.
Key incidents across February–April 2026:

| Date | Incident | Impact |
| --- | --- | --- |
| February 2026 | Malware spreading via fake "Oura MCP" project on npm | Supply chain; targeted AI agent users |
| March 2026 | Critical MCP integration flaw in `nginx-ui` | RCE in the nginx management UI's MCP integration |
| April 2026 | Anthropic core MCP spec design flaw | LettaAI (RCE), LangFlow (unauthenticated takeover), Windsurf (security filter bypass) affected |

The April 2026 incident is the same "Mother of All AI Supply Chains" (OX Security /
CVE family) documented in the June 18 report. The fake Oura MCP malware (February) is
an earlier supply chain incident predating the Miasma/IronWorm worm campaigns now
dominating the threat landscape.

[[Authzed — A Timeline of Model Context Protocol (MCP) Security Breaches]](https://authzed.com/blog/timeline-mcp-breaches)

---

## 8. Pinterest Enterprise Case Study — Production-Scale MCP Adoption

Pinterest published a production engineering case study on their internal MCP ecosystem
(April 2026). Key metrics:

- **66,000 monthly MCP invocations** across internal tools
- **844 active users** (internal engineers)
- **7,000 engineering hours saved per month** (estimated)
- Architecture: multiple domain-specific MCP servers + **internal central registry**
- Auth: two-layer system — end-user JWTs (user identity) + mesh identities (service-to-service),
  with business-group-based access gating on sensitive servers
- MCP Security Standard: internal policy doc governing which agents can invoke which servers

This is the clearest published enterprise "patterns and pitfalls" case study to date.
The internal registry + two-layer auth mirrors our architecture exactly (catalog layer +
gateway auth layer = same logical split).

[[Pinterest Engineering — Building an MCP Ecosystem at Pinterest]](https://medium.com/pinterest-engineering/building-an-mcp-ecosystem-at-pinterest-d881eb4c16f1)
[[InfoQ — Pinterest Deploys Production-Scale MCP Ecosystem]](https://www.infoq.com/news/2026/04/pinterest-mcp-ecosystem/)
[[ByteByteGo — How Pinterest Built a Production MCP Ecosystem]](https://blog.bytebytego.com/p/how-pinterest-built-a-production)

**Relevance:** Validates the registry-as-registry-only pattern at scale. Pinterest built
an internal sub-registry (their "central registry") before building runtime — same sequence
as our roadmap.

---

## 9. MCP 2026 Roadmap — Official Priorities Published

The official MCP 2026 Roadmap was published on the Model Context Protocol blog. Key
priorities beyond the July 28 RC:

- **Stateless horizontal scaling:** evolve Streamable HTTP to run statelessly across
  multiple server instances behind load balancers and proxies with no sticky routing.
- **Tasks lifecycle improvements:** retry semantics for transient failures; expiry policies
  for long-running task result retention.
- **Enterprise auth/SSO:** audit trails, SSO integration, gateway behavior standardization,
  configuration portability.
- **Governance maturation:** Contributor Ladder SEP (defining community → maintainer
  progression); delegation model allowing Working Groups with proven track records to accept
  SEPs within their domain without full core-maintainer review.

[[MCP 2026 Roadmap — Official Blog]](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
[[The New Stack — MCP's growing pains for production use]](https://thenewstack.io/model-context-protocol-roadmap-2026/)

**Relevance:** Enterprise auth + audit trails + config portability are all registry-adjacent.
The delegation model for WGs could accelerate the Server Cards (SEP-2127) and other SEPs
we're tracking, since the relevant WG could ratify them faster.

---

## 10. MCPShield — Academic Security Defense Tool

Academic paper (arXiv 2605.11053, May 2026) proposes **MCPShield**, a session-level attack
detection framework for MCP tool-call traffic:

- Encodes each MCP session as a graph: tool calls = nodes; sequential + data-flow links = edges.
- Enriches nodes with sentence embeddings over arguments and responses.
- Runs a graph neural network to classify sessions as benign or attacked.
- Key finding: the dominant detection signal is in sentence embeddings (content), not graph
  structure or model architecture — meaning content-aware filtering is more effective than
  behavioral sequence analysis.
- Claims 91% theoretical coverage of known threat categories.

[[arXiv — MCPShield: Content-Aware Attack Detection for LLM Agent Tool-Call Traffic]](https://arxiv.org/abs/2605.11053)

**Relevance:** Defensive tooling for MCP gateway operators. This is above our layer
(runtime detection, not catalog curation), but informs what metadata the gateway needs
from us: accurate tool counts and tool description hashes to bootstrap the model's baseline.

---

## 11. Scale & Directory Counts (June 22)

| Source | Count (June 22) | Change since June 21 |
| --- | --- | --- |
| **Glama** | **44,392** | +5,868 (+15%) — likely batch indexing event |
| **PulseMCP** | ~18,240+ (official/remote filter) | Stable |
| **Smithery** | ~7,000 (contracting) | Unchanged |
| **Our catalog** | **19 approved/public** | Unchanged |

**Note on Glama count:** the jump from 38,524 to 44,392 in ~24 hours (+15%) exceeds normal
daily growth patterns. This is consistent with a batch GitHub/registry indexing sweep rather
than organic new server submissions. The filtered (official/remote-only) count is smaller.

[[Glama MCP Servers directory]](https://glama.ai/mcp/servers)
[[PulseMCP — official+remote filter]](https://www.pulsemcp.com/servers)

---

## 12. Spec Countdown — 36 Days to July 28

The MCP 2026-07-28 Release Candidate ships as the final specification in **36 days**.
No new information since June 21; the June 21 report covers all RC changes fully.
The 10-week SDK maintainer validation window ends July 28.

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 13. Sectigo MCP Server for CLM — New Ecosystem Entrant (Not Catalog Candidate)

Sectigo launched what it describes as the industry's first **globally available,
production-ready MCP Server for Certificate Lifecycle Management** on June 2, 2026:

- Automates TLS certificate issuance, revocation, renewal, replacement, approval, search,
  and reporting via AI agent natural language commands.
- Available as open-source Node.js package (Apache 2.0) on npm and GitHub.
- **Requires a Sectigo Certificate Manager enterprise account with API access** — the server
  runs locally (npm/node) and connects to Sectigo's API with credentials.

[[Sectigo announcement]](https://www.sectigo.com/resource-library/sectigo-mcp-server-certificate-lifecycle-management)
[[BusinessWire]](https://www.businesswire.com/news/home/20260602254063/en/Sectigo-Announces-First-Globally-Available-MCP-Server-to-Operationalize-Agentic-AI-for-Certificate-Lifecycle-Management)
[[SC Media]](https://www.scworld.com/brief/sectigo-launches-ai-powered-server-for-certificate-lifecycle-management)

**Catalog decision:** Not a current candidate. Sectigo MCP is a self-hosted npm package
with org-specific credentials (same pattern as Google Cloud MCP). There is no vendor-operated
remote HTTP endpoint to catalog. Flag for future evaluation if Sectigo launches a hosted
remote endpoint.

---

## 14. Catalog Hooks — Status (June 22)

All 19 catalog entries confirmed `packages: []` (pure remote HTTP, no npm/package distribution).
This confirms no entry distributes packages that would expose consumers to CVE-2026-25536
via the catalog itself.

| Server | Finding | Action |
| --- | --- | --- |
| All 19 entries | Remote HTTP only, `packages: []` | No catalog exposure to npm worms or SDK CVE |
| TypeScript SDK vendors (backend) | CVE-2026-25536 patched in SDK 1.26.0; backend audit pending | **Flag: subregistry-audit** (verify vendor backend ≥1.26.0) |
| Splunk MCP Server | CVE-2026-20205 (token leak); not in catalog, self-hosted | No catalog action |
| Sectigo MCP Server | npm-based, no remote HTTP endpoint | Not a catalog candidate |
| All 19 entries | Trend Micro CVSS 9.8 findings in unofficial AWS/Azure MCP | No impact — entries are official vendor servers |

**Pending audit trigger:** `subregistry-audit` pass required to verify backend SDK versions
(CVE-2026-25536 check) for TypeScript SDK-based vendors: GitHub MCP, Slack MCP, Cloudflare
MCP, Stripe MCP, Vercel MCP, and others whose backend runtime may use `@modelcontextprotocol/sdk`.

---

## Summary for CLAUDE.md §13

**New CVEs (June 22):**
- **CVE-2026-20205** (Splunk MCP Server, CVSS 7.2, patched in v1.0.3) — token leak in logs,
  first known CVE against a major enterprise vendor's packaged MCP Server app.
- **CVE-2026-23744** (MCPJam Inspector RCE) — crafted HTTP request triggers arbitrary code execution.

**Threat escalation (Trend Micro):** 1,467 exposed MCP servers (3× baseline), 74% hosted on
AWS/Azure/GCP/Oracle, CVSS 9.8 injection in unofficial AWS/Azure servers. AI sweep of 19,000
repos: SQL injection (26%) + RCE (22.5%) most common classes.

**New security resources:**
- **The Vulnerable MCP Project** (vulnerablemcp.info) — open-source CVE database for MCP.
- **AIRQ Framework** (Adversa AI, June 4) — 100+ agents scored on attack surface, blast radius,
  and defense controls; OWASP/CoSAI/CSA/NIST contributors.
- **CoSAI stats:** 43% of public MCP servers have at least one vulnerability; 5.5% have
  poisoned tool descriptions in production.

**Enterprise adoption signal:** Pinterest case study — 66k invocations/month, 844 users,
7k engineering hours saved/month, internal central registry + two-layer JWT auth.

**MCP 2026 Roadmap published:** stateless scaling, Tasks lifecycle, enterprise SSO/audit,
governance delegation.

**Directory:** Glama 44,392 (+5,868 since June 21; batch indexing probable). Spec countdown: 36 days.

**Catalog:** all 19 entries clean. TypeScript SDK backend audit still pending.

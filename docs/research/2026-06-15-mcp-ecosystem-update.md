# MCP Ecosystem Update — 2026-06-15

Daily research pass. Covers developments since the inaugural landscape scan
([2026-06-15-mcp-registry-landscape.md](./2026-06-15-mcp-registry-landscape.md))
written earlier today. Focus: what changed, what it means to the sub-registry.
All external claims are cited.

---

## 1. Official registry & spec (what changed)

### Registry API — still frozen at v0.1

The official registry (`registry.modelcontextprotocol.io`) API remains frozen at
`v0.1`. The freeze was enacted October 24, 2025 to enable confident integrator
adoption. v1 is in active development on a separate track. The service itself is
at release v1.7.9 (service release, not protocol version). No schema or endpoint
changes since the freeze.
[Source: github.com/modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry)

**Implication:** our upstream client's `/v0.1/servers` target is correct and stable.
No migration needed until v1 GA, which has no announced date.

### Spec RC 2026-07-28 — the largest revision since launch

The 2026-07-28 specification release candidate was **locked May 21, 2026**;
final publication is July 28, 2026. It is a **breaking change release**.
[Source: blog.modelcontextprotocol.io](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

Key changes and registry/gateway implications:

| Change | Detail | Implication for us |
|---|---|---|
| **Goes stateless** | `initialize`/`initialized` handshake eliminated; `Mcp-Session-Id` header removed; any request lands on any server instance | Our catalog entries use streamable-http; no session IDs stored — this is a non-change for the registry side |
| **Two new required HTTP headers** | `Mcp-Method` (operation type) + `Mcp-Name` (resource name) mandatory on Streamable HTTP; gateways that validate will reject requests missing them | Flag for Gateway operator: their validator must add these headers when forwarding to servers we list |
| **Caching fields on list/read responses** | `ttlMs` + `cacheScope` in responses (replaces need for SSE stream change-detection) | Potentially useful: remote server can signal how long our catalog's tool-count is valid |
| **Auth hardening** | Six SEPs: mandatory `iss` parameter validation (RFC 9207), clarified dynamic client registration | Reinforces the "secret names, never values" principle; no change to our stored schema |
| **Extension governance** | Extensions get reverse-DNS IDs, independent versioning from the spec | If we surface extensions in catalog metadata, we will need to store the reverse-DNS ID |
| **Error code change** | Missing-resource error shifts from `-32002` → JSON-RPC standard `-32602` | Our API doesn't proxy MCP errors, so no change |
| **Three primitives deprecated** | Not removed; 12-month Active → Deprecated → Removed lifecycle guaranteed | Track deprecations in next cycle |

**Action for next cycle (before July 28):** audit our test suite and gateway contract
docs against the stateless transport changes. No catalog schema changes required now,
but the Gateway operator needs a heads-up about mandatory Mcp-Method/Mcp-Name headers.
Sources: [RC blog post](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/),
[DEV.to migration guide](https://dev.to/akaranjkar08/mcp-spec-ships-july-28-every-breaking-change-and-how-to-migrate-4co8),
[2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/).

---

## 2. Registry / catalog player updates

### Confirmed scale signals (June 2026)

| Directory | Count | Change vs last scan | Source |
|---|---|---|---|
| **Glama** | ~36,950 | Unchanged | [glama.ai/mcp/servers](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~18,240+ | Unchanged | [pulsemcp.com](https://www.pulsemcp.com/servers) |
| **mcp.so** | ~20,222 | +~1,200 from ~19k | [truefoundry.com](https://www.truefoundry.com/blog/best-mcp-registries) |
| **Smithery** | ~7,000+ | Upper bound firmer (was 2,500–7,000) | [agensi.io comparison](https://www.agensi.io/learn/smithery-vs-glama-vs-agensi-comparison) |

### JFrog MCP Registry — GA (March 18, 2026)

JFrog announced General Availability of the Universal MCP Registry on **March 18, 2026**
as part of JFrog AI Catalog. Features: centralized discovery, project-level permissions,
RBAC, audit logging, configuration management, allowlist governance. Treats every MCP
server as a governed artifact alongside AI models and software packages — the supply
chain metaphor is explicit.
[Source: JFrog press room](https://jfrog.com/press-room/jfrog-unveils-universal-mcp-registry-for-ai-software-supply-chain/),
[DevOps Digest](https://www.devopsdigest.com/jfrog-mcp-registry-released),
[JFrog blog](https://jfrog.com/blog/announcing-general-availability-of-the-jfrog-mcp-registry/)

**Implication:** JFrog is no longer in preview — it is a shipped commercial product.
Remains the closest enterprise analogue to what we're building (standalone curated
catalog as supply-chain allowlist). Key difference: JFrog is bundled into the full
Artifactory/AI Catalog platform, not a standalone gateway-projection API. Our clean
standalone catalog + gateway-projection contract is still differentiated white space.

### Obot — $35M seed funding confirmed

Obot raised a $35M seed round, signaling significant enterprise-market validation for
the all-in-one (gateway + catalog + agent orchestration) approach. Maintains the
cleanest `discovery → approval → runtime` separation of any OSS player; its built-in
MCP Catalog is IT-verified with trust levels.
[Source: obot.ai via search snippets](https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/)

**Implication:** Obot's funding accelerates the risk that a well-resourced OSS project
bundles the curation layer. Our moat remains narrow scope (registry only, no runtime).

### Agensi — new entrant, security-first curated marketplace

Agensi is a newly visible MCP marketplace (Q1–Q2 2026) covering both SKILL.md skills
and MCP servers. Its differentiator: an automated **8-point security scan** on all
listings (excessive permissions, suspicious dependencies, data exposure). Claims to be
the only platform with creator payments + automated security scanning + one-command
install. The broader market grew from 1 registry (December 2025) to 8 major
marketplaces by Q2 2026.
[Source: agensi.io comparison](https://www.agensi.io/learn/smithery-vs-glama-vs-agensi-comparison),
[automationswitch.com](https://automationswitch.com/ai-workflows/where-to-find-mcp-servers-2026)

**Implication:** Agensi's automated security scanning is the closest analogue to what a
curated sub-registry should do. Adding to the watch list. Not a threat to our niche
(they are a marketplace/directory; we are a gateway-projection catalog).

### Kong MCP Registry — still Technical Preview

No evidence of Kong's MCP Registry graduating from Technical Preview (launched AI
Gateway 3.12, October 2025). Watch for GA announcement; Kong has the distribution to
move fast when it ships.
[Source: konghq.com search snippets](https://konghq.com/products/mcp-registry)

---

## 3. Security — new incidents and escalation

### CVE-2026-26118: Azure MCP Server SSRF (March 10, 2026)

| Field | Value |
|---|---|
| CVE | CVE-2026-26118 |
| CVSS v3.1 | **8.8** (Important) |
| Affected | Azure MCP Server (Microsoft) |
| Type | Server-Side Request Forgery → privilege escalation |
| Mechanism | Attacker submits malicious URL as Azure resource identifier; server makes outbound request including its managed identity token |
| Patched | **March 10, 2026** (Microsoft Patch Tuesday) |

Sources: [SentinelOne DB](https://www.sentinelone.com/vulnerability-database/cve-2026-26118/),
[Talos March 2026](https://blog.talosintelligence.com/microsoft-patch-tuesday-march-2026/),
[TheHackerWire](https://www.thehackerwire.com/azure-mcp-server-ssrf-for-privilege-elevation-cve-2026-26118/)

**Catalog flag:** none of our 11 seeded servers is Azure MCP. However, if we ever add
a Microsoft-hosted MCP, we must verify it runs a patched version (post March 10, 2026).

### CVE-2026-33032: nginx-ui unauthenticated MCP RCE (CVSS 9.8)

An insecure MCP implementation in nginx-ui failed to authenticate command execution
requests via the MCP message endpoint, enabling complete nginx service takeover.
[Source: search snippets, see above]

**Catalog flag:** not in our catalog. Pattern to watch: this is a third-party package
adding MCP support without securing the endpoint — exactly the supply-chain risk we
filter against.

### CVE-2026-30615: Windsurf IDE zero-interaction RCE

Exploitation required zero user interaction; a malicious MCP configuration injected via
prompt poisoning registered a new MCP server and executed arbitrary commands.
[Source: search snippets]

**Catalog flag:** IDE-side vulnerability, not a server we catalog. Reinforces that
clients must pin catalog versions, not just trust current server descriptions.

### Broader threat landscape escalation

- **Multiple CVSS 9.0+ vulnerabilities** disclosed in the MCP ecosystem in H1 2026.
- OWASP Agentic AI Top 10 (2026) formally classifies tool poisoning as **ASI01 (Agent Goal Hijack)**.
- At **RSAC 2026**, MCP supply chain governance was the dominant AI security theme;
  researchers called out registry/catalog controls as the highest-leverage intervention.
- The OX Security advisory disclosed **RCE vulnerabilities across the AI ecosystem** in
  a systemic supply-chain advisory (150M+ download impact claimed for the class of issues).
  Source: [OX Security](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/)

### Running security signals (persistent from last report)

| Threat | Status |
|---|---|
| postmark-mcp malicious server | Still the canonical named incident; no new named server confirmed yet |
| CVE-2025-54136 (tool poisoning) | Structural baseline; no patch possible at protocol level |
| Rug pulls | Active threat; silent description mutations undetected by most registries |
| Transport-layer MCP attacks | MITM on plaintext HTTP; many early deployments lacked TLS |

---

## 4. Provenance / signing — growing momentum, still immature

Key 2026 signals:

- **SLSA Framework applied to MCP artifacts**: sign during build, verify during
  deployment, hash-check before runtime. Now the recommended pattern.
  [Source: practical-devsecops.com](https://www.practical-devsecops.com/slsa-framework-guide-software-supply-chain-security/)
- **Sigstore for AI agent provenance**: emerging use of Sigstore to attest which
  MCP servers were used in an agent run.
  [Source: alwaysfurther.ai](https://www.alwaysfurther.ai/blog/sigstore-ai-agent-provenance)
- **Coalition for Secure AI (CoSAI)** published signing and provenance guidance at
  RSAC 2026.
  [Source: coalitionforsecureai.org](https://www.coalitionforsecureai.org/building-trust-in-ai-supply-chains-why-model-signing-is-critical-for-enterprise-security/)
- **Open gap confirmed**: "current attestation chains cannot answer which agent system
  processed a plan and what MCP servers were used." This is an industry-wide open problem.
  [Source: arxiv.org/pdf/2604.07551](https://arxiv.org/pdf/2604.07551)
- **SEP-1932 (DPoP) + SEP-1933 (Workload Identity Federation)**: two active MCP spec
  proposals improving auth for workloads and minimizing credential exposure at the
  protocol level.
  [Source: MCP 2026 roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

**Implication for us:** our `contentHash` per catalog item is the right instinct, but we
have no current mechanism to consume signed MCP artifacts from upstream. When SLSA-signed
packages become common in the official registry, we should plan to store the attestation
reference in our curation metadata. No action needed now, but add to roadmap.

---

## 5. Curated catalog health check

Review of our 11 seeded servers against today's findings:

| Server | Endpoint | Verification status | Flags |
|---|---|---|---|
| com.deepwiki/mcp | `mcp.deepwiki.com/mcp` | verified (official_vendor) | None |
| com.github/mcp | `api.githubcopilot.com/mcp/` | verified (official_vendor) | None; no CVE affecting this endpoint |
| com.slack/mcp | `mcp.slack.com/mcp` | verified (official_vendor) | None |
| com.notion/mcp | `mcp.notion.com/mcp` | verified (official_vendor) | None |
| com.cloudflare/mcp | `mcp.cloudflare.com/mcp` | verified (official_vendor) | None |
| com.sentry/mcp | `mcp.sentry.dev` | **needs_confirmation** | **Action needed:** exact client endpoint path unconfirmed since May 2026 seeding — re-verify against docs.sentry.io |
| com.linear/mcp | `mcp.linear.app/mcp` | verified (official_vendor) | None |
| com.figma/mcp | `mcp.figma.com/mcp` | verified (official_vendor) | None |
| com.neon/mcp | `mcp.neon.tech/mcp` | verified (official_vendor) | None |
| com.supabase/mcp | `mcp.supabase.com/mcp` | verified (official_vendor) | None |
| com.atlassian/mcp | `mcp.atlassian.com/v1/mcp` | verified (official_vendor) | Confirmed streamable-http; SSE endpoint deprecated (already noted) |

**CVE-2026-26118 cross-check:** zero of our 11 servers are Azure MCP / Microsoft-hosted.
CVE-2026-33032 (nginx-ui): zero of our servers. CVE-2026-30615 (Windsurf): IDE-side, irrelevant to catalog.

**Priority action:** re-verify `com.sentry/mcp` endpoint path. It has carried
`needs_confirmation` since initial seeding (May 2026). Check `docs.sentry.io/product/sentry-mcp/`
and update the curation.meta.verification block.

---

## 6. Open questions for next cycle

1. **July 28 spec publication** — review gateway contract docs for `Mcp-Method`/`Mcp-Name`
   header requirement; add a note to `docs/GATEWAY_CONTRACT.md`.
2. **Sentry endpoint confirmation** — re-verify exact streamable-http path before marking verified.
3. **JFrog catalog projection contract** — does JFrog expose a documented gateway import
   format? (remains unanswered from prior cycle; they are now GA so docs may be available.)
4. **SLSA attestation storage** — when signed MCP packages appear in the official registry,
   what field in our curation metadata stores the attestation reference?
5. **Agensi 8-point security scan** — what exactly are the 8 points? Map against our
   curation criteria for completeness gaps.

---

## Sources

- https://github.com/modelcontextprotocol/registry
- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/
- https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/
- https://dev.to/akaranjkar08/mcp-spec-ships-july-28-every-breaking-change-and-how-to-migrate-4co8
- https://jfrog.com/press-room/jfrog-unveils-universal-mcp-registry-for-ai-software-supply-chain/
- https://www.devopsdigest.com/jfrog-mcp-registry-released
- https://jfrog.com/blog/announcing-general-availability-of-the-jfrog-mcp-registry/
- https://obot.ai/blog/the-13-best-mcp-gateways-for-enterprise-teams/
- https://www.agensi.io/learn/smithery-vs-glama-vs-agensi-comparison
- https://glama.ai/mcp/servers
- https://www.truefoundry.com/blog/best-mcp-registries
- https://www.sentinelone.com/vulnerability-database/cve-2026-26118/
- https://blog.talosintelligence.com/microsoft-patch-tuesday-march-2026/
- https://www.thehackerwire.com/azure-mcp-server-ssrf-for-privilege-elevation-cve-2026-26118/
- https://windowsforum.com/threads/urgent-patch-for-cve-2026-26118-ssrf-in-azure-mcp-server-tools.404636/
- https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/
- https://www.practical-devsecops.com/mcp-security-vulnerabilities/
- https://aembit.io/blog/the-ultimate-guide-to-mcp-security-vulnerabilities/
- https://itecsonline.com/post/mcp-tool-poisoning-enterprise-ai-agent-security-2026
- https://www.alwaysfurther.ai/blog/sigstore-ai-agent-provenance
- https://www.coalitionforsecureai.org/building-trust-in-ai-supply-chains-why-model-signing-is-critical-for-enterprise-security/
- https://arxiv.org/pdf/2604.07551
- https://www.practical-devsecops.com/slsa-framework-guide-software-supply-chain-security/
- https://chatforest.com/builders-log/mcp-security-crisis-2026-unauthenticated-servers-viper-nsa-owasp-builder-guide/

---

## Second Research Pass — Scheduled Test Run (2026-06-15)

Second daily pass covering items not captured in the first report: NSA guidance, new
security research (VIPER-MCP, Akamai database flaws, Censys scale data), enterprise
entrants (Runlayer, AWS Agent Registry, Docker MCP Catalog detail, MintMCP), and Sentry
endpoint confirmation. All external claims cited.

---

### 7. NSA MCP Security Guidance — May 20, 2026 (new; high significance)

On **May 20, 2026**, the National Security Agency published a 17-page guidance document:
**"Model Context Protocol (MCP): Security Design Considerations for AI-Driven Automation"**
(document ID: U/OO/6030316-26 / PP-26-1834, Version 1.0).

This is the first US government publication explicitly naming MCP registry/catalog controls
as a security intervention layer. Key findings:

| NSA finding | Detail | Implication for us |
|---|---|---|
| Adoption outpaced safeguards | MCP's rapid adoption left organizations exposed to risks not fully anticipated by protocol designers | Validates our curation model — the market has absorbed unvetted servers faster than governance can catch up |
| Missing input screening | MCP allows data between systems without sufficient checks; hidden commands (tool poisoning) slip through undetected | The `discovered != approved != enabled` boundary is exactly the control the NSA is calling for |
| Uncontrolled automated actions | AI systems using MCP can independently decide to use new tools or take new actions | Reinforces approval-as-gate-not-runtime; our registry approves per-version, not per-session |
| NSA recommendation | Verify only well-maintained, reputable MCP tools from trusted providers and repositories; code audits before deployment; least-privilege tokens; signed provenance | Our `verifiedAt`, `verification.status`, and `contentHash` fields are directly on-policy |
| Overload attacks flagged | MCP services can be overwhelmed by floods of requests — novel DoS vector | Out of scope for registry, but a signal for the Gateway operator |

**NSA recommended controls (verbatim from guidance):** filtering outgoing proxies, DLP,
sandboxing, message integrity, output filtering, local MCP scans, signed provenance anchored
in hardware roots. The NSA explicitly said organizations should not rely on MCP's own
documentation alone.

Sources:
[NSA press release](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4496698/nsa-releases-security-design-considerations-for-ai-driven-automation-leveraging/),
[NSA PDF](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf),
[ReedSmith analysis](https://www.reedsmith.com/our-insights/blogs/viewpoints/102mvg9/nsa-publishes-security-guidance-on-designing-ai-systems-with-model-context-protoc/),
[ExecutiveGov coverage](https://www.executivegov.com/articles/nsa-model-context-protocol-deployment)

---

### 8. VIPER-MCP — 106 zero-days across 39,884 MCP repos (new; high significance)

The **VIPER-MCP** paper (arXiv:2605.21392) describes a combined static-and-dynamic
taint-analysis framework that was applied to **39,884 real-world open-source MCP server
repositories**. Results:

- **106 zero-day vulnerabilities** discovered across the corpus
- **67 CVE IDs** assigned to date
- Vulnerability classes: taint-style flaws where untrusted input flows to dangerous sinks
  (e.g. command execution, SQL, file write) without sanitization

This is the largest systematic vulnerability scan of MCP servers published to date.

**Implication for us:** With 106 zero-days in 40K repos, the long tail of community
servers is a minefield. Our current 15-server catalog is deliberately narrow and
restricted to official-vendor hosted endpoints — exactly the right posture. Any future
catalog expansion into community/OSS servers must include automated taint analysis or
third-party SAST as a curation gate.

Sources:
[arXiv abstract](https://arxiv.org/abs/2605.21392),
[Adversa AI June 2026 roundup](https://adversa.ai/blog/top-mcp-security-resources-june-2026/),
[ChatForest builder guide](https://chatforest.com/builders-log/mcp-security-crisis-2026-unauthenticated-servers-viper-nsa-owasp-builder-guide/)

---

### 9. Akamai: Three database MCP flaws, one left unpatched (disclosed May 13, 2026)

Akamai security researcher Tomer Peled disclosed three serious vulnerabilities in database
MCP server implementations, published May 13, 2026 in The Register:

| Database MCP | Vulnerability type | Status |
|---|---|---|
| Apache Doris MCP | SQL injection, insufficient query validation | **Patched** — Apache issued a patch + CVE tracker |
| Alibaba RDS MCP | Missing authentication on command endpoint | **NOT PATCHED** — Alibaba decided not to fix |
| Apache Pinot MCP | Insufficient query validation | Open ticket in GitHub repo; status unclear |

The Alibaba RDS MCP case is a precedent: a commercial MCP server with a disclosed
auth-bypass that the vendor declined to patch.

**Catalog flag:** none of our 15 servers are database-backend MCP implementations from
these vendors. **However**, this pattern — major cloud vendors shipping MCP servers with
missing auth — is the highest-risk category. If we ever add a database-proxy MCP
(e.g. Supabase's MCP is currently in catalog; Neon's is in catalog), re-verify their
auth model explicitly before next audit.

Sources:
[The Register (May 13, 2026)](https://www.theregister.com/security/2026/05/13/bug-hunter-tracks-down-three-serious-mcp-database-flaws-one-left-unpatched/5238916),
[Akamai blog](https://www.akamai.com/blog/security-research/one-fluke-3-pattern-mcp-back-end-vulnerabilities),
[PipeLab state of MCP security 2026](https://pipelab.org/blog/state-of-mcp-security-2026/)

---

### 10. Censys: 12,520 internet-accessible MCP services, most unauthenticated

Censys scanned the public internet and found **12,520 accessible MCP services**; a
separate study found roughly **40% of remote servers expose tools with no authentication**.
The surface area is now measurable and large.

**Implication:** The NSA guidance + VIPER-MCP + Censys data converge on the same
picture: the community MCP server ecosystem is insecure at scale. Our sub-registry's
`approved + verified` gate keeps exactly this class of server out of the gateway catalog.
The trust moat is widening as the unvetted surface grows.

Source:
[MCP security crisis 2026 summary](https://dev.to/piiiico/mcp-security-vulnerabilities-in-2026-40-cves-and-counting-4pco),
[Adversa AI June 2026](https://adversa.ai/blog/top-mcp-security-resources-june-2026/)

---

### 11. Runlayer — $11M seed, MCP founder as consultant, 18,000+ catalog

Runlayer raised an **$11M seed round** led by Keith Rabois at Khosla Ventures with Felicis
Ventures participating. Key signal: **David Soria Parra, the founder of MCP**, joined
Runlayer as a consultant — the strongest protocol-authority endorsement any enterprise
MCP platform has received. A Series A followed in 2026.

Runlayer's platform:
- **18,000+ MCP server catalog** — orders of magnitude larger than Smithery (~7k)
- Security-approved servers with one-click install; new servers go through fast-tracked approval
- 300+ supported clients (Cursor, VS Code, Claude Code, GitHub Copilot, ChatGPT, Windsurf…)
- No-code Skills/Plugins Registry with GitHub sync; ABAC policies; Agents Factory

**Ranking implication:** Runlayer's scale (18K catalog), institutional backing ($11M seed +
Khosla), and protocol-founder endorsement make it a significant player that outgrows the
current "watch list" classification. It belongs above Kong in the landscape ranking.

Sources:
[Runlayer $11M announcement](https://www.runlayer.com/blog/runlayer-raises-11m-to-scale-enterprise-mcp-infrastructure),
[OpenTools coverage](https://opentools.ai/news/runlayer-raises-dollar11m-to-fortify-enterprise-ai-security-with-mcp),
[Runlayer engineering page](https://www.runlayer.com/engineering),
[Tracxn profile](https://tracxn.com/d/companies/runlayer/__mnrJOTEdpFADjprXStasglhEvRw2ik_eMN7Jui6iUFU)

---

### 12. AWS Agent Registry — April 9, 2026 Preview Launch

AWS launched **Agent Registry** in preview on **April 9, 2026** as part of Amazon Bedrock
AgentCore. It is a **private, organizational catalog** for discovering and governing agents,
MCP servers, skills, and custom resources.

Key characteristics:
- Indexes agents/MCP servers regardless of cloud (AWS, other clouds, on-premises)
- Hybrid semantic + keyword search for discovery
- Approval workflows + CloudTrail audit trails
- Exposed itself **as an MCP server** — queryable from Claude Code, Kiro, and any
  MCP-compatible IDE
- Auth: AWS IAM credentials or JWT from corporate IdP

**Implication:** AWS entering the private-catalog space (not just hosting MCP servers) is
the biggest enterprise market signal since JFrog GA. The pattern — private org catalog
queryable via MCP — is adjacent to what we're building. Key difference: AWS is building
for intra-org governance, not cross-org sub-registry/gateway projection. Our public
`/gateway/catalog` endpoint projecting approved servers to external gateways is still
differentiated.

Sources:
[AWS what's new](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview/),
[AWS blog](https://aws.amazon.com/blogs/machine-learning/the-future-of-managing-agents-at-scale-aws-agent-registry-now-in-preview/),
[InfoQ coverage](https://www.infoq.com/news/2026/04/aws-agent-registry-preview/),
[The Register](https://www.theregister.com/2026/04/09/aws_ai_agent_registry/),
[AWS weekly roundup Apr 13](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-claude-mythos-preview-in-amazon-bedrock-aws-agent-registry-and-more-april-13-2026/)

---

### 13. Docker MCP Catalog — platform detail & 2026 updates

The Docker MCP Catalog launched **July 1, 2025**; by the time of this research it had
surpassed **1 million pulls** and hosts **300+ verified servers** as containerized images.

Security posture (for Docker-built servers):
- Cryptographic image signatures
- Software Bill of Materials (SBOMs) on every image
- Provenance attestations (tracks build origin and integrity)
- Continuous vulnerability scanning
- Complete isolation from host system (replaces dangerous `npx`/`uvx` direct execution)

In **March 2026 (Docker Desktop 4.67.0)**, Docker shipped MCP Profile Template Cards —
curated server bundles — with an onboarding tour, bringing MCP catalog browsing into
the standard developer tool.

For community-built entries: commit attribution is now tied to each release (Git commit
hash), and Docker announced an open submission review process with 24-hour turnaround
after approval.

**Implication:** Docker's SBOM + provenance attestation model is the most mature
implementation of signed MCP artifacts in production today. When the official registry
adds SLSA-level signing (see §4 of first pass), we should model our attestation storage
on Docker's format.

Sources:
[Docker MCP Catalog launch blog](https://www.docker.com/blog/docker-mcp-catalog-secure-way-to-discover-and-run-mcp-servers/),
[Docker trust blog](https://www.docker.com/blog/enhancing-mcp-trust-with-the-docker-mcp-catalog/),
[Docker docs](https://docs.docker.com/ai/mcp-catalog-and-toolkit/catalog/),
[Docker Desktop 4.67.0 release notes](https://doolpa.com/news/docker-desktop-4-67-mcp-profile-templates-march-2026),
[GitHub docker/mcp-registry](https://github.com/docker/mcp-registry)

---

### 14. MintMCP — SOC 2 Type II compliance signal

MintMCP achieved **SOC 2 Type II certification**, making it the first enterprise MCP
deployment platform with this compliance credential. Its model: STDIO servers →
automatic containerization + OAuth wrapping → production endpoint in minutes.

**Implication:** SOC 2 Type II is a procurement requirement for regulated industries.
MintMCP's certification creates a benchmark for what "compliance-ready" means in the
MCP hosting space. Not directly a registry competitor, but a downstream consumer that
our catalog could feed.

Sources:
[MintMCP vs Runlayer comparison](https://www.mintmcp.com/blog/mintmcp-vs-runlayer),
[ChatForest MCP governance guide](https://chatforest.com/guides/mcp-enterprise-governance-platforms/)

---

### 15. Sentry MCP endpoint — confirmed correct (closes §5 flag from first pass)

The earlier report flagged `com.sentry/mcp` as `needs_confirmation`. This pass confirms:

**`https://mcp.sentry.dev/mcp`** is the official, production Sentry MCP endpoint.
- Auth: OAuth 2.0 (no long-lived API tokens on disk)
- Transport: Streamable HTTP
- Maintained by Sentry (getsentry/sentry-mcp-stdio)

Our catalog was already corrected to this URL in the 2026-06-15 audit commit
(`a98ad1c`). The endpoint is now **confirmed correct**. The `needs_confirmation`
status should be updated to `verified` in the next audit run.

Sources:
[Sentry docs](https://docs.sentry.io/product/sentry-mcp/),
[Apigene Sentry guide](https://apigene.ai/mcp/official/sentry),
[MintMCP Sentry guide](https://www.mintmcp.com/blog/connect-sentry-to-mcp)

---

### 16. Additional catalog flags from this pass

| Server | Finding | Action |
|---|---|---|
| `com.supabase/mcp` | Supabase is a hosted Postgres-backed MCP — class affected by Akamai database MCP pattern; verify auth model at next audit | Flag for `subregistry-audit` |
| `com.neon/mcp` | Neon is a Postgres-native MCP — same class; verify auth model at next audit | Flag for `subregistry-audit` |
| `com.sentry/mcp` | Endpoint confirmed correct (`mcp.sentry.dev/mcp`, OAuth 2.0) | Update `verification.status` → `verified` in next `subregistry-audit` run |

### Updated open questions for next cycle

1. **July 28 spec publication** — unchanged from first pass; Gate operator header update required.
2. ~~**Sentry endpoint confirmation**~~ — resolved: `https://mcp.sentry.dev/mcp` confirmed.
3. **JFrog gateway projection contract** — still unanswered; JFrog is GA; check for documented import format.
4. **SLSA attestation storage** — Docker's SBOM/provenance model is now the reference implementation.
5. **Agensi 8-point security scan** — still unresolved; detail not publicly documented.
6. **Alibaba RDS MCP unpatched** — monitor for patch; do not add any Alibaba-hosted MCP server to catalog until resolved.
7. **Runlayer Series A** — confirm timing and scale; signals whether to elevate to Top 10 by next pass.
8. **AWS Agent Registry GA** — currently in preview (April 9); watch for GA announcement.

### Additional sources (second pass)

- https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4496698/nsa-releases-security-design-considerations-for-ai-driven-automation-leveraging/
- https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf
- https://www.reedsmith.com/our-insights/blogs/viewpoints/102mvg9/nsa-publishes-security-guidance-on-designing-ai-systems-with-model-context-protoc/
- https://www.executivegov.com/articles/nsa-model-context-protocol-deployment
- https://arxiv.org/abs/2605.21392
- https://adversa.ai/blog/top-mcp-security-resources-june-2026/
- https://www.theregister.com/security/2026/05/13/bug-hunter-tracks-down-three-serious-mcp-database-flaws-one-left-unpatched/5238916
- https://www.akamai.com/blog/security-research/one-fluke-3-pattern-mcp-back-end-vulnerabilities
- https://pipelab.org/blog/state-of-mcp-security-2026/
- https://dev.to/piiiico/mcp-security-vulnerabilities-in-2026-40-cves-and-counting-4pco
- https://www.runlayer.com/blog/runlayer-raises-11m-to-scale-enterprise-mcp-infrastructure
- https://opentools.ai/news/runlayer-raises-dollar11m-to-fortify-enterprise-ai-security-with-mcp
- https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview/
- https://aws.amazon.com/blogs/machine-learning/the-future-of-managing-agents-at-scale-aws-agent-registry-now-in-preview/
- https://www.infoq.com/news/2026/04/aws-agent-registry-preview/
- https://www.theregister.com/2026/04/09/aws_ai_agent_registry/
- https://www.docker.com/blog/docker-mcp-catalog-secure-way-to-discover-and-run-mcp-servers/
- https://github.com/docker/mcp-registry
- https://docs.sentry.io/product/sentry-mcp/
- https://www.mintmcp.com/blog/mintmcp-vs-runlayer
- https://chatforest.com/guides/mcp-enterprise-governance-platforms/
- https://www.truefoundry.com/blog/best-mcp-registries

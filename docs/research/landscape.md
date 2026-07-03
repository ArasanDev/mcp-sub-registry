# MCP Registry Landscape — Canonical Ranking

Living ranking of the significant MCP registry / catalog / governance players, maintained
by the orchestrator's daily research routine (`CLAUDE.md` §10). Update this table when the
field shifts; archive deep findings as dated reports in this folder.

- **Latest deep report:** [2026-06-15-mcp-registry-landscape.md](./2026-06-15-mcp-registry-landscape.md)
- **Latest daily update:** [2026-07-03-mcp-ecosystem-update.md](./2026-07-03-mcp-ecosystem-update.md)
- **Last updated:** 2026-07-03 (daily scheduled run)

## Ranking criteria

Significance to a *curated sub-registry that feeds a gateway* — weighted toward: ecosystem
influence, scale, curation/trust quality, governance maturity, and relevance to our niche
(clean `discovered != approved != enabled` separation). Not a pure popularity list.

## Top 11 (2026-06-28, Runlayer updated)

| # | Player | Layer | Scale / signal | Curation & governance | Relevance to us |
| --- | --- | --- | --- | --- | --- |
| 1 | **Official MCP Registry** | Upstream discovery | Authoritative; v0.1 frozen → v1 GA; June 10 update added ACR/MCR support; ~2,000 entries | Metadata only, no quality/security guarantees | Our primary **sync source** |
| 2 | **JFrog MCP Registry** | Enterprise registry | Part of JFrog supply-chain suite; **GA March 18, 2026** | Curated internal catalog, RBAC, audit, allowlist | **Closest analogue** — benchmark; now fully shipped |
| 3 | **Runlayer** | Enterprise gateway + catalog | **$42M total** (**$30M Series A, June 24, 2026**, led by Felicis/Khosla); customers include Instacart, Gusto, Decagon, Opendoor, dbt Labs, AngelList, Lemonade + Fortune 500s; 18,000+ server catalog | Security-approved servers, ABAC, conditional access, SCIM, audit; `discovered != approved != enabled` enforced | **Top-tier** — largest pure-play enterprise MCP governance funding; architecture exactly matches our boundary discipline |
| 4 | **Obot** | Gateway + catalog | OSS (MIT); **$35M seed confirmed**; v0.22.0 released (k8s Secrets binding + fleet scan) | **Clean** discovery→approval→runtime, IT-verified trust | Best model-match; well-funded; study its split |
| 5 | **Palo Alto Networks / Prisma AIRS** | Enterprise security + AI gateway | Incumbent SASE/NGFW player (~$8B ARR); **acquired Portkey (closed May 29, 2026)**; Portkey gateway now Prisma AIRS 3.0 AI Gateway core; trillions of tokens/month processed | Prisma AIRS runtime security + Portkey AI gateway governance; centralized control plane for agentic AI | Enterprise validation of governance-over-MCP market; watch for registry/catalog features |
| 6 | **Lunar.dev MCPX** | Gateway + catalog | OSS core + commercial | Partial separation, sandbox vetting, hardened tools | Model-match; trust tooling ideas |
| 7 | **Docker MCP Catalog / Gateway** | Directory + OCI | Major vendor; OCI private catalogs | Container-per-server isolation; no enterprise RBAC | Private-catalog distribution pattern |
| 8 | **PulseMCP** | Directory | **20,120+** (as of July 1, 2026); official co-steward | Largest hand-reviewed directory | Curation precedent + sync source |
| 9 | **Glama** | Directory | **50,845 servers** (July 3; + 6,951 remote connectors; 293,804+ tools indexed) | Light curation on a large set | Breadth reference + sync source |
| 10 | **Smithery** | Directory + hosting | ~7,300 (free tier ended Mar 1, 2026; infra rebuild ongoing) | No formal governance; prototyping-grade | Discovery breadth, not a trust layer |
| 11 | **TrueFoundry** | Enterprise gw + registry | Commercial, VPC-native | RBAC, audit, virtual servers | Enterprise registry benchmark |

**Honorable mentions / watch list:** Kong AI Gateway (MCP Registry in Konnect Catalog, announced Feb 2, 2026; tech preview; no June GA),
mcp.so (~20,222, unvetted), MCP Market (~10k, community),
MintMCP (**SOC 2 Type II certified**; STDIO-to-production containerization; active June 2026 development),
Microsoft MCP Gateway (k8s, no catalog),
**Microsoft MCP Server for Enterprise** (Preview, July 2026; read-only Entra ID identity data via natural language; hosted on Microsoft Graph; preview only — watch for stable public endpoint),
**Stacklok ToolHive** (Apache 2.0; enterprise MCP server management + **Sigstore/GitHub Attestations provenance verification** — most concrete implementation of cryptographic MCP server trust; maintains verified-server registry; precedent for `provenance.attestation_url` schema field),
**AWS Agent Registry** (April 9, 2026 preview; private org catalog in Bedrock AgentCore; indexes agents/MCP servers/skills; exposes as MCP endpoint; watch for GA),
**Salesforce Agentforce MCP** (**Agentforce 3 — June 23, 2026**: added Salesforce DX MCP Server + Heroku Platform MCP Server + MuleSoft MCP Server, bringing total to 4+ distinct vendor-operated MCP servers; original GA June 15 covered SObject CRUD + SOQL + Tableau analytics; bidirectional — Agentforce also consumes external MCP servers via Atlas Reasoning Engine 3.0; org-specific endpoint pattern, not catalog-friendly),
**MACH Alliance MCP Registry** (new entrant June 2026; vendor-neutral, enterprise-focused, metadata-format aligned with official MCP Registry; open publishing, member-only governance/verification features; no curation signal yet — watch list only),
**Slack Marketplace MCP Registry** (new entrant June 2026; embedded in Slack Marketplace, workspace-admin-controlled approval flow for MCP apps; Slackbot MCP client GA with 20+ partner apps; mirrors `discovered != approved != enabled` pattern in product-native form; `com.slack/mcp` already in our catalog),
Composio, Operant, Airlock,
**Portkey** *(acquired by Palo Alto Networks, May 29, 2026; now Prisma AIRS; standalone in maintenance mode)*,
agentic-community/mcp-gateway-registry (OSS gateway+registry),
**Agensi** (new Q1-Q2 2026; curated marketplace with automated 8-point security scan).

## Standing reads

- **White space:** a focused, standalone, MCP-Registry-compatible **curated catalog with a
  documented gateway projection** is uncrowded — most rivals bundle curation into a
  full gateway/runtime suite.
- **Trust is the wedge:** provenance, version-pinning, verification, and change-detection
  are the differentiators buyers care about post-incident (postmark-mcp, CVE-2025-54136,
  CVE-2026-26118, CVE-2026-33032, RSAC 2026's systemic supply-chain advisory,
  VIPER-MCP's 106 zero-days across 39,884 repos, Akamai's database MCP flaws,
  the Clawdbot/OpenClaw 900+ gateway exposure with active exploitation (Jan 2026),
  the Mini Shai-Hulud npm worm (tool-description injection),
  **SANDWORM_MODE** (June 16, 2026) — npm worm injecting malicious MCP server configs
  via 19 typosquatted packages, targeting Claude Code / Cursor / VS Code,
  **Miasma Waves 1–3** (June 1–17, 2026) — self-spreading npm supply-chain worm;
  Wave 3 (June 17) compromised `@mastra` npm org, **144 packages backdoored in 88 minutes**,
  1.1M weekly downloads exposed, cross-platform RAT payload (credential harvesting + 166
  crypto-wallet extensions); toolkit / Phantom Gyp technique documented and available for reuse —
  derivative attacks expected H2 2026 (Microsoft Security Blog confirmed; Socket detected in 6 min),
  **IronWorm** (June 2026) — Rust/eBPF kernel rootkit npm stealer, 50+ poisoned packages from
  compromised account "asteroiddao"; targets 86 env vars covering Anthropic/Claude, OpenAI,
  AWS, Cursor, Docker, K8s, Exodus wallet credentials; uses eBPF to hide from scanners,
  **Miasma new variant + Hades wave** (June 2026) — 57 packages, 286 malicious versions;
  drops `preinstall`/`postinstall` hooks, executes via `binding.gyp` (Phantom Gyp), bypassing
  all package.json-watching scanners; 3 Red Hat MCP packages targeted; Hades wave crossed to
  Azure (73 repos disabled) + PyPI (37 malicious Python wheels) — worm is now cross-platform,
  **CVE-2026-20205** (April 15, 2026) — Splunk MCP Server app versions < 1.0.3 leak session +
  auth tokens in clear text to log files; CVSS 7.2; patched in v1.0.3. First known CVE against
  a major enterprise vendor's packaged MCP Server app. Not in our catalog (self-hosted),
  **CVE-2026-23744** (MCPJam Inspector RCE) — crafted HTTP requests install MCP servers and
  execute arbitrary code on the Inspector host; development/debug tooling,
  **Agentjacking** (CSA June 12, 2026) — Sentry DSN write-only credential used to inject prompt
  payloads into error events; Sentry MCP server faithfully returns attacker-controlled data to
  AI coding agents; **2,388 orgs exposed**; 100+ agents acted on injected payloads in testing;
  Sentry declined to fix at platform level ("Authorized Intent Chain" bypasses all traditional defenses),
  **BlueRock Security SSRF survey** (June 2026) — 36.7% of 7,000+ MCP servers SSRF-vulnerable;
  Microsoft Markitdown MCP exploited to extract AWS IAM credentials from EC2 metadata endpoint,
  CVE-2026-27825/27826 "MCPwnfluence" (CVSS 9.1 RCE + SSRF in `mcp-atlassian`; patched in 0.17.0),
  CVE-2026-25536 (MCP TypeScript SDK cross-client data leak; patched in SDK 1.26.0; **audit
  pass pending** to confirm all TypeScript SDK vendors in catalog are running >=1.26.0),
  **CVE-2026-54309** (n8n MCP browser HTTP transport, June 23, 2026) — unauthenticated
  MCP sessions via `--transport http`; allows browser-control (navigation, JS eval, cookies);
  patched in n8n v2.25.7 / v2.26.2; not in our catalog,
  **CVE-2026-26118** (Azure MCP Server SSRF, June 2026) — attacker-supplied URL causes managed
  identity token capture via SSRF; Azure org-specific endpoint, not in our catalog,
  **Shai-Hulud PyPI Hades wave** (June 9, 2026) — 23 MCP-themed PyPI packages (langchain-core-mcp,
  openai-mcp, instructor-mcp, tiktoken-mcp, ray-mcp-server) compromised; campaign total 471
  artifacts (411 npm + 60 PyPI); TeamPCP attribution; remote-HTTP-only catalog immune,
  **UNC1069 / Axios WAVESHAPER.V2** (March 31, 2026) — North Korea-nexus actor social-engineered
  axios npm maintainer; WAVESHAPER.V2 backdoor delivered via versions 1.14.1 and 0.30.4 (live ~3h);
  malware **enumerated MCP config files** (Claude Code, Cursor, Windsurf, VS Code Continue) and
  injected rogue server definitions — first confirmed nation-state targeting of MCP config files
  as exfiltration/persistence vector. [[Google Cloud GTIG]](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package)).
- **Security framework signal (June 2026):** Four complementary security resources now
  explicitly validate `discovered != approved != enabled` as the correct control layer:
  (1) **Adversa AI MCP Security TOP 25** (industry's first comprehensive vulnerability
  classification; 25 categories; prompt injection #1; living framework).
  [[Adversa AI]](https://adversa.ai/mcp-security-top-25-mcp-vulnerabilities/)
  (2) **OWASP MCP Top 10** (Phase 3 beta, stable/citable; MCP01:2025–MCP10:2025; led by
  Vandana Verma Sehgal); NSA guidance cross-mapped to OWASP Top 10 by Equixly (June 4, 2026).
  [[OWASP]](https://owasp.org/www-project-mcp-top-10/)
  [[Equixly mapping]](https://equixly.com/blog/2026/06/04/mapping-nsa-s-mcp-guidance-to-the-owasp-mcp-top-10-how-to-test-for-the-risks/)
  (3) **Adversa AI AIRQ Framework** (June 4, 2026) — first independent AI agent security
  rating; scores 100+ agents on attack surface, blast radius, and defense controls;
  contributors from OWASP, CoSAI, CSA, NIST.
  [[AIRQ]](https://airq.adversa.ai/report)
  (4) **The Vulnerable MCP Project** (vulnerablemcp.info) — open-source comprehensive
  CVE database for MCP; tracks exploits, CVEs, and security research.
  [[vulnerablemcp.info]](https://vulnerablemcp.info/)
  (5) **Authzed Timeline of MCP Security Breaches** (June 2026) — timestamped historical
  incident index; complements the Vulnerable MCP Project CVE database.
  [[Authzed]](https://authzed.com/blog/timeline-mcp-breaches)
  (6) **PipeLab State of MCP Security 2026** — cross-incident analysis of attack patterns
  and defense coverage across known MCP vulnerability classes.
  [[PipeLab]](https://pipelab.org/blog/state-of-mcp-security-2026/)
  (7) **Adversa AI Top MCP Security Resources June 2026** — curated roundup of CVEs, tools,
  and threat intelligence through June 2026.
  [[Adversa AI]](https://adversa.ai/blog/top-mcp-security-resources-june-2026/)
- **NSA validation (May 20, 2026):** The NSA published MCP security design guidance
  explicitly recommending source-verified, reputable MCP registries as a control layer.
  The `discovered != approved != enabled` boundary is exactly the NSA's recommended
  gate. Document: U/OO/6030316-26, 17pp.
  [NSA PDF](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf)
- **AAIF governance (June 2026):** 170 member organizations in under four months — faster
  than CNCF at the same stage. Formal project lifecycle policy (Growth / Impact / Emeritus)
  approved. MCP Dev Summits in Bengaluru (June 9–10) and Mumbai (June 14–15) complete.
  **Inaugural Ambassador Cohort (June 23, 2026):** 138 ambassadors across 41 countries —
  broadest geographic expansion signal yet; individual practitioner layer on top of 170+ orgs.
  **Confirmed 2026 event calendar:** Seoul (Aug 13–14), Shanghai (Sept 6–7), Tokyo (Sept 10–11),
  AGNTCon + MCPCon Europe (Amsterdam, Sept 17–18), North America (San Jose, CA, Oct 22–23).
  [[AAIF]](https://aaif.io)
  [[AAIF Global Events]](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe)
- **MCP Shadow IT (Qualys, March 2026):** Qualys extended TotalAI with MCP server discovery
  and inventory. Gravitee survey (Feb 2026): 47% of ~3M deployed AI agents not monitored.
  CSA: 82% of enterprises have unknown AI agents. Sub-registry approval workflow is the
  structural mitigation. [[Qualys blog]](https://blog.qualys.com/product-tech/2026/03/19/mcp-servers-shadow-it-ai-qualys-totalai-2026)
- **Enterprise-Managed Authorization (EMA / SEP-990) stable — June 18, 2026:** Anthropic
  published zero-touch OAuth provisioning for MCP connectors via enterprise IdP (Okta first;
  more IdPs coming). 7 connectors at launch: Asana, Atlassian, Canva, Figma, Granola, Linear,
  Supabase. **5 of 7 are in our catalog.** Slack EMA support coming. This is the clearest
  external validation of our curation criteria: Anthropic's own short-list overlaps ours by
  71% at launch. Signals that our `approved` catalog set is already aligned with enterprise
  provisioning intent.
  [[MCP Blog — EMA]](https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/)
- **Scale signal (July 2026):** Censys: 12,520 internet-accessible MCP services, ~40%
  unauthenticated — **Trend Micro follow-up (June 2026)** puts 1,467 of these as publicly
  exposed MCP servers (3x prior baseline), 74% hosted on major CSPs (AWS/Azure/GCP/Oracle),
  with CVSS 9.8 command-injection found in unofficial AWS/Azure servers (not official vendor
  servers). Cross-registry ecosystem count: **~74,000+ servers** (Official Registry +
  Glama + Smithery + mcp.so + github.com/modelcontextprotocol; Glama now **50,845**
  as of July 3; PulseMCP **20,120+**; MCPToplist cross-registry
  aggregate **73,547** as of late June 2026).
  Official MCP Registry alone: ~9,652 latest records (May 24). Our curated
  set: **19**. The trust gap — ~74k indexed vs. 19 approved — is the product.
  **Ecosystem concentration risk (Security Boulevard, June 2026):** 973 MCP npm packages
  analyzed; 71% single-maintainer; 56% < 30 days old; 25% no source repo; 9/11 registries
  failed to detect malicious uploads. Our remote-HTTP-only catalog is immune to all STDIO/npm
  risk vectors. [[Security Boulevard]](https://securityboulevard.com/2026/06/973-mcp-packages-71-single-maintainer-a-practitioners-guide-to-ai-developer-security/)
  **GitGuardian (2026):** 24,008 unique secrets in MCP config files on public GitHub;
  2,117 confirmed live at scan time; AI-service credential leaks up 81% YoY. Our schema
  stores secret *names* only — never values. [[GitGuardian Secrets Sprawl 2026]](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026)
- **New attack surfaces in 2026-07-28 spec (Backslash, June 2026):** Three attack vectors that
  bypass gateway-layer detection: (1) **MCP Apps iframes** — HTML rendered in IDE iframe is
  invisible to network monitoring; (2) **stateless transport** — DPI-based session policies must
  be rebuilt around per-request `Mcp-Method`/`Mcp-Name` headers; (3) **Tasks extension lifetime**
  — long-running task handles enable cross-client hijacking if servers don't enforce ownership.
  All three require **endpoint-level** security, not just gateway-layer. Our catalog is not a
  runtime surface — these are concerns for gateway operators and MCP client implementers.
  [[Backslash]](https://www.backslash.security/blog/new-mcp-spec-opens-new-attack-surfaces)
- **Spec watch:** MCP 2026-07-28 RC (locked May 21; ships July 28 — **25 days**). SDK v2 betas live June 29 (Python mcp==2.0.0b1; TS v2 new packages; Go v1.7.0-pre.1; C# v2.0.0-preview.1); Python stable July 27; TS stable July 28. Breaking changes:
  `initialize`/`initialized` handshake removed; `Mcp-Session-Id` deprecated; stateless protocol
  enables round-robin load balancing; new `_meta` carries capabilities + W3C trace context;
  `ttlMs`/`cacheScope` for list/read cache control; Roots/Sampling/Logging deprecated (12-month window);
  mandatory `Mcp-Method`/`Mcp-Name` headers; MCP Apps (SEP-1865) and Tasks as official extensions.
  No catalog schema change required. Gateway operator must update transport validation before July 28.
- **Server Cards (SEP-2127, targeting June 2026 merge):** `/.well-known/mcp/server-card.json` standard
  for machine-readable server metadata. Claude Desktop + Cursor already shipping support (April 2026).
  Parallel IETF track: draft-serra-mcp-discovery-uri-04 (expires Sep 2026). Working Group term ends
  Aug 14, 2026 — may land post-RC rather than in the July 28 spec. Once merged, `subregistry-audit`
  can query this endpoint to auto-verify tool counts and protocol version on cataloged servers.
- **Asana V1 SSE endpoint shutdown (May 11, 2026):** `https://mcp.asana.com/sse` is dead. V2 Streamable
  HTTP at `https://mcp.asana.com/v2/mcp`. Catalog updated 2026-06-18. **Atlassian SSE endpoint shut
  down June 30, 2026** — confirmed today; our catalog entry already on Streamable HTTP.
  SSE-to-Streamable-HTTP migration is now complete for all major cataloged vendors.
- **OX Security STDIO RCE (April 2026):** 14 CVEs, 200k+ vulnerable instances, 9/11 registries poisoned.
  Root cause is STDIO transport design (Anthropic declined protocol change). Our remote-HTTP-only
  catalog is structurally immune. Strongest external validation of the remote-HTTP-first approach.
- **Acquisition signal:** Palo Alto Networks acquiring Portkey (closed May 29, 2026) is the strongest
  enterprise validation signal to date — an $8B-ARR incumbent paying for AI gateway governance confirms
  the market we serve is real and growing. Portkey is now in maintenance mode; Prisma AIRS is the live entity.

# MCP Ecosystem Update — 2026-07-07

Daily research pass. Covers developments since the July 6 report
([2026-07-06-mcp-ecosystem-update.md](./2026-07-06-mcp-ecosystem-update.md)).
Focus: ecosystem scale (Glama ~51,961); spec countdown 21 days; MCPCon Shanghai schedule
announcement due July 8; X (Twitter) MCP endpoint confirmation; SnapLogic MCP Builder GA;
ToolHive provenance schema validation; SDK v2 T-21 countdown; OAuth spec hardening via 6 SEPs;
clean security window extends to Day 9.

All external claims cited with source URLs.

---

## 1. Ecosystem Scale

| Directory | Count | vs. July 6 |
|-----------|-------|------------|
| **Glama** | **~51,961 servers** | +384 (+0.7%) |
| Glama connectors | ~6,951 | ~stable |
| PulseMCP | 20,110+ | ~stable |
| Smithery | ~7,300 | ~stable |
| MCPToplist (cross-registry) | ~73,547 | ~stable |
| Official MCP Registry | ~9,652 versioned records | (last confirmed May 2026) |
| **Our curated set** | **19** | unchanged |

Glama's live title now shows **~51,961** open-source MCP servers (up ~384 from 51,577 on July 6).
Daily growth rate continues to moderate toward ~300–400/day from late-June batch-indexing peaks.
Cross-registry aggregate remains ~73.5k.

[[Glama MCP Registry]](https://glama.ai/mcp/servers)
[[MCPToplist]](https://mcptoplist.com/)

**Trust gap: ~73.5k indexed vs. 19 approved.** The gap continues to widen with no sign of reversal.

---

## 2. Spec Countdown — 21 Days to July 28 Final

The 2026-07-28 release candidate remains locked at May 21. Final specification ships July 28, 2026
— **21 days from today**.

No new spec changes since the July 6 report. Previously documented breaking changes remain the full
list:

- **Stateless core** (SEP-2567): `Mcp-Session-Id` removed; initialize handshake removed; protocol
  version, capabilities, and client identity travel in `_meta` on every request.
- **Required HTTP headers**: `Mcp-Method` and `Mcp-Name` (SEP-2243) for gateway/load-balancer routing.
- **Response caching**: `ttlMs` + `cacheScope` (SEP-2549) on list and resource-read results.
- **MCP Apps** (SEP-1865): server-rendered HTML in sandboxed iframes — new extension.
- **Tasks redesign**: moved from core to extension; lifecycle is stateless-model-compatible.
- **6 OAuth SEPs**: `iss` parameter validation per RFC 9207 (mix-up attack prevention); OIDC
  `application_type` declaration required during Dynamic Client Registration.
- **Deprecations**: Roots, Sampling, Logging — 12-month overlap guaranteed.

The six OAuth SEPs are the most relevant change for our cataloged OAuth-gated servers. Any operator
connecting to Atlassian, Asana, GitHub, Slack, or HubSpot via Claude Code or an MCP client must
upgrade to a client that validates the `iss` parameter after July 28 to prevent mix-up attacks in
multi-authorization-server environments.

[[RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[Akamai analysis]](https://www.akamai.com/blog/security-research/new-mcp-specification-security-teams-must-prepare)
[[MCP stateless explainer]](https://byteiota.com/mcp-goes-stateless-july-2026-breaking-changes/)

---

## 3. MCPCon Shanghai — Schedule Announced July 8

The MCP Dev Summit Shanghai (AGNTCon + MCPCon China) schedule announcement is due **tomorrow,
July 8, 2026**. The event itself runs **September 6–7, 2026**, co-located with KubeCon +
CloudNativeCon China, OpenInfra Summit, and PyTorch Conference China 2026 in Shanghai.

The CFP closed May 29. The schedule announcement will surface session tracks and speakers, which
often preview upcoming spec additions, enterprise governance patterns, and new registry/catalog
tooling.

[[AAIF Shanghai]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
[[AAIF global events]](https://aaif.io/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe/)

**Catalog relevance:** no catalog action needed. Monitor July 8 announcement for any new catalog
candidates surfaced in session abstracts.

---

## 4. X (Twitter) MCP Server — Catalog Candidate Confirmed

The official X (Twitter) hosted MCP server launched June 30, 2026, at **`https://api.x.com/mcp`**
(Streamable HTTP). Authentication uses **OAuth 2.0 via the open-source `xurl` bridge CLI** — not a
direct OAuth browser flow. Developers must register through the X Developer Portal, install and
configure `xurl`, then paste credentials into their MCP client.

**Capabilities**: full-archive search, trends and news, bookmark management, Article drafting and
publishing, user lookups, conversation analysis.

**Catalog assessment:**
- Endpoint is live and first-party (vendor-hosted, not community).
- Auth model is OAuth 2.0, but requires the `xurl` local bridge (not a standard OAuth 2.1 PKCE
  flow). This introduces a STDIO-adjacent dependency (`xurl` CLI must run locally) that complicates
  direct remote-HTTP cataloging. The server itself is remote-HTTP at `api.x.com`; the auth bridge is local.
- **Decision**: Flag as #2 curate candidate (after HubSpot). Verify that `xurl` is not required in
  headless/server contexts before adding. If the endpoint accepts a standard Bearer token directly,
  catalog as `auth.type: oauth2` with a note on the xurl requirement.

[[TechCrunch]](https://techcrunch.com/2026/06/30/x-now-offers-an-mcp-server-to-make-its-platform-easier-for-ai-tools-to-use/)
[[CyberSecurityNews launch coverage]](https://cybersecuritynews.com/x-launches-hosted-mcp-servers/)
[[MCP.Directory guide]](https://mcp.directory/blog/x-twitter-mcp-server)

---

## 5. SnapLogic MCP Builder — New Enterprise Entrant (July 1, 2026 GA)

SnapLogic announced general availability of **SnapLogic MCP Builder** on July 1, 2026. The product
automatically converts existing SnapLogic integration pipelines into MCP-compatible tools, exposing
them to agents that speak MCP without requiring new code or manual MCP implementation.

**Why it matters:** SnapLogic is a mid-to-large enterprise integration platform (iPaaS category).
MCP Builder positions it as a low-code/no-code bridge between enterprise data integration and AI
agent tooling — a pattern that Workato, MuleSoft, and Boomi are also pursuing. These platforms
collectively manage enterprise data flows and are now MCP-exposing them.

**Catalog relevance:** SnapLogic's MCP endpoint is customer-specific (enterprise SaaS with
per-tenant URLs), not catalogable in the current form. However, the pattern matters: enterprise
integration vendors are now MCP-wrapping their existing pipelines, expanding the universe of
potential remote MCP endpoints. Added to landscape watch list.

[[GlobeNewswire]](https://www.globenewswire.com/news-release/2026/07/01/3320652/0/en/SnapLogic-Launches-MCP-Builder-to-Accelerate-Enterprise-AI-Adoption-Through-Simplified-MCP-Creation.html)

---

## 6. ToolHive Provenance Schema — Sigstore Fields Confirmed

Stacklok's ToolHive registry schema now includes a structured `provenance` field with the following
sub-fields: `sigstore_url`, `repository_uri`, `signer_identity`, `runner_environment`, and
`cert_issuer`. These are verified via Sigstore short-lived certificates (tied to GitHub/Google
identity) and GitHub Attestations (build provenance records from GitHub Actions).

This is the most concrete implementation of signed MCP provenance in any public registry to date.
The schema directly validates our roadmap item (CLAUDE.md §13 Next actions #5): adding
`provenance.attestation_url` + `provenance.signing_method` to our approved server schema when
Sigstore-signed MCP artifacts become common upstream.

**Catalog action:** no immediate schema change needed. Continue monitoring ToolHive catalog for
any cataloged vendors (GitHub, Stripe, Atlassian, etc.) that publish Sigstore-attested containers.
When >=3 of our 19 catalog entries have attestation URLs, open the schema migration.

[[Stacklok ToolHive blog]](https://stacklok.com/blog/from-unknown-to-verified-solving-the-mcp-server-trust-problem/)
[[ToolHive registry schema docs]](https://docs.stacklok.com/toolhive/reference/registry-schema-upstream)
[[MDPI provenance paper]](https://doi.org/10.3390/fi18050243)

---

## 7. SDK v2 Countdown — T-21 Days

All four Tier 1 SDK betas remain live (confirmed since July 3 report):

| SDK | Beta version | Stable target |
|-----|-------------|---------------|
| Python | `mcp==2.0.0b1` | July 27, 2026 (T-20 days) |
| TypeScript | v2 beta (`@modelcontextprotocol/server` + `@modelcontextprotocol/client`) | July 28, 2026 |
| Go | `v1.7.0-pre.1` | ~July 28 |
| C# | `v2.0.0-preview.1` | ~July 28 |

**TypeScript v2** retires the monolithic `@modelcontextprotocol/sdk` in favor of focused packages
(`@modelcontextprotocol/server`, `@modelcontextprotocol/client`) with thin adapters for Node.js,
Express, Hono, and Fastify. ESM-only; Node 20+ / Bun / Deno. Migration codemod available.

**Production guidance** (unchanged): pin `mcp>=1.27,<2` for Python; use `@modelcontextprotocol/sdk`
v1.x for TypeScript until July 28. v1 receives security updates for ≥6 months post-v2 GA.

**CVE-2026-25536 audit** (TypeScript SDK cross-client data leak): patched at v1.26.0. All TypeScript
SDK vendors in our catalog should be >=1.26.0. Audit pass still pending (CLAUDE.md §13 Next
actions #3b).

[[SDK betas blog]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)
[[TypeScript SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)
[[Python SDK releases]](https://github.com/modelcontextprotocol/python-sdk/releases)

---

## 8. Enterprise Adoption Snapshot

Third-party data points on MCP adoption (various sources, July 2026):

- **Monthly SDK downloads**: ~97M–110M (up from ~2M at launch, November 2024).
- **Enterprise penetration**: 78% of enterprise AI teams have MCP-backed agents in production
  (Digital Applied / andrew.ooo July 2026 estimates).
- **Fortune 500**: 28% run MCP servers.
- **Gartner projection**: 40% of enterprise applications will include task-specific AI agents by
  end of 2026; 75% of API gateway vendors will have MCP features.
- **Anthropic Connectors Directory**: 343 verified integrations (tracked since July 4 report).

These numbers are analyst estimates and marketing surveys — treat them as directional signals, not
authoritative counts. The trust gap (73k+ indexed vs. 19 curated) is the authoritative data point
for this registry.

[[Digital Applied]](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)
[[Andrew.ooo July 2026 state of play]](https://andrew.ooo/answers/mcp-model-context-protocol-enterprise-adoption-july-2026/)
[[Gartner via CData]](https://www.cdata.com/blog/2026-year-enterprise-ready-mcp-adoption)

---

## 9. Security — Day 9 Clean Window

**No new CVEs or security incidents on July 7, 2026.** The clean window that began June 30 extends
to Day 9. All 19 catalog servers remain `approved`/`public`.

Previously documented active threats (all still applicable):
- **IronWorm** (June 2026): Rust/eBPF npm stealer; 50+ poisoned packages targeting 86 env vars.
- **Miasma Hades wave** (June 2026): 57 packages, 286 versions, crossed to Azure/PyPI.
- **SANDWORM_MODE** (June 16): typosquatted npm targeting MCP config files.
- **MCPTox benchmark** (July 2): 72.8% tool-poisoning success rate across 45 real servers.
- **CVE-2026-35394** (Mobile MCP, CVSS n/a): intent injection via URL scheme; not in catalog.

All are npm/STDIO/package-based vectors. Remote-HTTP-only catalog is structurally immune.

[[vulnerablemcp.info]](https://vulnerablemcp.info/)
[[Authzed timeline]](https://authzed.com/blog/timeline-mcp-breaches)
[[Trend Micro cloud threat update]](https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud)

---

## 10. Catalog Hooks

Checking `data/default-curated-servers.json` (19 entries) against today's findings:

| Server | Finding | Action |
|--------|---------|--------|
| All 19 | Day 9 clean security window | None |
| All TypeScript SDK vendors | CVE-2026-25536 audit pending (>=1.26.0 check) | `subregistry-audit` pass (Next actions #3b) |
| — | X (`api.x.com/mcp`) — catalog candidate | Verify headless auth before curating |
| — | HubSpot (`mcp.hubspot.com`) — #1 curate priority | OAuth 2.1 + PKCE; no DCR; GA April 13 |
| `com.aws/mcp` | AWS Agent Registry namespace migration Aug 6 (`bedrock-agentcore` → `agent-registry`) | Monitor; `com.aws/mcp` is a distinct product, no action expected |

No catalog entries need immediate demotion or re-verification today. Endpoint health is assumed
stable given the clean security window (last verified at the June 16 audit pass).

---

## 11. Next Research Focus

- **July 8**: MCPCon Shanghai schedule announcement — scan session abstracts for new catalog
  candidates and spec-aligned governance patterns.
- **July 27**: Python SDK v2.0.0 stable ships — re-verify Python-SDK-based catalog vendors.
- **July 28**: MCP spec final ships — no catalog schema change expected; confirm with a
  focused read of the final diff against RC.
- **Ongoing**: TypeScript SDK CVE-2026-25536 audit (>=1.26.0 verification for all TS vendors
  in catalog) — highest pending action.

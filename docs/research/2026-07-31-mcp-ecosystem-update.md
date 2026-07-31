# MCP Ecosystem Update — 2026-07-31

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-30 EOD → 2026-07-31
**Prior report:** [2026-07-30-mcp-ecosystem-update.md](./2026-07-30-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama crosses 65k** — Page title now reads 65,354 servers (up from ~63,926 on July 30;
  +1,428 in ~24h). Trust gap: ~83k+ indexed cross-registry vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
- **CVE-2026-66012 (CVSS 10, SiYuan)** — Critical unauthenticated administrator takeover
  via the `/mcp` kernel endpoint in SiYuan before v3.7.2; chains three defects into arbitrary
  workspace file read/write/delete, credential exfiltration, and RCE via plugin planting.
  Patched in v3.7.2. SiYuan is a personal knowledge management desktop app — **not in our
  catalog**; remote-HTTP catalog structurally immune.
  [[VulnCheck advisory]](https://www.vulncheck.com/advisories/siyuan-before-unauthenticated-administrator-takeover-via-mcp)
  [[TheHackerWire]](https://www.thehackerwire.com/siyuan-critical-missing-authorization-to-remote-administrator-takeover-cve-2026-66012/)
- **MCPCon Shanghai agenda published** — Linux Foundation announced the full session schedule
  for AGNTCon + MCPCon China (September 6–7, Shanghai International Convention Center,
  co-located with KubeCon China); 40+ sessions covering MCP & agent protocols, infrastructure,
  orchestration, evaluation.
  [[Linux Foundation / X post]](https://x.com/linuxfoundation/status/2075384556006297639)
  [[Schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)
- **Anthropic Claude MCP 2026-07-28 rollout blog live** — Anthropic published a dedicated
  Claude blog post on rolling out 2026-07-28 support across Claude products: MCP Apps + Tasks
  as versioned extensions, enterprise identity alignment with Entra/Okta, embedded UI, and
  MCP Tunnels for private network servers.
  [[Claude blog]](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude)
- **AWS Agent Registry namespace migration in 6 days** — Migration from
  `bedrock-agentcore` → `agent-registry` namespace begins August 6, 2026; endpoints, IAM
  policies, SDK clients, and CLI scripts must be updated. Our `com.aws/mcp` (AWS MCP Server,
  a distinct GA product) is unaffected.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
- **SEP-2127 WG: 14 days to close** — Working group term ends August 14, 2026. Path
  `/.well-known/mcp.json` confirmed; validator tool live at agent-ready.dev.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Validator]](https://agent-ready.dev/mcp-card-validator)
- **Security: Day 34 clean window** — No new CVEs affecting any of our 19 cataloged servers.
  CVE-2026-66012 is SiYuan (desktop/local app). All 19 entries remain approved/public.

---

## 2. Registry Scale Update

| Directory | Count (July 31) | Prior (July 30) | Change |
|---|---|---|---|
| Glama | **65,354** | ~63,926 | +1,428 |
| PulseMCP | ~22,110+ | 22,260+ | ≈ flat (data variation) |
| MCPToplist (cross-registry) | 81,852 | 81,852 | steady |
| Our catalog | **19 approved** | 19 | — |

Glama's +1,428 rise continues a sustained indexing acceleration post-spec-release (Glama
crossed 50k July 1, 62k July 29, and now 65k July 31 — roughly +3,000/day average over the
last two days). The cross-registry MCPToplist count is stable at 81,852; a significant jump
is likely as Glama's new entries propagate.

PulseMCP shows ~22,110+ in a fresh directory fetch vs. 22,260+ yesterday; the slight
decrease is likely data variation from stale cache or minor cleanup rather than a structural
contraction.

[[Glama servers page]](https://glama.ai/mcp/servers)
[[PulseMCP directory]](https://www.pulsemcp.com/servers)
[[MCPToplist]](https://mcptoplist.com/)

---

## 3. CVE-2026-66012 — SiYuan CVSS 10 (Not in Catalog)

**Disclosed:** July 13, 2026 via GitHub Security Advisory GHSA-hp8g-g2qj-wgpj
**Affected:** SiYuan personal knowledge management app before v3.7.2
**CVSS score:** 10 (Critical)

The vulnerability chains three independent defects in SiYuan's kernel into an unauthenticated,
network-reachable path to full administrator takeover:

1. The `/mcp` kernel endpoint is gated only by a general `CheckAuth` check with no admin-role
   or read-only enforcement, exposing 31 MCP tools including a full-featured file tool
   (list/read/write/delete/rename/copy across the entire workspace).
2. When the Publish server runs in anonymous mode (`Conf.Publish.Enable=true` and
   `Conf.Publish.Auth.Enable=false`), the Publish reverse proxy attaches an anonymous
   `RoleReader` JWT to every proxied request, allowing a remote unauthenticated attacker to
   reach `/mcp`.
3. The attacker reads `conf/conf.json` to extract `accessAuthCode`, `api.token`, and
   `cookieKey` in plaintext, then writes a malicious plugin into `data/plugins/` — which
   executes with `nodeIntegration:true` and no `contextIsolation` on the next desktop launch.

**Remediation:** Upgrade SiYuan to v3.7.2 or later.

**Catalog relevance:** None. SiYuan is a desktop/self-hosted personal knowledge app — not a
vendor-operated remote MCP endpoint and not in our catalog. Our remote-HTTP-only model is
structurally immune: all 19 entries expose vendor-operated HTTPS endpoints, not self-hosted
desktop app kernels. This CVE validates that the `/mcp` endpoint must be treated as a
security boundary even in local/desktop deployments — a lesson for SiYuan users and any
self-hosted MCP server operator.

[[VulnCheck advisory]](https://www.vulncheck.com/advisories/siyuan-before-unauthenticated-administrator-takeover-via-mcp)
[[TheHackerWire analysis]](https://www.thehackerwire.com/siyuan-critical-missing-authorization-to-remote-administrator-takeover-cve-2026-66012/)
[[GitHub advisory]](https://github.com/advisories/GHSA-hp8g-g2qj-wgpj)

---

## 4. MCPCon Shanghai — Agenda Now Live

The Linux Foundation published the session schedule for **AGNTCon + MCPCon China**,
September 6–7, 2026, at the Shanghai International Convention Center, co-located with
KubeCon + CloudNativeCon China, OpenInfra Summit, and PyTorch Conference China 2026.

40+ sessions across two tracks: MCP & agent protocols, and infrastructure/orchestration/
evaluation/production systems. Sessions will be recorded and published on the AAIF YouTube
channel within two weeks of the event. This is the second-largest AAIF event of 2026;
the largest (MCPCon North America) follows October 22–23 in San Jose, CA.

The agenda is browsable at the event platform:

[[Schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)
[[CNCF announcement]](https://www.cncf.io/announcements/2026/06/18/kubecon-cloudnativecon-openinfra-summit-and-pytorch-conference-unite-in-china-to-scale-ai/)
[[AAIF press release]](https://aaif.io/press/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe)

**Relevance:** No catalog action. Event is a discovery/networking signal; scan session
abstracts when posted for new vendors that may become curate candidates.

---

## 5. Anthropic Claude — MCP 2026-07-28 Rollout Blog

Anthropic published a dedicated Claude blog post confirming the 2026-07-28 spec rollout
across Claude products:

- **MCP Apps + Tasks** ship as versioned extensions under the `io.modelcontextprotocol/`
  namespace — isolated from the core protocol as intended by the spec.
- **Enterprise identity alignment**: EMA/SEP-990 (Anthropic + Microsoft + Okta connector
  provisioning) now aligned with Entra and Okta identity systems via the new OAuth 2.1
  resource-server model from the spec.
- **Embedded UI**: MCP Apps (sandboxed iframes per SEP-1865) now available within Claude
  product surfaces, enabling server-rendered UI from trusted catalog servers.
- **MCP Tunnels**: Private network server support mentioned as a shipping feature, not just a
  research preview. This is significant for enterprise deployments where servers cannot be
  publicly exposed.

[[Claude blog — bringing MCP 2026-07-28 to Claude]](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude)
[[Anthropic release notes, July 2026]](https://releasebot.io/updates/anthropic)

**Catalog relevance:** MCP Tunnels reaching a broader rollout is worth tracking. If Tunnels
allows private-network servers to be brokered through Anthropic's infrastructure, it opens a
new endpoint archetype (`remotes[].type: "mcp-tunnel"`). No schema change now — flag as a
watch item until the GA surface and endpoint pattern stabilize. See §12.5 and roadmap note
in CLAUDE.md.

---

## 6. SDK v2 Migration — Documentation and Tooling Available

Post-release, comprehensive migration guides and automated tooling are now published:

- **TypeScript SDK v2 codemod**: `npx @modelcontextprotocol/codemod@beta v1-to-v2` for
  mechanical migration from `@modelcontextprotocol/sdk` (v1.x) to the new
  `@modelcontextprotocol/server` + `@modelcontextprotocol/client` packages.
  [[Migration guide]](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/migration/upgrade-to-v2.md)
- **Python SDK v2 migration guide** available at `py.sdk.modelcontextprotocol.io/migration/`.
  [[Python migration guide]](https://py.sdk.modelcontextprotocol.io/migration/)
- **Backward compatibility confirmed**: v2 servers continue to accept the legacy 2025-11-25
  `initialize` handshake; v2 clients fall back to v1 handshake when `server/discover` is
  absent. Upgrading the SDK does not automatically switch wire behavior — servers opt in
  explicitly.
- **v1.x security patch window**: v1 SDKs receive security fixes for ≥6 months post-v2
  stable (i.e., through approximately January 28, 2027 for TypeScript; January 27, 2027 for
  Python).

[[MCP Blog — SDK betas post]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)
[[Context Studios v2 beta explainer]](https://www.contextstudios.ai/blog/mcp-v2-beta-stateless-migration)
[[AAIF migration guide]](https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate)

**Catalog relevance:** CVE-2026-25536 audit (verify all TS-SDK vendors ≥v1.26.0 or migrated
to v2.0.0) remains an open action. The v1.x security patch window means there is no urgency
to force vendor migration to v2 immediately — but vendors still on v1.x below 1.26.0 remain
exposed.

---

## 7. AWS Agent Registry — Namespace Migration Begins August 6

The AWS Agent Registry (currently in Preview under Bedrock AgentCore) migrates its service
namespace from `bedrock-agentcore` to `agent-registry` on **August 6, 2026** — six days
from now. Users of the preview service must update:

- API endpoint URLs
- IAM policies
- SDK clients
- CLI scripts and registry data references

AWS has published a "Comprehensive registry migration guide" in the Bedrock AgentCore docs.

**Catalog relevance:** Our `com.aws/mcp` entry is the **AWS MCP Server** (GA, distinct
product — Agent Toolkit for AWS, us-east-1 + eu-central-1, IAM/CloudWatch/CloudTrail, SigV4
auth). It is not the AWS Agent Registry. No catalog action needed. Continue watching for
GA status on the Agent Registry itself — if it reaches GA with stable endpoints, it may
qualify as a sync source for our upstream discovery pipeline.

[[AWS Agent Registry docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
[[AWS What's New]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview)

---

## 8. SEP-2127 (MCP Server Cards) — 14 Days to WG Close

The SEP-2127 Working Group term ends **August 14, 2026** (14 days). Key confirmed details:

- **Endpoint path:** `/.well-known/mcp.json` (NOT `mcp/server-card.json` — that was SEP-1649,
  superseded)
- **Site-level catalog:** `/.well-known/mcp/catalog.json`
- **Validator tool live:** https://agent-ready.dev/mcp-card-validator
- **Publishing guide:** https://agent-ready.dev/how-to-publish-an-mcp-server-card
- **Client support:** Claude Desktop and Cursor already ship Server Card support

Once the WG closes (Aug 14), the next `subregistry-audit` pass should GET
`/.well-known/mcp.json` on each of the 19 cataloged servers and record tool count +
protocol version in `verification.notes`. No schema migration needed — the field maps to
existing `verification.notes` text.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Agent Ready validator]](https://agent-ready.dev/mcp-card-validator)
[[DEV.to explainer]](https://dev.to/turva-dev/mcp-server-cards-explained-5hgb)

---

## 9. Catalog Hooks and Actions

| Server | Finding | Action |
|---|---|---|
| All 19 | Security: Day 34 clean window; no new CVEs against cataloged endpoints | No change |
| `com.aws/mcp` | AWS Agent Registry namespace migration Aug 6 — distinct product, no overlap | No action |
| `com.stripe/mcp`, `com.supabase/mcp` | Named in official spec launch as day-zero supporters | Positive trust signal; no change |
| All TS-SDK vendors | CVE-2026-25536 SDK audit still pending | Flag for next audit pass |
| **Next curate:** HubSpot | `mcp.hubspot.com`; GA April 13; OAuth 2.1 + PKCE; one-click Claude connector confirmed | **#1 priority — run subregistry-curate** |

All 19 catalog entries remain `approved`/`public`. No demotions, no dead endpoints detected
in today's research.

---

## 10. Security: Day 34 Clean Window

No new CVEs affecting any of the 19 cataloged servers were identified in today's research.
CVE-2026-66012 (SiYuan, CVSS 10) is a desktop/self-hosted app — not in catalog, remote-HTTP
model immune.

Active threat landscape remains unchanged from the July 30 report:
- SANDWORM_MODE / Miasma / IronWorm npm/PyPI worm families — remote-HTTP catalog immune
- Tool poisoning (ShareLock, Sentry Threshold) — auth-gated catalog reduces surface
- BlueRock SSRF (36.7% of community servers) — cataloged servers are vendor-operated/auth-gated
- OX Security "Mother of All AI Supply Chains" STDIO/RCE — remote-HTTP catalog immune

Five independent security frameworks (NSA, OWASP MCP Top 10, OX Security, GBHackers
large-scale scan, Security Boulevard) now all identify the remote-HTTP + auth-gated model as
the correct structural defense.

# MCP Ecosystem Update — 2026-06-23

Daily research pass. Covers developments since the June 22 report
([2026-06-22-mcp-ecosystem-update.md](./2026-06-22-mcp-ecosystem-update.md)).
Focus: Enterprise-Managed Authorization (EMA/SEP-990) goes stable with Okta + 7 connectors;
MCP spec RC countdown 35 days; Atlassian SSE shutdown 7 days away (catalog already updated);
Docker MCP Toolkit adds unverified-server warning banner; AAIF leadership change + summit recap;
PulseMCP count update; pending CVE-2026-25536 TypeScript SDK audit.

All external claims cited with source URLs.

---

## 1. Enterprise-Managed Authorization (EMA) Stable — June 18, 2026

The most significant governance development since the spec RC was published: **Anthropic
published Enterprise-Managed Authorization (SEP-990) as stable on June 18, 2026**, enabling
enterprise IT administrators to provision MCP connector access centrally via their identity
provider — eliminating per-user OAuth consent flows.

### How it works

- Administrators configure connector access once in their IdP (Okta at launch as first
  supported IdP via Okta Cross App Access / XAA).
- On first login, employees automatically receive access to all connectors assigned to their
  IdP group — across Claude chat, Claude Code, and Cowork.
- No individual OAuth handshakes required after central provisioning.
- Governance is inverted: **the organization's IdP becomes the authoritative decision-maker
  for MCP server access**, not the individual user.

### Connectors supported at launch

Asana, Atlassian, Canva, Figma, Granola, Linear, and Supabase. Slack listed as "coming soon."

[[MCP Blog — Enterprise-Managed Auth]](https://blog.modelcontextprotocol.io/posts/enterprise-managed-auth/)
[[TechTimes — EMA stable]](https://www.techtimes.com/articles/318708/20260619/mcp-enterprise-authorization-goes-stable-zero-touch-sso-okta-anthropic-vs-code.htm)
[[Okta press release]](https://www.okta.com/en-ca/newsroom/press-releases/okta-becomes-a-featured-identity-provider-powering-secure-ai-agent-connections-for-claude-enterprise/)

### Catalog implication — validates 5 of 7 curation choices

Of the 7 EMA-supported connectors at launch, **5 are in our curated catalog**:
`com.asana/mcp`, `com.atlassian/mcp`, `com.figma/mcp`, `com.linear/mcp`, `com.supabase/mcp`.
Canva and Granola are not in our catalog. Anthropic's own curated short-list maps directly
to our approved set — the strongest external signal yet that our curation criteria align
with real enterprise trust requirements.

Action: No catalog schema change. No new entries needed immediately. When Slack EMA support
ships, `com.slack/mcp` (already in catalog) will benefit from this zero-touch provisioning.

---

## 2. MCP Spec RC — 35 Days to July 28

The 2026-07-28 specification RC is locked (since May 21, 2026); **final ships July 28, 2026
— 35 days from today**. The ten-week validation window for Tier-1 SDK maintainers is active.

### Confirmed breaking changes

| Change | Detail |
|---|---|
| Stateless protocol core | `initialize`/`initialized` handshake removed; `Mcp-Session-Id` dropped |
| New required headers | `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` |
| `_meta` on every request | Client metadata formerly exchanged once now travels per-request |
| Multi Round-Trip Requests | `InputRequiredResult` with `inputRequests` + `requestState` replaces SSE streams for server-to-client |
| MCP Apps extension | Server-rendered HTML UIs in sandboxed iframes (SEP-1865) |
| Tasks extension | Graduates from experimental to official extension; `tasks/get`, `tasks/update`, `tasks/cancel` lifecycle |
| Auth hardening (6 SEPs) | Clients must validate `iss`, declare `application_type`, bind credentials to specific auth servers |
| Deprecations | Roots, Sampling, Logging — 12-month removal window starts July 28 |

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP.directory explainer]](https://mcp.directory/blog/mcp-2026-07-28-release-candidate)
[[WorkOS auth changes]](https://workos.com/blog/mcp-2026-spec-agent-authentication)

### Catalog implication

No catalog schema change required. The registry stores endpoint metadata, not transport
session state — stateless servers are structurally compatible. The gateway operator must
update transport validation to route on `Mcp-Method`/`Mcp-Name` headers instead of sticky
session IDs before July 28.

---

## 3. Atlassian SSE Shutdown — June 30 (7 Days Away)

Atlassian's SSE endpoint (`https://mcp.atlassian.com/v1/sse`) shuts down **June 30, 2026
— 7 days from today**. All clients must use Streamable HTTP (`https://mcp.atlassian.com/v1/mcp`).

**Catalog status: No action needed.** `com.atlassian/mcp` was updated to
`https://mcp.atlassian.com/v1/mcp` on 2026-06-18 (commit `7b4c8bd` area). The endpoint in
our catalog is already Streamable HTTP. No audit pass required for this specific entry.

[[Atlassian community deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)
[[YouTube migration guide]](https://www.youtube.com/watch?v=RsoyrmlssfI)

This continues the industry-wide SSE→Streamable HTTP migration pattern (Asana V1 shut down
May 11). No other SSE-typed entries remain in our catalog.

---

## 4. Docker MCP Toolkit — June 2026 Update

Docker Desktop's June 2026 release added several relevant security and UX features to its
MCP Toolkit:

- **Warning banner for unverified community servers** — alerts when an MCP server "is
  community-provided and has not been verified by Docker." This directly parallels our
  `approved` vs. `discovered` distinction at the catalog layer.
- Profile template cards + onboarding tour in the Profiles tab.
- Fixed unnecessary network calls to `mcp.docker.com` on sign-in when MCP Toolkit was
  disabled.
- Security update for **CVE-2026-33990**.
- Catalog scale: 300+ verified container-based servers.

[[Docker Release Notes — June 2026]](https://releasebot.io/updates/docker)
[[Docker MCP Catalog docs]](https://docs.docker.com/ai/mcp-catalog-and-toolkit/)

### Landscape implication

Docker's unverified-server warning banner is a direct public acknowledgment that the
trust gap (community vs. verified) matters to end users — and that the market is beginning
to surface it in UI. This is a signal that the curation layer we provide has growing
end-user visibility. No ranking change; Docker remains #6 in the landscape.

---

## 5. AAIF MCP Dev Summit North America Recap (NYC, April 2–3)

The Agentic AI Foundation held **MCP Dev Summit North America** in New York City on April
2–3, 2026. Key developments:

- **~1,200 attendees** (double the previous summit), 95+ sessions.
- **Leadership change:** Jim Zemlin stepped down as interim Executive Director; replaced
  by **Mazin Gilbert** (PhD, AI background from Google, MBA Wharton).
- **Governance milestone:** Technical Steering Committee approved a formal **project lifecycle
  policy** (Growth / Impact / Emeritus stages) — opens the foundation to external projects
  joining for the first time.
- **Global 2026 events:** AgenCon + MCPCon Europe (Amsterdam, Sept 17–18); AgenCon +
  MCPCon North America (Oct 22–23). India summits (Bengaluru June 9–10, Mumbai June 14–15)
  complete.
- AAIF now 170+ member organizations — faster growth than CNCF at the same stage.

[[AAIF blog — Dev Summit NA]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)
[[Linux Foundation press]](https://www.linuxfoundation.org/press/agentic-ai-foundation-unveils-mcp-dev-summit-north-america-2026-schedule)
[[InfoQ AAIF summit]](https://www.infoq.com/news/2026/04/aaif-mcp-summit/)

---

## 6. Ecosystem Scale Update

| Source | Count | Notes |
|---|---|---|
| **Glama** | ~44,392 | Steady from June 22 batch indexing event (+5,868 in one day June 21–22); no new batch since |
| **PulseMCP** | 19,180–19,240+ | Up from ~18,570+ last noted; now showing 19,240+ on remote filter |
| **mcp.so** | ~20,222 | Unvetted community directory; no recent signal |
| **Official MCP Registry** | ~9,652 | Last known May 24; v0.1 API frozen |
| **Our catalog** | **19 approved / public** | Unchanged; trust gap = 65k+ indexed vs. 19 approved |

[[Glama]](https://glama.ai/mcp/servers)
[[PulseMCP]](https://www.pulsemcp.com/servers)

---

## 7. Pending Action — CVE-2026-25536 TypeScript SDK Audit

**CVE-2026-25536** (MCP TypeScript SDK cross-client data leak; CVSS 7.1) remains an open
action item from the June 17–18 research pass. Patched in SDK **1.26.0**.

Root cause: JSON-RPC message ID collisions in `StatelessStreamableHTTPServerTransport`
when a single `McpServer/Server` instance is reused across multiple client connections —
responses routed to the wrong client.

[[SentinelOne CVE detail]](https://www.sentinelone.com/vulnerability-database/cve-2026-25536/)
[[NVD]](https://nvd.nist.gov/vuln/detail/CVE-2026-25536)
[[Vulnerable MCP Project]](https://vulnerablemcp.info/vuln/cve-2026-25536-sdk-cross-client-data-leak.html)

**Catalog audit status:** Vendors likely to use the MCP TypeScript SDK in their backend
include `com.github/mcp`, `com.slack/mcp`, `com.notion/mcp`, `com.cloudflare/mcp`,
`com.linear/mcp`, `com.figma/mcp`, `com.sentry/mcp`, and `com.stripe/mcp`. All are
major vendors with active security teams; patch availability since mid-June means they are
expected to have updated, but this is unverified by us. **This audit pass remains scheduled
as next `subregistry-audit` action** — no catalog demotion pending, but `verifiedAt`
timestamps should be refreshed once confirmed.

---

## 8. Player Notes

### Obot — v0.14 MCP Registry Support

Obot released v0.14 adding **MCP Registry Support** — IT administrators can now define and
publish an approved catalog of connected MCP servers, controlling which servers users can
discover and install across VS Code and GitHub Copilot. This is the clearest external
implementation of the `approved catalog → downstream client` pattern we implement.

[[Obot blog]](https://obot.ai/blog/update-on-the-mcp-registry-project-new-chatgpt-support-for-mcp-and-what-it-means-for-enterprise-ai/)

### Runlayer — Morgan Stanley Rising in Cyber 2026

Runlayer confirmed on the Morgan Stanley Rising in Cyber 2026 list (150 CISO votes).
The catalog currently shows 18,000+ servers accessible; security-approved servers go through
fast-tracked approval. Landscape ranking unchanged (#11).

[[Runlayer]](https://www.runlayer.com/)
[[TrueFoundry MCP Registry comparison]](https://www.truefoundry.com/blog/best-mcp-registries)

### JFrog MCP Registry

No new June 2026 announcements. GA since March 18, 2026; integrated in JFrog AI Catalog.
Remains #2 in landscape.

[[JFrog GA announcement]](https://jfrog.com/blog/announcing-general-availability-of-the-jfrog-mcp-registry/)

### AWS Agent Registry

Remains in Preview (since April 9, 2026). No GA announcement found as of June 23.
AWS MCP Server (the managed remote endpoint, `com.aws/mcp` in our catalog) reached GA
in May 2026 — no change to catalog status.

[[AWS Agent Registry preview]](https://aws.amazon.com/about-aws/whats-new/2026/04/aws-agent-registry-in-agentcore-preview/)

### MACH Alliance MCP Registry

Vendor-neutral, enterprise-focused registry launched in 2026; composable commerce /
content / PIM focus. Open publishing; member-only governance/verification features;
API format aligned with official MCP Registry. No curation signal observed yet.

[[MACH Alliance MCP Registry]](https://machalliance.org/mach-alliance-mcp-registry)

### HubSpot MCP

**GA since April 13, 2026.** OAuth 2.1 + PKCE required; **no Dynamic Client Registration
(DCR)** — clients must use pre-registered `client_id` + secret. Community auth failures
documented in LibreChat and Kiro IDE for the no-DCR pattern. Endpoint: `https://mcp.hubspot.com/mcp`.
Remains on next `subregistry-curate` target (Comms & support group: HubSpot, Intercom, Zapier).

[[HubSpot changelog — GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)

---

## 9. Security Landscape — No New Critical Incidents

No new MCP-specific CVEs or major security incidents discovered since the June 22 report.
The threat landscape reported June 21–22 remains the active state:

- **Active npm threats:** IronWorm (Rust/eBPF, 50+ packages), Miasma new variant + Hades
  wave (57 packages, 286 versions, cross-platform: npm + Azure + PyPI). No new waves
  confirmed since June 17. Remote-HTTP-only catalog remains structurally immune.
- **CVE-2026-25536**: Patched; audit pending (see §7 above).
- **SEP-2127 (Server Cards):** WG term ends Aug 14, 2026. Claude Desktop + Cursor already
  shipping `/.well-known/mcp/server-card.json` support. No spec merge yet.

[[Adversa AI June 2026 security resources]](https://adversa.ai/blog/top-mcp-security-resources-june-2026/)
[[IronWorm analysis]](https://phoenix.security/ironworm-npm-supply-chain-worm-rust-ebpf-rootkit-tor/)
[[Miasma npm worm]](https://www.upwind.io/feed/miasma-npm-supply-chain-worm-redhat-credential-harvest)

---

## 10. Catalog Status — All 19 Entries Approved / Public

No catalog demotions warranted. Summary of action items:

| Item | Status | Next step |
|---|---|---|
| Atlassian SSE shutdown June 30 | ✅ Catalog already on v1/mcp Streamable HTTP | No action |
| CVE-2026-25536 TypeScript SDK audit | ⏳ Open | Next `subregistry-audit` pass |
| HubSpot curate entry | ⏳ Scheduled | Next `subregistry-curate` (Comms group) |
| SEP-2127 Server Cards | ⏳ Watching | Extend audit when WG merges (Aug 14 WG deadline) |
| EMA connectors (Canva, Granola) | ℹ️ Monitor | Not yet candidates for catalog; no public MCP endpoints confirmed |

---

*Research methodology: WebSearch + WebFetch across official MCP blog, security trackers
(SentinelOne, NVD, The Hacker News, The Vulnerable MCP Project), player sites (Glama,
PulseMCP, Obot, Runlayer, JFrog, Docker, Atlassian), and governance sources (AAIF, Linux
Foundation). All claims cited above. Today's date confirmed as 2026-06-23.*

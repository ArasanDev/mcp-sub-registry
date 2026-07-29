# MCP Ecosystem Update — 2026-07-29

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-28 EOD → 2026-07-29
**Prior report:** [2026-07-28-mcp-ecosystem-update.md](./2026-07-28-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **MCP spec 2026-07-28 confirmed shipped** — The official release post is live at
  `blog.modelcontextprotocol.io/posts/2026-07-28/`. All four Tier 1 SDKs (TypeScript, Python,
  Go, C#) plus a Rust beta shipped alongside the spec. This is the day-after status check.
  [[Official post]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- **TypeScript SDK v2 package split confirmed** — The monolithic `@modelcontextprotocol/sdk`
  is retired in v2; replaced by `@modelcontextprotocol/server` + `@modelcontextprotocol/client`
  plus thin adapters (Node.js, Express, Hono, Fastify). Package size cut ~83%, 25% faster. v1.x
  continues to receive security patches for ≥6 months.
  [[TS SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)
  [[npm: @modelcontextprotocol/client]](https://www.npmjs.com/package/@modelcontextprotocol/client)
- **Global MCP Release Party events** — Coordinated spec-release celebrations: San Francisco
  (July 28) and Amsterdam (July 29 at AI House) confirmed; additional cities expected.
  [[Amsterdam event]](https://meet.modelcontextprotocol.io/2026/07/mcp-release-party-amsterdam-TarfhhI6FJwc)
  [[SF event]](https://meet.modelcontextprotocol.io/2026/07/mcp-release-party-san-francisco-APTxeKCMo22L)
- **Registry scale** — Glama: 62,310+ (up from 61,399 July 28); PulseMCP: 22,260+;
  MCPToplist cross-registry aggregate: 81,852 (up from 76,803 July 17). Trust gap: ~82k
  indexed vs. 19 approved.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **Security: Day 31+ clean window** — No new CVEs affecting our 19 cataloged servers
  post-July-28. All 19 remain approved/public.
- **SEP-2127 WG: 16 days to close** — The MCP Server Cards working group term ends Aug 14.
  Path is `/.well-known/mcp.json`. Once merged, `subregistry-audit` can begin polling cataloged
  endpoints for server card compliance.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 2. Spec 2026-07-28 — Post-Release Confirmation

The official blog post at `blog.modelcontextprotocol.io/posts/2026-07-28/` is live, confirming
the specification published as scheduled. This is the largest revision since MCP launch.

[[Official release post]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
[[AAIF migration guide]](https://aaif.io/blog/mcp-2026-07-28-whats-changing-and-how-to-migrate)
[[WorkOS enterprise breakdown]](https://workos.com/blog/mcp-2026-spec-agent-authentication)
[[The Register pre-release coverage]](https://www.theregister.com/devops/2026/07/23/model-context-protocol-prepares-to-break-with-its-stateful-past/5276722)

### Confirmed changes (no additions post-RC lock May 21)

| Area | Change |
|---|---|
| **Sessions** | `Mcp-Session-Id` removed; `initialize`/`initialized` handshake removed |
| **Headers** | `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` mandatory |
| **MRTR** | Multi Round-Trip Requests enable server→client mid-call interactions without open streams |
| **Caching** | `ttlMs` / `cacheScope` on tool/prompt/resource lists |
| **Authorization** | OAuth 2.1 resource-server model; RFC 9207 issuer validation; CIMD replaces DCR |
| **Extensions** | Tasks (first official extension); MCP Apps (sandboxed server iframe UIs) |
| **Schemas** | Tool I/O upgraded from JSON Schema subset → full JSON Schema 2020-12 |
| **Deprecated** | Roots, Sampling, Logging — 12-month removal window starts today |

### SDK v2 final state

| SDK | v2 Package | Status |
|---|---|---|
| TypeScript | `@modelcontextprotocol/server` + `@modelcontextprotocol/client` | Stable (July 28) |
| Python | `mcp==2.0.0` | Stable (July 27) |
| Go | `v1.7.0` stable | Stable (July 28) |
| C# | `v2.0.0` stable | Stable (July 28) |
| Rust | `v2.0.0-beta` | Beta |

**Critical migration note:** `pip install mcp` now resolves to v2.x. Any vendor still on
`mcp>=1.27` without `<2` upper bound will auto-upgrade and may break. Vendors on TypeScript v1
(`@modelcontextprotocol/sdk`) should plan migration; v1.x receives security patches for ≥6 months.

### Catalog implications

The spec final ships no new breaking schema requirements for our catalog. Our existing
`verification.notes` can capture protocol version; no migration needed until after the
deprecation window (Roots/Sampling/Logging, ~July 2027). The upcoming
`subregistry-audit` pass should verify whether our TypeScript SDK-based catalog vendors have
migrated to v2 or are safely pinned on v1.29.0+ (clears CVE-2026-25536).

---

## 3. Post-Release Ecosystem Reaction

Industry commentary is coalescing around a single theme: MCP earned enterprise adoption by
deleting complexity rather than adding features. The stateless core resolves the primary
operational barrier (stateful session management at scale).

Key signals:
- **AAIF**: Published a "MCP Graduates to Enterprise Infrastructure" post timed to the
  release. Enterprise statistics: 97M monthly SDK downloads, 78% of enterprise AI teams have
  MCP-backed agents in production, 41% in production per Stacklok survey.
  [[AAIF enterprise infrastructure blog]](https://aaif.io/blog/mcp-graduates-to-enterprise-infrastructure-stateless-architecture-formal-governance-and-security)
- **Vendor adoption timeline**: The 12-month deprecation window signals maintainers expect
  real migration to be concentrated in H2 2026. Vendors reverse-engineering tool names from
  request bodies (a hack used pre-July 28 because gateway routing required it) can now use
  the standard `Mcp-Method`/`Mcp-Name` headers.
  [[CData enterprise breakdown]](https://www.cdata.com/blog/mcp-2026-07-28-release)
  [[Stacktree spec changes]](https://stacktr.ee/blog/mcp-2026-spec-changes)
- **MCP Release Parties**: Global community events in San Francisco (July 28) and Amsterdam
  (July 29, AI House) are the first confirmed global coordinated MCP release celebrations,
  indicating an active, internationally distributed builder community.
  [[Amsterdam event]](https://meet.modelcontextprotocol.io/2026/07/mcp-release-party-amsterdam-TarfhhI6FJwc)

---

## 4. Registry Scale Update

| Registry | Count (July 29) | Change vs. July 28 |
|---|---|---|
| Glama | 62,310+ | +911 (from 61,399) |
| PulseMCP | 22,260+ | +20 (from 22,240+) |
| MCPToplist (cross-registry) | 81,852 | +5,049 (from 76,803 July 17) |
| Our catalog | 19 approved/public | — |

The Glama jump (+911 in one day) continues the batch-indexing pattern observed in prior
daily reports (the +7,731 jump seen over the July 11→28 window). The MCPToplist +5,049
reflects aggregation across the window since July 17, not a single-day jump.

The trust gap is now ~81,833 indexed vs. 19 curated-and-approved. This quantifies the value
of the sub-registry's curation layer: 0.02% of the discoverable ecosystem is vetted.

---

## 5. Security — Clean Window Continues

**Day 31+ clean window**: No new CVEs or incidents targeting cataloged servers discovered in
the July 28–29 window.

The post-release period introduces new potential attack surfaces from the spec itself:
- **MCP Apps iframes**: New extension that embeds server-provided HTML in sandboxed iframes;
  client implementations must enforce CSP strictly. Not a catalog-side risk.
- **CIMD replacing DCR**: Client ID Metadata Documents change OAuth client registration flow;
  catalog vendors using OAuth 2.1 (Atlassian, GitHub, Slack, Stripe, etc.) need to verify
  they ship with CIMD-compliant implementations.
- **`Mcp-Method`/`Mcp-Name` header exposure**: These headers enable gateway routing but can
  leak method/tool names into proxy/CDN logs. Our catalog stores no routing policy or secrets —
  structurally immune.

The "30 CVEs in 60 days" framing seen in search results (from Jan–Feb 2026 analysis) is
historical background; no new batch of that magnitude has been disclosed July 28–29.
[[Elegant Software Solutions: MCP Security After 30 CVEs]](https://www.elegantsoftwaresolutions.com/blog/mcp-security-after-30-new-cves)
[[PolicyLayer MCP Incidents Tracker]](https://policylayer.com/mcp-incidents)

**Audit pending**: The CVE-2026-25536 TypeScript SDK audit pass (verify all TS SDK-based
catalog vendors are on >=v1.26.0, or now v2.0.0) has not been completed. With SDK v2 now
stable, any vendor that migrated to v2 auto-clears this gate; those still on v1.x need
verification. This is Next Action #3 in CLAUDE.md §13.

---

## 6. SEP-2127 Server Cards — 16 Days to WG Close

The MCP Server Cards Working Group term ends August 14, 2026 (16 days). The canonical path is
`/.well-known/mcp.json`. A Go implementation library is available
(`olgasafonova/mcp-servercard-go`), and an online validator is live at `agent-ready.dev`.
Claude Desktop and Cursor already ship support.

Once the WG closes (or the SEP merges to the main spec), the `subregistry-audit` skill can
add a step to GET `/.well-known/mcp.json` on each cataloged server and record tool count +
protocol version in `verification.notes`. No schema migration needed (notes field is free-text).

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[Agent Ready validator]](https://agent-ready.dev/mcp-card-validator)
[[How to publish mcp.json]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)

---

## 7. Upcoming Events Calendar

| Date | Event | Location |
|---|---|---|
| **July 29** | MCP Release Party | Amsterdam, AI House |
| **Aug 6** | AWS Agent Registry namespace migration | (virtual) bedrock-agentcore → agent-registry |
| **Aug 13–14** | AAIF MCPCon Seoul | Seoul |
| **Aug 14** | SEP-2127 WG term ends | (virtual) |
| **Sept 6–7** | MCPCon Shanghai (KubeCon co-located) | Shanghai International Convention Center |
| **Sept 10–11** | AAIF MCPCon Tokyo | Tokyo |
| **Sept 17–18** | AAIF MCPCon Europe | Amsterdam |
| **Oct 5–6** | AAIF MCPCon Toronto | Toronto |
| **Oct 22–23** | AAIF MCPCon North America | San Jose, CA |
| **Nov 19–20** | AAIF MCPCon Nairobi | Nairobi |

[[AAIF global events]](https://www.prnewswire.com/news-releases/agentic-ai-foundation-announces-global-2026-events-program-anchored-by-agntcon-mcpcon-north-america-and-europe-302732860.html)

---

## 8. Catalog Hooks — No Demotion Actions Required

All 19 catalog servers remain approved/public. No endpoint failures, ownership changes, or
security incidents affect the catalog.

**Actions flagged for next skill runs (unchanged from prior report):**

| Priority | Action | Skill |
|---|---|---|
| 1 | Add HubSpot (`mcp.hubspot.com`, GA April 13, OAuth 2.1 + PKCE) | `subregistry-curate` |
| 2 | TypeScript SDK audit — verify all TS SDK vendors on v2 or >=v1.26.0 | `subregistry-audit` |
| 3 | AWS Agent Registry namespace migration (Aug 6); confirm `com.aws/mcp` unaffected | monitor |
| 4 | SEP-2127: after WG closes (Aug 14), poll `/.well-known/mcp.json` on all 19 servers | `subregistry-audit` |
| 5 | CIMD compliance: confirm OAuth vendors updated from DCR to CIMD per new spec | `subregistry-audit` |

---

## 9. Summary for Operators

1. **Spec is final.** The 12-month deprecation clock for Roots/Sampling/Logging started July 28.
   No catalog schema change required; monitor vendor migration over H2 2026.
2. **SDK v2 is the new default.** TypeScript: use `@modelcontextprotocol/server` /
   `@modelcontextprotocol/client`. Python: `pip install mcp` now installs v2.x — pin `<2`
   if staying on v1 for now. v1 gets security patches for ≥6 months.
3. **Next curate run: HubSpot.** Endpoint confirmed, OAuth model confirmed, one-click Claude
   connector live. No blockers.
4. **Next audit: TypeScript SDK v2 migration verification** — with v2 stable today, the
   CVE-2026-25536 audit gate can now be assessed cleanly.

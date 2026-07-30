# MCP Ecosystem Update — 2026-07-30

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-29 EOD → 2026-07-30
**Prior report:** [2026-07-29-mcp-ecosystem-update.md](./2026-07-29-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **SDK download milestone confirmed** — The official MCP spec release blog reports "close to
  half-a-billion downloads a month" across Tier 1 SDKs; both the TypeScript and Python SDKs
  have individually surpassed 1 billion total downloads. Anthropic separately cites 400M+
  monthly SDK downloads (4× YoY).
  [[Official MCP release blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
  [[36kr/Anthropic coverage]](https://eu.36kr.com/en/p/3916379879861638)
- **Day-zero vendor roll-call** — The spec launch post carried endorsements from: **AWS,
  Cloudflare, Figma, Google Cloud, Microsoft, Netlify, PostHog, Stripe, Supabase, Xero** and
  others. Several of these are live catalog entries; all confirmed day-zero 2026-07-28 support.
  [[Official MCP release blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- **CVE-2026-40576** — New path traversal in `excel-mcp-server` (community STDIO package);
  arbitrary file read/write/overwrite on host; fixed in v0.1.8. Not in our catalog; remote-HTTP
  catalog structurally immune.
  [[SentinelOne]](https://www.sentinelone.com/vulnerability-database/cve-2026-40576/)
- **Cloudflare Agents SDK v0.20.0** — Day-zero 2026-07-28 support published July 27; stateless
  Workers MCP servers with `server/discover`, elicitation, and backward-compat legacy initialize.
  [[Cloudflare changelog]](https://developers.cloudflare.com/changelog/post/2026-07-27-agents-sdk-v0.20.0-mcp-sdk-v2/)
- **CIMD adoption ecosystem growing** — At least five auth/identity vendors (WorkOS, Datawiza,
  Scalekit, Descope, Stytch) published CIMD implementation guides post-spec. FastMCP has an open
  issue for CIMD support. DCR now formally deprecated.
  [[WorkOS CIMD guide]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp)
- **Registry scale** — Glama: ~63,926 (search page title; up from 62,310+ on July 29; +1,616);
  MCPToplist: 81,852 (steady; July 28 baseline). Trust gap: ~82k indexed vs. 19 approved.
  [[Glama]](https://glama.ai/mcp/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **Security: Day 33 clean window** — No new CVEs affecting our 19 cataloged servers.
  CVE-2026-40576 is community/STDIO only; all 19 catalog entries remain approved/public.
- **SEP-2127 WG: 15 days to close** — Working group term ends Aug 14. Path `/.well-known/mcp.json`
  confirmed.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 2. Spec 2026-07-28 — Day-2 Adoption Signals

### SDK downloads milestone

The official MCP release blog reports that the Tier 1 SDKs collectively reached "close to
half-a-billion downloads a month," with both the TypeScript and Python SDKs individually
crossing the **1 billion total downloads** threshold. Anthropic's parallel announcement cites
400M+ monthly SDK downloads, a 4× YoY increase. These two figures likely reflect different
measurement windows; both are orders of magnitude above the 97M cited in the June AAIF
blog. The scale of adoption makes the migration window design choice (12-month deprecation
for Roots/Sampling/Logging) a practical necessity, not a courtesy.

[[MCP release blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
[[36kr Anthropic coverage]](https://eu.36kr.com/en/p/3916379879861638)

### `server/discover` RPC (SEP-2575)

The new stateless discovery method replaces the `initialize` handshake. Every 2026-07-28
server implements `server/discover`; a client calls it before anything else to learn supported
protocol versions and capabilities. Protocol version, client info, and capabilities now travel
in a `_meta` field on every request, enabling stateless routing. This also means a v2 client
can auto-detect legacy servers: if `server/discover` is absent, it falls back to the v1
`initialize` handshake — making the transition non-breaking for clients.

[[MCP release blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
[[Cloudflare stateless explainer]](https://community.cloudflare.com/t/agents-workers-cloudflare-mcp-servers-support-the-new-mcp-2026-07-28-specification/943720)

### Day-zero support list

| Vendor | Catalog entry? | Notes |
|---|---|---|
| AWS | `com.aws/mcp`, `com.aws/mcp-knowledge` | AgentCore Gateway day-zero [[AWS blog]](https://aws.amazon.com/blogs/machine-learning/how-agentcore-gateway-supports-the-mcp-2026-07-28-spec/) |
| Cloudflare | — | Agents SDK v0.20.0; Workers MCP servers stateless-native |
| Figma | — | Catalog candidate (not yet curated) |
| Google Cloud | — | Watch list |
| Microsoft | — | MS MCP Server for Enterprise (Preview) on watch list |
| Netlify | — | Not cataloged |
| PostHog | — | Not cataloged |
| Stripe | `com.stripe/mcp` | In catalog; day-zero signal is positive verification |
| Supabase | `com.supabase/mcp` | In catalog; day-zero signal is positive verification |
| Xero | — | Not cataloged |

**Catalog implication**: Stripe and Supabase confirming day-zero 2026-07-28 support is a
positive trust signal. Their `verifiedAt` timestamps will need updating in the next
`subregistry-audit` pass to reflect confirmed spec-compliance.

### AWS AgentCore Gateway 2026-07-28 support

AWS published a detailed post on how AgentCore Gateway supports the new spec. AgentCore
contributes the Tasks extension — one of the two official spec extensions that shipped with
the 2026-07-28 release. This keeps the AWS gateway-to-catalog chain coherent.

[[AWS blog: AgentCore Gateway MCP 2026-07-28]](https://aws.amazon.com/blogs/machine-learning/how-agentcore-gateway-supports-the-mcp-2026-07-28-spec/)

### Migration codemod available

A codemod for the TypeScript v1 → v2 mechanical migration is published:

```
npx @modelcontextprotocol/codemod@beta v1-to-v2
```

Full migration guide at `ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28`.
v1.x (`@modelcontextprotocol/sdk`) receives security patches for ≥6 months from July 28.
The CVE-2026-25536 audit gate (verify vendors on ≥v1.26.0) remains open — any vendor that
migrated to v2 auto-clears it; v1.x vendors need explicit verification.

[[TS SDK v2 migration guide]](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28)

---

## 3. Cloudflare Agents SDK v0.20.0 — Stateless Workers MCP

Cloudflare published Agents SDK v0.20.0 on July 27, shipping day-zero support for the
2026-07-28 spec. Key changes:

- **Stateless by default**: Each request runs on a fresh server, no MCP protocol session or
  Durable Object for session state. Runs behind a plain round-robin load balancer.
- **`server/discover` exposed**: Cloudflare's implementation exposes the discovery endpoint,
  enabling clients to probe protocol version before connecting.
- **Elicitation support**: New extension for server→client mid-call confirmation flows (maps
  to the spec's Multi Round-Trip Request / MRTR feature).
- **Backward compatibility**: The v0.20.0 SDK answers the legacy `initialize` handshake as well
  as `server/discover`, so v1 clients continue to connect seamlessly.
- **Customers benefiting immediately**: Sentry, Linear, and others named as day-zero adopters
  on Cloudflare infrastructure.

[[Cloudflare Agents SDK v0.20.0 changelog]](https://developers.cloudflare.com/changelog/post/2026-07-27-agents-sdk-v0.20.0-mcp-sdk-v2/)
[[Cloudflare MCP servers 2026-07-28 support]](https://developers.cloudflare.com/changelog/post/2026-07-28-cloudflare-mcp-servers-mcp-2026-07-28/)
[[Cloudflare community announcement]](https://community.cloudflare.com/t/agents-workers-agents-sdk-adds-mcp-specification-2026-07-28-support/943386)

---

## 4. Security — CVE-2026-40576 (Excel MCP Server, Path Traversal)

**CVE-2026-40576** was published July 2026 against `excel-mcp-server` (PyPI), a community
MCP server for Excel file manipulation.

| Field | Value |
|---|---|
| **CWE** | CWE-22 (Path Traversal) |
| **Affected versions** | `excel-mcp-server` ≤ 0.1.7 |
| **Fixed in** | v0.1.8 |
| **Transport scope** | SSE or Streamable-HTTP modes only (default stdio unaffected) |
| **Impact** | Unauthenticated attacker can read, write, overwrite arbitrary host filesystem files via crafted filepath in any of 25 MCP tool handlers |

Root cause: `get_excel_path()` fails to enforce filesystem boundaries — absolute paths pass
through unchecked; relative paths are joined without resolving or validating the result.

**Catalog impact: None.** This is a community STDIO/local-filesystem tool; it is not in our
catalog. Our remote-HTTP-only catalog is structurally immune to host-filesystem attacks via
path traversal in local server processes.

This CVE contributes to the running count (40+ CVEs in 2026) tracked by the Vulnerable MCP
Project. The community STDIO/PyPI package surface area remains the primary attack surface.

[[SentinelOne CVE entry]](https://www.sentinelone.com/vulnerability-database/cve-2026-40576/)
[[GitLab advisory]](https://advisories.gitlab.com/pypi/excel-mcp-server/CVE-2026-40576/)
[[MCP CVE project]](https://github.com/mcp-security-project/mcp-cve-project)
[[Vulnerable MCP Project]](https://vulnerablemcp.info/)

---

## 5. CIMD Adoption Ecosystem

Dynamic Client Registration (DCR) is now formally deprecated by the 2026-07-28 spec in favour
of Client ID Metadata Documents (CIMD). The auth/identity ecosystem has moved quickly:

| Vendor | Coverage |
|---|---|
| **WorkOS** | Full guide: CIMD mechanism + MCP OAuth flow [[link]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp) |
| **Datawiza** | MCP auth explainer including CIMD/DCR comparison [[link]](https://www.datawiza.com/blog/mcp-authentication-explained) |
| **Scalekit** | CIMD deep-dive: how OAuth client registration works without a registry [[link]](https://www.scalekit.com/blog/what-is-cimd) |
| **Descope** | CIMD reference: identity-without-pre-registration pattern [[link]](https://www.descope.com/learn/post/cimd) |
| **Stytch** | Building MCP with OAuth CIMD — implementation walkthrough [[link]](https://stytch.com/blog/oauth-client-id-metadata-mcp/) |
| **FastMCP** | Open issue: CIMD (SEP-991) support requested [[link]](https://github.com/PrefectHQ/fastmcp/issues/2863) |

**How CIMD works**: The OAuth client's URL becomes its `client_id`; that URL hosts a JSON
metadata document. The authorization server fetches and validates the document in real time
— no registration record created, no DCR endpoint needed.

**Catalog audit implication**: OAuth-gated catalog vendors (Atlassian, GitHub, Slack, Stripe,
Supabase, Linear, Asana, Sentry, and others) should be verified in the next `subregistry-audit`
pass to confirm their implementations use CIMD, not DCR. DCR will be removed from the spec in
a future version.

[[CIMD client.dev reference]](https://client.dev/)
[[Medium: CIMD explainer]](https://medium.com/@dipakkrdas/client-id-metadata-documents-cimd-identity-without-pre-registration-6264192f8b68)

---

## 6. Registry Scale Update

| Registry | Count (July 30) | Change vs. July 29 |
|---|---|---|
| Glama | ~63,926 | +1,616 (from 62,310+) |
| PulseMCP | 22,260+ | Unchanged (last update July 29) |
| MCPToplist (cross-registry) | 81,852 | Steady (July 28 baseline) |
| Our catalog | 19 approved/public | — |

The Glama jump (+1,616 in one day) continues the batch-indexing pattern. The MCPToplist is
a daily snapshot; expect an update when indexers run post-release.

The trust gap: ~81,833 indexed vs. 19 curated-and-approved (0.023% of the discoverable
ecosystem is vetted through our catalog).

[[Glama]](https://glama.ai/mcp/servers)
[[MCPToplist]](https://mcptoplist.com/)

---

## 7. Security — Day 33 Clean Window

No new CVEs or incidents targeting our 19 cataloged servers on July 30. Security context:

- **CVE-2026-40576** (Excel MCP Server, §4 above): community STDIO only. No catalog action.
- **Microsoft July 2026 Patch Tuesday**: Fixed 570 flaws, 3 zero-days. MCP-adjacent but no
  MCP-specific CVE in the Patch Tuesday batch.
  [[BleepingComputer]](https://www.bleepingcomputer.com/news/microsoft/microsoft-july-2026-patch-tuesday-fixes-massive-570-flaws-3-zero-days/)
- **Microsoft "State of MCP Security in 2026"** (published June 26): comprehensive security
  checkpoint post on Microsoft Community Hub, co-authored by JiteshThakur and ShalabhPradhan.
  Useful reference for operators.
  [[Microsoft Community Hub]](https://techcommunity.microsoft.com/blog/microsoft-security-blog/the-state-of-mcp-security-in-2026/4531327)
- **MCP security CVE count (2026 YTD)**: DEV Community article tracks 40+ CVEs in 2026;
  predominantly community STDIO packages. Remote-HTTP-only catalog remains structurally immune.
  [[DEV: 40+ CVEs and counting]](https://dev.to/piiiico/mcp-security-vulnerabilities-in-2026-40-cves-and-counting-4pco)

**Pending audit (unchanged)**: CVE-2026-25536 TypeScript SDK data leak (patched in v1.26.0;
auto-cleared on v2). Verify all TypeScript-SDK-based catalog vendors are on v2 or ≥v1.26.0.
Day-zero support announcement by Stripe and Supabase is a positive signal but not a
verification — the audit pass should confirm running versions.

---

## 8. Upcoming Events / Deadlines

| Date | Event | Status |
|---|---|---|
| **Aug 6** | AWS Agent Registry namespace: bedrock-agentcore → agent-registry | **7 days**; `com.aws/mcp` unaffected |
| **Aug 13–14** | AAIF MCPCon Seoul | Confirmed |
| **Aug 14** | SEP-2127 WG term ends | **15 days**; path `/.well-known/mcp.json` |
| **Sept 6–7** | MCPCon Shanghai (KubeCon China co-located) | Confirmed; 40+ sessions, 1,500+ attendees |
| **Sept 10–11** | AAIF MCPCon Tokyo | Confirmed |
| **Sept 17–18** | AAIF MCPCon Europe (Amsterdam) | Confirmed |
| **Oct 5–6** | AAIF MCPCon Toronto | Confirmed |
| **Oct 22–23** | AAIF MCPCon North America (San Jose, CA) | Confirmed |
| **Nov 19–20** | AAIF MCPCon Nairobi | Confirmed |
| **~July 2027** | Roots/Sampling/Logging removal deadline | 12-month deprecation window started July 28 |

---

## 9. Catalog Hooks — No Demotion Actions Required

All 19 catalog servers remain approved/public. No endpoint failures, ownership changes, or
security incidents require catalog action.

**Actions flagged for next skill runs (updated from prior report):**

| Priority | Action | Skill | Notes |
|---|---|---|---|
| 1 | Add HubSpot (`mcp.hubspot.com`, GA April 13, OAuth 2.1 + PKCE) | `subregistry-curate` | No blockers; confirmed ready |
| 2 | TypeScript SDK audit — verify TS SDK vendors on v2 or ≥v1.26.0; verify CIMD vs DCR | `subregistry-audit` | Stripe + Supabase confirmed day-zero 2026-07-28; still need version verification |
| 3 | AWS Agent Registry namespace migration (Aug 6): confirm `com.aws/mcp` endpoint unaffected | monitor | 7 days away |
| 4 | SEP-2127: after WG closes (Aug 14), poll `/.well-known/mcp.json` on all 19 servers | `subregistry-audit` | 15 days to WG close |
| 5 | CIMD compliance: confirm OAuth catalog vendors using CIMD not DCR per new spec | `subregistry-audit` | Fold into priority-2 audit pass |

---

## 10. Summary for Operators

1. **SDK scale confirms adoption is real.** Half-a-billion monthly downloads; TypeScript + Python
   each crossing 1 billion total. The migration pressure on vendors is high — expect rapid v2
   adoption in H2 2026.
2. **Day-zero support from Stripe and Supabase** (both in catalog) is a positive signal. Fold
   2026-07-28 spec compliance verification into the next `subregistry-audit` pass.
3. **CVE-2026-40576** is not a catalog concern. Community STDIO only. Remote-HTTP catalog immune.
4. **CIMD is the new OAuth registration standard.** Verify OAuth catalog vendors are not still
   running DCR-only implementations. DCR is deprecated; removal in a future spec version.
5. **15 days until SEP-2127 WG closes.** After Aug 14, begin polling `/.well-known/mcp.json`
   on cataloged servers for tool count and protocol version compliance.
6. **Next curate run: HubSpot** (`mcp.hubspot.com`). OAuth 2.1 + PKCE confirmed, GA April 13,
   one-click Claude connector live. No blockers remain.

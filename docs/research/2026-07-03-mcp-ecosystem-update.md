# MCP Ecosystem Update — 2026-07-03

Daily research pass. Covers developments since the July 2 report
([2026-07-02-mcp-ecosystem-update.md](./2026-07-02-mcp-ecosystem-update.md)).
Focus: SDK v2 betas confirmed live across all four Tier 1 SDKs (June 29);
Microsoft MCP Server for Enterprise (Preview) — natural-language Entra ID access;
Stacklok ToolHive emerges as the most concrete MCP provenance-verification
implementation; SEP-2127 Server Card compliance scanner live ("Is Your MCP Ready?");
HubSpot new content-analytics and landing-page capabilities confirm curate priority;
clean security window extends to Day 5.

All external claims cited with source URLs.

---

## 1. SDK v2 Betas Now Live — All Four Tier 1 SDKs (June 29, 2026)

The official MCP blog confirmed on **June 29, 2026** that beta SDKs for all four Tier 1
languages are now available, implementing the 2026-07-28 specification end-to-end.

[[Beta SDKs for the 2026-07-28 MCP Spec Release Candidate — MCP Blog (June 29)]](https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/)

### Versions released

| SDK | Beta version | Notes |
|-----|-------------|-------|
| Python | `mcp==2.0.0b1` | Restructures around `MCPServer` (replaces `FastMCP`); install via `"mcp[cli]==2.0.0b1"` |
| TypeScript | New package names (see below) | Monolithic `@modelcontextprotocol/sdk` retired |
| Go | `v1.7.0-pre.1` | Stateless mode via HTTP transport config; no API overhaul |
| C# | `v2.0.0-preview.1` | Deprecated spec features marked `[Obsolete]` |

### TypeScript v2 — breaking restructure

TypeScript v2 retires the monolithic `@modelcontextprotocol/sdk` in favor of focused
packages:

- **`@modelcontextprotocol/server`** — server-side implementation
- **`@modelcontextprotocol/client`** — client-side implementation
- Thin adapters for Node.js, Express, Hono, and Fastify

Key constraints: **ESM-only**; requires Node.js 20+, Bun, or Deno. A codemod assists
migration from v1.x. Standard Schema replaces the previous tool-definition pattern.

[[TypeScript v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)

### Python v2 stable target: July 27

Python v2.0.0 stable targets **July 27, 2026** — one day before the spec final.
Vendors using the Python SDK should pin `mcp>=1.27,<2` in production until they
validate against the v2 beta.

[[Python SDK releases]](https://github.com/modelcontextprotocol/python-sdk/releases)

### All betas implement

- Stateless protocol core (no initialize handshake; no `Mcp-Session-Id`)
- Multi Round-Trip Requests (MRTR)
- Routable transport headers (`Mcp-Method`, `Mcp-Name`)
- Authorization hardening (OAuth 2.1 resource-server model, Resource Indicators)

**Catalog relevance:** No catalog schema change required. TypeScript v2's new package
structure means any audit of TypeScript-SDK-based vendors (CVE-2026-25536 pending audit,
section 13 Next actions #3b) must check for the new package names once those vendors migrate.
CVE-2026-25536 and CVE-2026-0621 are patched in v1.26.0; v1 SDK keeps receiving
security updates for at least 6 months after v2 ships, so the existing patch threshold
(>=1.26.0) remains valid until vendors migrate.

---

## 2. Microsoft MCP Server for Enterprise — Preview (June/July 2026)

Microsoft launched a **Microsoft MCP Server for Enterprise (Preview)** — a
hosted, read-only MCP server that lets AI agents query Microsoft Entra identity data
using natural language over the MCP protocol.

[[Microsoft MCP Server for Enterprise — Microsoft Learn]](https://learn.microsoft.com/en-us/graph/mcp-server/overview)
[[AdminDroid: New Microsoft MCP Server for Enterprise]](https://blog.admindroid.com/microsoft-mcp-server-for-enterprise/)

### Scope

Current preview covers **read-only** Entra ID scenarios:
users, groups, applications, devices, and administrative reporting.
Built on Microsoft Graph. Requires appropriate Microsoft 365 / E7 license tier;
organizations must have agent security capabilities licensed to access without disruption
(July 2026 license transition). Integrates with Entra ID SSO via natural language queries.

### Catalog relevance

This is a **Microsoft-operated remote MCP server**, but its scope is identity directory
read access — useful for enterprise operators but a domain-specific tool, not a
general-purpose server suitable for our curated catalog at this stage. It is in Preview
with no public endpoint documented for external use. Add to watch list: if Microsoft
publishes a stable, publicly accessible endpoint with documented auth, consider curating
for enterprise-identity use-case persona bundle.

[[Solo.io: Enterprise MCP SSO with Microsoft Entra]](https://www.solo.io/blog/enterprise-mcp-sso-with-microsoft-entra-and-agentgateway)

---

## 3. Stacklok ToolHive — Sigstore Provenance for MCP Servers

**Stacklok ToolHive** is an enterprise-grade, Apache 2.0-licensed platform for running
and managing MCP servers. Its distinctive contribution: **cryptographic provenance
verification** via Sigstore and GitHub Attestations before any MCP server is deployed.

[[Stacklok: From Unknown to Verified — Solving the MCP Server Trust Problem]](https://stacklok.com/blog/from-unknown-to-verified-solving-the-mcp-server-trust-problem/)
[[ToolHive GitHub]](https://github.com/stacklok/toolhive)

### Verification approach

When deploying an MCP server from the ToolHive registry, ToolHive:

1. Extracts the container image's cryptographic fingerprint
2. Searches Sigstore's transparency log for signatures and attestations
3. Verifies signatures against trusted CAs (public Sigstore infra for public repos;
   GitHub's Sigstore instance for private repos)
4. Validates build provenance — source code, workflow, timestamp, build host

GitHub Attestations provide a chain from source commit -> CI run -> container image.
This is the most concrete implementation of the NSA's mandate for
**signed provenance checks for dynamic server discovery** in production MCP deployments.

### Registry model

ToolHive maintains its own registry of verified MCP servers that have passed this
provenance check. Model: discover -> verify cryptographic provenance -> run in isolation.

### Relevance to our catalog

ToolHive's approach validates the direction sketched in section 13 roadmap item #5
(`provenance.attestation_url` + `provenance.signing_method` fields). It also provides
a practical precedent: once Sigstore-signed MCP artifacts become common across our
cataloged vendors, `subregistry-audit` can verify build provenance as part of the
re-verification pass. Add Stacklok ToolHive to the landscape watch list.

[[Stacklok Docs]](https://docs.stacklok.com/toolhive/)
[[NSA MCP Security Guidance (May 20, 2026)]](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf)

---

## 4. SEP-2127 Server Cards — "Is Your MCP Ready?" Compliance Scanner

The SEP-2127 Working Group (WG term ends **August 14, 2026**) is actively tracking
server-card adoption in the field. A new community scanner, **"Is Your MCP Ready?"**
(isyourmcpready.com), probes `/.well-known/mcp/server-card.json` on cataloged servers
and reports compliance status.

[[Is Your MCP Ready? (scanner)]](https://isyourmcpready.com/)
[[SEP-2127 Server Card Charter]](https://modelcontextprotocol.io/community/working-groups/server-card)
[[Go library (olgasafonova/mcp-servercard-go)]](https://github.com/olgasafonova/mcp-servercard-go)

### Status as of July 3

- Claude Desktop and Cursor already ship Server Card support (April 2026).
- Server Card spec remains in **Draft** status; expected to land post-RC (after July 28).
- Adoption across the vendor field is still ramping up.
- IETF parallel track: `draft-serra-mcp-discovery-uri-04` (expires Sep 2026).

**Catalog action (next audit pass):** Once SEP-2127 merges into spec, run
`subregistry-audit` with a `/.well-known/mcp/server-card.json` fetch for each
cataloged server origin to record tool count + protocol version in
`verification.notes`. No schema migration needed until the spec finalizes.

---

## 5. HubSpot MCP — New Capabilities Confirm Top Curate Priority

HubSpot's remote MCP server added two new capabilities in July 2026:

1. **Content analytics — unrestricted:** Previously limited to campaign-linked pages.
   Now any landing page, website page, or blog post can be queried for views,
   form submissions, new contacts, bounce rate, CTA performance, and traffic sources.

2. **Landing page creation:** Agents can now create, edit, and publish landing pages —
   modify copy, headlines, CTAs, add/reorder sections, manage form embeds, and publish
   (with an explicit user confirmation step before publish).

Existing connections need a re-authorize to grant the new permission scope.

[[HubSpot MCP Developer Page]](https://developers.hubspot.com/mcp)
[[HubSpot Developer Changelog]](https://developers.hubspot.com/changelog)

**Catalog status:** HubSpot (`https://mcp.hubspot.com/mcp`, OAuth 2.1 + PKCE, no DCR)
remains the **#1 priority** for the next `subregistry-curate` run. These expanded
capabilities only strengthen the case for inclusion. No-DCR requirement (pre-registered
`client_id` + secret required) must be noted in `auth.notes`.

---

## 6. Spec Countdown — 25 Days to July 28 Final

The 2026-07-28 MCP specification RC locked May 21. Final publication: **July 28, 2026**,
now **25 days away**. No new RC changes reported as of July 3.

SDK timeline:
- Python v2 stable: July 27, 2026
- TypeScript v2 stable: July 28, 2026
- Go, C#: releasing alongside or shortly after spec final

[[2026-07-28 MCP Specification Release Candidate — MCP Blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[Stacktree: What changed in the 2026-07 MCP specification]](https://stacktr.ee/blog/mcp-2026-spec-changes)
[[WorkOS: What changes for AI agent authentication]](https://workos.com/blog/mcp-2026-spec-agent-authentication)

---

## 7. Registry Scale — Glama 50,845; PulseMCP 20,120+

| Registry | Count | Change from July 2 |
|----------|-------|-------------------|
| Glama | **50,845 servers** | +68 (50,777 -> 50,845) |
| PulseMCP | **20,120+** | stable |
| Smithery | ~7,300 | stable (infra rebuild) |
| Our catalog | **19 approved** | unchanged |

[[Glama MCP servers]](https://glama.ai/mcp/servers)
[[PulseMCP directory]](https://www.pulsemcp.com/servers)

Trust gap: ~75k+ indexed vs. 19 approved. This ratio is the product's core value.

---

## 8. AAIF — Enterprise Banking MCP Patterns (July 2, 2026)

The AAIF blog on July 2 featured enterprise banking MCP deployment patterns,
highlighting security requirements specific to financial institutions: **out-of-band
personal data isolation**, **distributed tracking**, and **decoupled service guards**.

These are registry-level concerns — only servers with explicit data-handling guarantees
should be approved for banking deployments. Sub-registry curation with use-case-based
persona tags (e.g., `persona:fintech`) is exactly the right mechanism.

[[AAIF blog]](https://aaif.io/blog/)

---

## 9. Security — Clean Window Continues (Day 5)

No new CVEs or incidents targeting cataloged servers reported on July 3, 2026.

The **SecurityWeek** and **Akamai** analyses of the new spec (published this week)
specifically flag the **stateless transport** as shifting DLP and session policy
responsibility from the protocol to gateway operators and client implementers.
Both reference the new `Mcp-Method`/`Mcp-Name` headers as the replacement signal for
session-based traffic filtering.

[[SecurityWeek: New Enterprise-Ready MCP Specification Brings New Security Challenges]](https://www.securityweek.com/new-enterprise-ready-mcp-specification-brings-new-security-challenges/)
[[Akamai: The New MCP Specification — What Security Teams Must Prepare For]](https://www.akamai.com/blog/security-research/new-mcp-specification-security-teams-must-prepare)

The pending audit item — verifying all TypeScript-SDK-based vendors in catalog run
SDK >=1.26.0 (CVE-2026-25536 cross-client data leak; CVE-2026-0621 ReDoS) — remains
open. The SDK v2 beta announcement clarifies that v1 SDK will receive security updates
for at least 6 months post-v2, so the patch threshold of >=1.26.0 is the right gate.

---

## 10. Catalog Hooks — No Action Required Today

All 19 approved servers remain on Streamable HTTP endpoints. No new CVEs or endpoint
changes affecting cataloged vendors. Pending items unchanged from section 13:

- **Next curate:** HubSpot (confirmed live + GA + new capabilities; OAuth 2.1 + PKCE,
  no DCR), Intercom, Zapier.
- **Next audit:** TypeScript SDK vendors at >=1.26.0 (CVE-2026-25536 / CVE-2026-0621).
- **Future schema:** `provenance.attestation_url` + `provenance.signing_method` when
  Stacklok/Sigstore-style attestations become common across vendors.

---

## Summary

| Topic | Status |
|-------|--------|
| Spec countdown | 25 days to July 28 final |
| SDK v2 betas | All 4 Tier 1 SDKs live (June 29); Python stable July 27; TS stable July 28 |
| Microsoft Enterprise MCP | Preview — watch list; not catalogable yet |
| Stacklok ToolHive | New provenance player — added to watch list |
| SEP-2127 Server Cards | Draft; compliance scanner live; WG ends Aug 14 |
| HubSpot new capabilities | Content analytics + landing-page creation; #1 curate priority |
| Glama | 50,845 (+68); PulseMCP 20,120+ (stable) |
| Security | Clean window Day 5; no new CVEs on July 3 |
| All 19 catalog servers | Approved/public; no action required |

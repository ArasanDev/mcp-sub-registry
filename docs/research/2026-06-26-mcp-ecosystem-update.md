# MCP Ecosystem Update — 2026-06-26

Daily research pass. Covers developments since the June 25 report
([2026-06-25-mcp-ecosystem-update.md](./2026-06-25-mcp-ecosystem-update.md)).
Focus: new CVE-2026-54309 (n8n MCP browser auth bypass); Slack Marketplace MCP registry
GA; Atlassian SSE shutdown imminent (June 30 — catalog already on Streamable HTTP);
Shai-Hulud PyPI wave expands to MCP-themed packages; CVE-2026-26118 Azure MCP SSRF;
registry scale update (Glama 48,480 / PulseMCP 19,500+); spec RC countdown 32 days.

All external claims cited with source URLs.

---

## 1. Registry Scale: Glama 48,480 / PulseMCP 19,500+

### Glama

Glama's MCP server index stands at **48,480** as of the June 26 indexing run — up from
48,043 on June 25, a gain of **~437 servers in one day**. Glama continues to grow at a
rate of 400–500 servers per day, consistent with automated indexing of GitHub and npm
sources.

[[Glama MCP servers]](https://glama.ai/mcp/servers)

### PulseMCP

PulseMCP's directory continues to show **19,500+** servers, stable from June 25. Growth
is approximately 70–90 servers per day on the hand-reviewed side.

[[PulseMCP directory]](https://www.pulsemcp.com/servers)

### Cross-registry estimate

Combined estimate across Official MCP Registry, Glama, Smithery, PulseMCP, and mcp.so:
**~73,000+ indexed MCP servers** (MCPToplist cross-registry count reached 72,503 as of
June 23). Our curated set: **19 approved**. The sub-registry's core value proposition
is unchanged: quality over volume.

### Spec countdown

**32 days** to the July 28, 2026 final MCP specification release. RC locked May 21;
no new breaking changes announced. SDK maintainers have a 10-week window to ship
`2026-07-28` compliance.

[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 2. New CVE: CVE-2026-54309 — n8n MCP Browser Auth Bypass (June 23, 2026)

**CVE-2026-54309** was published June 23, 2026. When `@n8n/mcp-browser` is run in
**HTTP transport mode** (`--transport http`), the MCP endpoint accepts session
initialization and tool invocation requests **without any authentication**. Any
network-reachable client — or any website visited by the user — can establish an MCP
session and invoke browser-control tools including navigation, JavaScript evaluation,
and cookie/storage access against the user's real browser profile.

**Severity:** High (exact CVSS not yet published as of this writing).
**Affected:** `@n8n/mcp-browser` with `--transport http`; versions prior to 2.25.7 and
2.26.2.
**Unaffected:** Default stdio transport mode.
**Patched in:** n8n v2.25.7 and v2.26.2.

**Catalog impact:** n8n is not in our curated catalog. No action required. This CVE
does confirm the recurring pattern that HTTP transport without authentication is an
unsafe deployment pattern — consistent with our remote-auth-gated selection criteria.

[[GitLab Advisory — CVE-2026-54309]](https://advisories.gitlab.com/npm/n8n/CVE-2026-54309/)

---

## 3. CVE-2026-26118 — Azure MCP Server SSRF / Privilege Escalation

**CVE-2026-26118** is an elevation of privilege / SSRF vulnerability in Microsoft Azure
MCP Server Tools. An attacker who can interact with an MCP-backed agent can submit a
malicious URL in place of a normal Azure resource identifier. The MCP Server then sends
an outbound request to that URL and may include its managed identity token — allowing
token capture without administrative access.

**Attack surface:** Authorized users of the MCP-backed agent who can supply attacker-
controlled parameters.
**Catalog impact:** The Azure MCP server (`mcp.azure.com`) uses org-specific URLs and
is not in our catalog. No action required. The SSRF pattern is consistent with the
BlueRock SSRF finding (June 2026) that 36.7% of MCP servers are SSRF-vulnerable.

[[PointGuard AI — CVE-2026-26118]](https://www.pointguardai.com/ai-security-incidents/microsoft-mcp-server-vulnerability-opens-door-to-ai-tool-hijacking-cve-2026-26118)

---

## 4. Atlassian SSE Shutdown June 30 — 4 Days Away (Catalog Clear)

Atlassian is shutting down its HTTP+SSE MCP endpoint (`https://mcp.atlassian.com/v1/sse`)
on **June 30, 2026**, with migration to Streamable HTTP at
`https://mcp.atlassian.com/v1/mcp`.

**Catalog status: NO ACTION NEEDED.** Our entry `com.atlassian/mcp` was updated to
the Streamable HTTP endpoint (`https://mcp.atlassian.com/v1/mcp`, `type: streamable-http`)
during a prior audit pass. Verified clean.

This shutdown is a meaningful ecosystem data point: SSE is an industry-wide deprecated
transport. Any remaining SSE-typed entries in other registries or catalogs will break
on or after June 30.

[[Atlassian SSE Deprecation Notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)

---

## 5. Slack Marketplace MCP Registry — New Ecosystem Entrant

**Slackbot's MCP client** has reached **general availability** in June 2026. The
announcement includes a partner ecosystem of 20+ MCP apps (Amplitude, Atlassian, Box,
Canva, Docusign, Gamma, Linear, Miro, Notion, Replit, Webflow, Zoom) and — critically —
a new **MCP registry embedded in Slack Marketplace**, through which workspace
administrators can discover and approve MCP integrations for their organization.

This is a new significant MCP catalog/registry entrant: an enterprise-controlled
approval workflow inside Slack Marketplace, feeding Slackbot as the AI consumer. The
pattern mirrors our `discovered != approved != enabled` architecture in a product-native
form.

**Catalog impact:** `com.slack/mcp` is already in our approved catalog at
`https://mcp.slack.com/mcp`. The Slack Marketplace registry is notable as a new
**landscape entrant** — added to the watch list (see landscape.md update below).

[[Slackbot MCP Client GA]](https://slack.com/blog/news/slackbots-mcp-client)
[[Slack MCP Server docs]](https://docs.slack.dev/ai/slack-mcp-server/)

---

## 6. Shai-Hulud / Hades PyPI Wave — MCP-Themed Packages Compromised

A June 9, 2026 wave of the **Shai-Hulud / Hades** supply chain campaign compromised
**23 PyPI packages** including packages explicitly targeting MCP developers:
`langchain-core-mcp`, `openai-mcp`, `instructor-mcp`, `tiktoken-mcp`, `ray-mcp-server`.

The campaign now totals **471 malicious artifacts** across npm (411 artifacts, 106
packages) and PyPI (60 artifacts, 37 packages). The attack uses a `.pth` startup-hook
pattern: a malicious wheel bundles a `*-setup.pth` file alongside `_index.js`; the hook
fires on Python startup, silently downloads the Bun JavaScript runtime, and runs an
obfuscated credential stealer.

**Catalog impact:** Remote-HTTP-only catalog is **structurally immune** to all Shai-
Hulud / Miasma / Hades / IronWorm vectors. No Python packages or npm packages from our
catalog are involved. However, operators who also run local MCP servers from PyPI
packages should audit their dependencies immediately.

Attribution: TeamPCP (released worm source code in mid-May 2026; clones emerged shortly
after).

[[SecurityWeek — Shai-Hulud 100+ packages]](https://www.securityweek.com/over-100-npm-pypi-packages-hit-in-new-shai-hulud-supply-chain-attacks/)
[[CyberSecurityNews — 23 PyPI packages]](https://cybersecuritynews.com/23-pypi-packages-compromised/)
[[Socket.dev — Shai-Hulud, Miasma, Hades worms]](https://socket.dev/blog/mini-shai-hulud-miasma-and-hades-worms-target-bioinformatics-and-mcp-developers-via-malicious)
[[Tenable FAQ — CVE-2026-45321]](https://www.tenable.com/blog/mini-shai-hulud-frequently-asked-questions)

---

## 7. MCP Spec RC — No New Changes; 32 Days to Final

No new breaking changes to the 2026-07-28 RC were announced today. Known changes
already documented in prior reports remain in effect:
- Stateless core (no `Mcp-Session-Id`, no initialize handshake)
- New `Mcp-Method`, `Mcp-Name`, `MCP-Protocol-Version: 2026-07-28` headers
- `_meta` per-request; `ttlMs`/`cacheScope` added
- MCP Apps + Tasks as official extensions
- 6 SEPs for OAuth 2.0/OIDC auth hardening
- Roots/Sampling/Logging deprecated (12-month window)
- No catalog schema change required.

SDK maintainers (Tier 1) are expected to ship support within the 10-week window from RC
to final (May 21 → July 28).

[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP spec migration guide — DEV Community]](https://dev.to/akaranjkar08/mcp-spec-ships-july-28-every-breaking-change-and-how-to-migrate-4co8)

---

## 8. MCP Server Cards (SEP-2127) — Working Group Still Active

SEP-2127 Working Group (chaired by David Soria Parra / Anthropic and Sam Morrow Drums /
GitHub) remains active with term ending **August 14, 2026**. The canonical path is
confirmed as `/.well-known/mcp/server-card.json`. Claude Desktop and Cursor are shipping
MCP v2.1 with Server Card support (since April 2026).

The SEP may land post-RC (i.e., post-July 28) rather than in the final spec. Once merged,
`subregistry-audit` can be extended to GET `/.well-known/mcp/server-card.json` on each
cataloged server origin and record tool count + protocol version automatically.

[[SEP-2127 research tracking]](https://github.com/bug-ops/zeph/issues/3701)
[[Apify server-card issue]](https://github.com/apify/apify-mcp-server/issues/790)

---

## 9. Claude Code — MCP Resilience Improvements

Anthropic shipped a Claude Code update with improved MCP resilience: `/rewind` support,
improved MCP resilience and OAuth handling, smarter sandbox prompts, and lower CPU/memory
use during streaming and long sessions. Claude Managed Agents can now connect to private
MCP servers via self-hosted sandboxes (public beta; compatible with Cloudflare, Daytona,
Modal, Vercel).

**Registry relevance:** Improved MCP resilience in Claude Code reduces friction for
operators connecting to cataloged remote servers. The private-server sandbox capability
extends the gateway use case we serve.

[[Anthropic Claude Code updates]](https://releasebot.io/updates/anthropic/claude-code)
[[Claude Managed Agents + private MCP servers]](https://www.anthropic.com/news/claude-code-remote-mcp)

---

## 10. Open Audit Actions (Carried Forward)

The following audit actions remain open from prior research passes:

| # | Action | Priority |
|---|---|---|
| 1 | Verify TypeScript SDK vendors in catalog are running ≥1.26.0 (CVE-2026-25536 cross-client data leak) | High |
| 2 | DNS rebinding: confirm all cataloged vendors run MCP server ≥v0.25 (CVE-2026-11624) | Medium |
| 3 | Extend `subregistry-audit` to fetch `/.well-known/mcp/server-card.json` once SEP-2127 merges | Low (post-Aug 14) |

No new catalog actions required from today's findings. All 19 approved entries remain
`approved`/`public`.

---

## Summary for Catalog Operators

| Finding | Catalog action |
|---|---|
| CVE-2026-54309 (n8n MCP browser) | None — not in catalog |
| CVE-2026-26118 (Azure MCP SSRF) | None — not in catalog |
| Atlassian SSE shutdown June 30 | None — already on Streamable HTTP |
| Slack Marketplace MCP registry | Landscape watch list updated |
| Shai-Hulud PyPI wave | None — remote-HTTP-only catalog immune |
| MCP spec RC | No schema change needed |

# MCP Ecosystem Update — 2026-06-28

Daily research pass. Covers developments since the June 27 report
([2026-06-27-mcp-ecosystem-update.md](./2026-06-27-mcp-ecosystem-update.md)).
Focus: Runlayer $30M Series A (missed in prior reports — most significant new funding in
enterprise MCP governance); registry scale update (Glama 49,411 / PulseMCP 20,040+);
MCP Python SDK v2 beta T-2 days (June 30); Atlassian SSE shutdown T-2 days; Smithery
current status; SEP-2127 Server Cards WG status; spec countdown 30 days; clean security
day — no new CVEs.

All external claims cited with source URLs.

---

## 1. Registry Scale: Glama 49,411 / PulseMCP 20,040+ / Spec Countdown 30 Days

### Glama

Glama's MCP server index stands at **49,411** as of the June 28 indexing run — up from
49,010 on June 27, a single-day gain of **~401 servers**.

[[Glama MCP servers]](https://glama.ai/mcp/servers)

### PulseMCP

PulseMCP's directory shows **20,040+** servers — a notable jump from 19,620+ on June 27.
PulseMCP has crossed the **20,000 milestone**, reflecting continued growth in the
hand-reviewed directory segment of the MCP ecosystem.

[[PulseMCP directory]](https://www.pulsemcp.com/servers)

### Cross-registry estimate

Combined estimate across Official MCP Registry, Glama, Smithery, PulseMCP, and mcp.so:
**~74,000+ indexed MCP servers** (per MCPToplist cross-registry count, stable since June
23 at ~72,503; Glama additions since then bring the estimate to ~74,000+). Our curated
set: **19 approved**. The trust gap continues to widen.

### Spec countdown

**30 days** to the July 28, 2026 final MCP specification release. RC locked May 21, 2026.
The ten-week SDK validation window is now approximately two-thirds complete.

[[MCP RC blog]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 2. Runlayer $30M Series A — Enterprise MCP Governance Raises Stakes (Missed in Prior Reports)

**Date of announcement:** June 24, 2026.

Runlayer, the enterprise MCP governance and AI agent control-plane startup founded by
third-time founder Andrew Berman, **raised a $30M Series A** led by Felicis Ventures,
with participation from Khosla Ventures. This brings Runlayer's total funding to **$42M**
($11M seed + $30M Series A, both from the same two investors).

Vinod Khosla is quoted saying he "wanted every available dollar" of the round, reflecting
high conviction in enterprise MCP governance as a standalone market.

### Why this matters

This is the **largest funding event in enterprise MCP governance to date**, and the one
most precisely scoped to the problem this sub-registry addresses: curated, approved access
control for MCP servers in enterprise environments.

Runlayer's product is a control plane for AI agent workflows: it provides discovery,
security policy enforcement (ABAC, conditional access, SCIM), audit, and observable
agent sessions — all gated on an approved catalog of MCP servers. The core discipline is
`discovered != approved != enabled`: a server must be approved before agents can reach it
at runtime. This is the same separation this sub-registry enforces at the catalog layer.

### Customer base

Confirmed customers include: Instacart, Gusto, Decagon, Opendoor, dbt Labs, AngelList,
Lemonade, and unnamed Fortune 500s. This is meaningful enterprise validation —
production deployments, not pilots.

### Landscape significance

- Runlayer is now the **best-funded pure-play enterprise MCP governance vendor** in the
  space (Obot at $35M is a broader agentic platform; Palo Alto/Portkey is a much larger
  security vendor using MCP governance as a feature).
- The $42M total and the enterprise customer list confirm there is a standalone market for
  what this sub-registry's gateway projection serves: a trusted, approved, versioned
  catalog of MCP servers that feeds a runtime governance layer.
- The Runlayer architecture separates the catalog (discovery + approval) from the runtime
  (gateway + policy enforcement) — the same separation we enforce. This is the
  strongest external validation of the `registry != gateway` boundary since the NSA
  guidance.

### Catalog implications

No catalog action needed. Runlayer is a governance platform that _consumes_ catalogs
(including ours, potentially); it is not an MCP server to catalog. The funding signal
updates the landscape ranking (Runlayer moves from #11 to #3, above Obot in funding
terms, though Obot retains a model-match advantage in clean architecture).

[[Fortune exclusive]](https://fortune.com/2026/06/24/exclusive-vinod-khosla-felicis-runlayer-nanit-30-million-enterprise-ai/)
[[Runlayer blog]](https://www.runlayer.com/blog/series-A-30m-fundraise-felicis-khosla)
[[finsmes.com]](https://www.finsmes.com/2026/06/runlayer-raises-30m-series-a-funding.html)

---

## 3. MCP Python SDK v2 Beta — T-2 Days (June 30)

**MCP Python SDK v2 beta is due tomorrow, June 30, 2026.** Timeline recap:

- June 11, 2026: v2.0.0a1 (alpha 1) published on PyPI
- **June 30, 2026 (tomorrow):** v2.0.0b1 (beta) — target date
- July 27, 2026: stable v2.0.0 — one day before the final spec ships

The v2 pre-releases are opt-in only (`pip install mcp==2.0.0b1`); v1.x users are
unaffected unless they explicitly upgrade.

### Catalog implications

Any cataloged MCP server built on the Python SDK must ship a **v2-compliant release
before July 28, 2026** to remain compatible with the new stateless spec. Our catalog
currently has no Python-SDK-identified servers flagged for this audit, but the next
`subregistry-audit` pass should verify which vendors (if any) expose Python-SDK server
implementations and confirm their upgrade trajectory.

The guidance for SDK-dependent vendors: pin `mcp>=1.27,<2` until they are ready to
validate against v2, then migrate before July 28.

[[MCP Python SDK — GitHub]](https://github.com/modelcontextprotocol/python-sdk)
[[MCP Python SDK — PyPI]](https://pypi.org/project/mcp/)

---

## 4. Atlassian SSE Shutdown — T-2 Days (June 30)

The Atlassian Rovo MCP Server's HTTP+SSE transport at `https://mcp.atlassian.com/v1/sse`
shuts down **June 30, 2026 — the day after tomorrow**.

Our catalog entry `com.atlassian/mcp` already uses the Streamable HTTP endpoint
(`https://mcp.atlassian.com/v1/mcp`). **No catalog action required.**

The industry-wide pattern continues: SSE-to-Streamable-HTTP migration is now required
by every major vendor ahead of the July 28 spec, which formally deprecates SSE in favor
of the stateless Streamable HTTP transport.

For operators still using SSE clients: the recommended migration endpoint is
`https://mcp.atlassian.com/v1/mcp/authv2`.

[[Atlassian SSE deprecation notice]](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/HTTP-SSE-Deprecation-Notice/ba-p/3205484)

---

## 5. Smithery: Current Status (~7,000 Servers, Infra Rebuild)

Smithery's free hosting tier ended March 1, 2026, and the platform has been contracting
and rebuilding since. Current indexed server count: **~7,000** (down from the prior
high-water mark; the catalog is contracting as unmaintained servers age out without
free hosting).

Notable security context: a path traversal vulnerability discovered October 2025 exposed
3,000+ hosted servers and API keys on Smithery's infrastructure; the vulnerability has
been patched but continued to fuel confidence concerns heading into 2026.

A March 2026 scan of 100 Smithery servers found 22 with security findings — reflecting
the difficulty of maintaining security at breadth without strong curation enforcement.

### Landscape implication

Smithery remains a discovery source (prototyping-grade, not a trust layer) but its
contraction and infra rebuild reduce its relevance as a sync source for our catalog.
For our purposes: use PulseMCP and Glama as primary breadth references; use Smithery
for discovery only, and treat its servers as `discovered` (not `approved`) by default.

[[Smithery registry]](https://smithery.ai/servers)

---

## 6. SEP-2127 (MCP Server Cards) — WG Term Ends August 14, 2026

SEP-2127 is still in **Draft** status. The Working Group (led by David Soria Parra,
Anthropic + Sam Morrow Drums, GitHub) has a charter term ending **August 14, 2026** —
37 days after the July 28 spec ships.

This means Server Cards will almost certainly land as a **post-RC addition**, not in the
July 28 final spec. Adoption by clients is already ahead of the spec:

- Claude Desktop and Cursor are shipping MCP v2.1 with Server Card support (April 2026).
- A second language implementation of the SEP-2127 reference is now available:
  `olgasafonova/mcp-servercard-go` — SEP-2127 Go library alongside the Python reference.
- Multiple vendors (Apify noted) are already responding to `/.well-known/mcp/server-card.json`.

### Catalog implication

No schema migration needed now. Once SEP-2127 is merged into the spec (likely
post-August 14), extend `subregistry-audit` to GET `/.well-known/mcp/server-card.json`
on each cataloged server origin and record tool count + protocol version in
`verification.notes`.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 7. Security: Clean Day — No New CVEs or Incidents on June 28

No new CVEs or security incidents targeting cataloged vendors were identified in the June
28 research pass. The active threat landscape from prior reports remains unchanged:

- **CVE-2026-25536 audit still pending:** TypeScript SDK cross-client data leak (patched
  >=1.26.0). Next `subregistry-audit` pass must verify all TypeScript-SDK-based catalog
  vendors (Atlassian, Sentry, Stripe, Vercel, etc.) are running >=1.26.0.
- **SANDWORM_MODE / Miasma / IronWorm / Hades wave** — npm/PyPI threat landscape stable;
  no new wave reported June 28. Remote-HTTP-only catalog remains structurally immune.
- **Agentjacking (Sentry DSN injection)** — status unchanged. `com.sentry/mcp` remains
  auth-gated (401 unauthenticated). Operators must treat Sentry event content as
  untrusted external data.
- **Bitwarden CLI supply chain attack (April 22, 2026)** — documented, not in catalog.
  Schema design validation: secret names only, never values, is correct defense.

[[Authzed Timeline of MCP Security Breaches]](https://authzed.com/blog/timeline-mcp-breaches)
[[The Vulnerable MCP Project]](https://vulnerablemcp.info/)

---

## 8. Catalog Action Items

| Priority | Item | Notes |
|---|---|---|
| HIGH | **CVE-2026-25536 audit** | TypeScript SDK >=1.26.0 required on all vendors; `subregistry-audit` next pass |
| MEDIUM | **Comms & Support curate group** | HubSpot (`https://mcp.hubspot.com/mcp`), Intercom, Zapier — next `subregistry-curate` run |
| MEDIUM | **VPS seed deploy** | 19 servers committed; not yet live on VPS — `subregistry-deploy` |
| LOW | **Python SDK v2 vendor audit** | Identify any Python-SDK vendors in catalog; confirm upgrade path before July 28 |
| LOW | **Weekly audit cadence** | Set up recurring `subregistry-audit` after curate run completes |

---

## Summary

The headline finding for June 28 is **Runlayer's $30M Series A** (announced June 24,
missed in prior daily reports): it is the largest pure-play enterprise MCP governance
funding event to date, confirms a standalone market for approved MCP server catalogs
feeding runtime governance layers, and validates the `registry != gateway != runtime`
separation this sub-registry enforces. Runlayer's architecture matches our boundary
discipline precisely.

Registry scale crossed new milestones: **Glama 49,411** (+401) and **PulseMCP 20,040+**
(crossing the 20k mark). The trust gap — ~74k indexed vs. 19 approved — continues to
widen, keeping the value proposition clear.

Two T-2 countdowns expire tomorrow: MCP Python SDK v2 beta (June 30) and Atlassian SSE
shutdown (June 30). Neither requires catalog action — our Atlassian entry already uses
Streamable HTTP. June 28 is clean on new CVEs and security incidents.

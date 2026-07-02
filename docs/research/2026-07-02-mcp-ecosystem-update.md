# MCP Ecosystem Update — 2026-07-02

Daily research pass. Covers developments since the July 1 report
([2026-07-01-mcp-ecosystem-update.md](./2026-07-01-mcp-ecosystem-update.md)).
Focus: Microsoft issues formal tool-poisoning warning and imposes signed-manifest
requirement for its agent frameworks (July 2026); CVE-2026-35394 (Mobile MCP Android
intent injection) cataloged; Glama crosses 50,777 servers; spec countdown 26 days;
HubSpot MCP gains new capabilities ahead of next curate run; clean security window
extends to Day 4.

All external claims cited with source URLs.

---

## 1. Microsoft: Tool-Poisoning Warning + Signed Manifest Requirement (July 2026)

**Microsoft Incident Response and Microsoft Defender** researchers published a formal
warning that attackers can hijack enterprise AI agents by injecting hidden instructions
into the plain-text descriptions that MCP tools ship alongside their schemas.

### How the attack works

Every MCP tool includes a `description` field — a few lines of natural language that
tell an AI agent what the tool does and when to invoke it. The weakness: MCP picks up
description changes dynamically. In deployments without a re-approval trigger, a
poisoned description goes live with no additional review. Hidden instructions buried in
description text — disguised as formatting notes or edge-case guidance — can direct an
agent to exfiltrate invoices, extract credentials, or send data to attacker-controlled
endpoints, while every individual step remains within the agent's normal policy envelope.

The **MCPTox benchmark** (released August 2025) ran poisoned tool descriptions against
45 real MCP servers and 20 leading AI models and found a success rate as high as **72.8%**
across models tested.

### Microsoft's new control requirements

Starting in **July 2026**, Microsoft requires that any MCP server registered with Microsoft's
official agent frameworks provide a **developer-signed tool manifest** including a content
hash of all tool metadata (`name`, `description`, `inputSchema`). New platform controls:

- **Signed manifests** — content-hash binding on tool metadata prevents silent description changes
- **Metadata scanning** — Defender now scans tool descriptions at registration time for injected instructions
- **Dynamic tool scoping** — agents restricted to the minimal tool set per task context

**Catalog relevance:** This is the strongest signal to date that **tool description integrity
is now a trust requirement**, not just a best practice. Our `approved` status means operators
can trust that the tools described at approval time are what they get. The signed-manifest
pattern extends what our `verifiedAt` + `verification.status` fields already capture —
it reinforces the registry layer's role in the trust chain. No catalog entry changes needed,
but this strengthens the case for adding a `manifest_hash` field to the approved server
schema in a future iteration.

[[Microsoft Warns Poisoned MCP Tool Descriptions — Security Boulevard (July 2026)]](https://securityboulevard.com/2026/07/microsoft-warns-poisoned-mcp-tool-descriptions-can-make-ai-agents-leak-data/)
[[The Hacker News coverage]](https://thehackernews.com/2026/06/microsoft-warns-poisoned-mcp-tool.html)
[[Microsoft: State of MCP Security in 2026]](https://techcommunity.microsoft.com/blog/microsoft-security-blog/the-state-of-mcp-security-in-2026/4531327)

---

## 2. CVE-2026-35394 — Mobile MCP Android Intent Injection

A new CVE was cataloged against **Mobilenexthq Mobile MCP**, a popular tool for letting
AI agents control Android devices.

| Field | Detail |
| --- | --- |
| CVE | **CVE-2026-35394** |
| Product | Mobilenexthq Mobile MCP (versions prior to 0.0.50) |
| Type | Intent Injection / Arbitrary Android intent execution |
| Attack vector | Network (requires user interaction) |
| Root cause | `mobile_open_url` tool passes user-supplied URLs to Android's intent system without scheme validation |
| Impact | Unauthorized phone calls, SMS, USSD code execution (e.g. call-forwarding), content provider access |
| Fix | Version 0.0.50 — strict URI scheme validation |

**Catalog relevance:** Not in our catalog; Mobile MCP is a STDIO/device-control tool, not
a remote HTTP endpoint. However, this is the first CVE against a widely-used AI agent
device-control MCP tool and is a concrete example of how AI agents with `openWorld: true`
tool access expose physical-world attack surfaces. Remote-HTTP-only catalog remains immune.

[[CVE-2026-35394 — SentinelOne Vulnerability Database]](https://www.sentinelone.com/vulnerability-database/cve-2026-35394/)

---

## 3. New Spec Security Analysis — SecurityWeek, Akamai (July 2026)

Two security vendors published enterprise-focused analyses of the security implications of
the 2026-07-28 MCP specification release candidate.

**SecurityWeek**: The new spec "shifts critical security responsibilities from the protocol
itself to developers and platform operators." While the update eliminates protocol-level
session hijacking and unsolicited server prompts, three new attack surfaces are introduced:

1. **MCP Apps iframes** — server-rendered HTML UIs run inside sandboxed IDE iframes that are
   invisible to network monitoring; tooling behaves as expected at the gateway layer while
   executing attacker-controlled HTML
2. **Stateless transport** — DPI-based session policies must be rebuilt around per-request
   `Mcp-Method`/`Mcp-Name` headers rather than session state
3. **Tasks extension** — long-running task handles enable cross-client task hijacking if
   servers don't enforce handle ownership per client identity

**Akamai** published its own preparation guide: "The New MCP Specification: What Security
Teams Must Prepare For", noting that the stateless core enables round-robin load balancing
but requires all security state to be carried in per-request `_meta` rather than in session
context.

**Catalog relevance:** Our catalog is not a runtime surface — these are concerns for gateway
operators and MCP client implementers. The registry layer's job remains upstream: ensure
that only endpoints with known provenance, verified auth-gating, and a clear owner are
in the approved set. These analyses reinforce our focus on authentication status and
endpoint integrity.

[[SecurityWeek: New Enterprise-Ready MCP Specification Brings New Security Challenges]](https://www.securityweek.com/new-enterprise-ready-mcp-specification-brings-new-security-challenges/)
[[Akamai: New MCP Specification — What Security Teams Must Prepare For]](https://www.akamai.com/blog/security-research/new-mcp-specification-security-teams-must-prepare)

---

## 4. Spec Countdown: 26 Days to July 28 Final

The 2026-07-28 MCP specification final release is now **26 days away**. RC locked May 21;
no new changes. All cataloged servers are on Streamable HTTP transport, which is spec-forward.

**SDK status (no change from July 1):**
- Python SDK: v2.0.0b1 available (confirmed shipped June 30); stable v2.0.0 targets July 27
- TypeScript SDK: v2.0.0-beta active; v1.29.0 is current production-stable
- Vendor recommendation: pin `mcp>=1.27,<2` until July 27; plan v2 migration now

[[MCP RC Announcement]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP Python SDK — PyPI]](https://pypi.org/project/mcp/)
[[MCP TypeScript SDK v2 docs]](https://ts.sdk.modelcontextprotocol.io/v2/)

---

## 5. Registry Scale — Glama: 50,777

Updated figures as of July 2, 2026:

| Registry | Count | Change vs July 1 |
| --- | --- | --- |
| Glama | **50,777** | **+515** from 50,262 |
| PulseMCP | ~20,120+ | flat (no new index) |
| Smithery | ~7,300 | flat |
| MCPToplist cross-registry | ~73,547 | flat (last June 28 reading) |
| Our curated catalog | **19** | unchanged |

Glama has now crossed 50,777. The trust gap — ~73k+ indexed vs. 19 approved — remains
the product's core value proposition.

[[Glama MCP Servers]](https://glama.ai/mcp/servers)
[[MCPToplist]](https://mcptoplist.com/)

---

## 6. HubSpot MCP Server — New Capabilities (July 2026)

**HubSpot's official remote MCP server** (`mcp.hubspot.com`) shipped two new capabilities
in late June / early July 2026 that are relevant for our upcoming "Comms & Support" curate
run (Next Actions §13 #2):

- **Content analytics for standalone web assets** — query performance data for landing
  pages, website pages, and blog posts: views, form submissions, new contacts, bounce rate,
  CTA performance, traffic sources
- **Landing page creation** — full landing page creation via MCP tool call

These additions extend HubSpot MCP beyond CRM operations into content and marketing analytics,
significantly increasing the tool surface relevant to AI agents. The server remains on
OAuth 2.1 + PKCE (no DCR — requires pre-registered client ID/secret). Endpoint:
`https://mcp.hubspot.com/mcp` (confirmed GA April 13, 2026; unblocked for our environment).

**Catalog action:** HubSpot remains the #1 priority for the next curate run. New capabilities
increase its value score. Auth pattern (no-DCR) should be noted in `auth.notes` when the
entry is added.

[[HubSpot MCP Server Developer Docs]](https://developers.hubspot.com/mcp)
[[HubSpot Release Notes July 2026]](https://releasebot.io/updates/hubspot)

---

## 7. OceanLotus / ZiChatBot PyPI Campaign — Context Note

Kaspersky (May 2026 disclosure) documented an **OceanLotus-attributed PyPI supply-chain
campaign** that delivered **ZiChatBot** — a backdoor using Zulip's REST API as its C2
channel — via three malicious wheel packages (`uuid32-utils`, `colorinal`, `termncolor`).
Dwell window: approximately 10 months (July 2025 – May 2026). Campaign total: ~2,480 downloads
across affected packages.

ZiChatBot is distinct from the Shai-Hulud/Miasma/SANDWORM_MODE MCP-targeting worm families
but reinforces the same structural risk: PyPI packages as an AI-adjacent supply-chain vector.
This campaign was not previously noted in our reports. Not in our catalog; remote-HTTP-only
catalog immune to PyPI-based delivery.

[[Kaspersky / Securelist: OceanLotus ZiChatBot Campaign]](https://securelist.com/oceanlotus-suspected-pypi-zichatbot-campaign/119603/)
[[The Hacker News: ZiChatBot via PyPI Wheel Packages]](https://thehackernews.com/2026/05/pypi-packages-deliver-zichatbot-malware.html)

---

## 8. Clean Security Window — Day 4

No new CVEs or active MCP-specific incidents were published for July 2, 2026. CVE-2026-35394
(§2) is a pre-July disclosure now cataloged for the first time in our research.

The clean security window that began June 29 continues. Active ongoing campaigns (IronWorm,
Miasma, SANDWORM_MODE) have not produced new public disclosures today.

All 19 cataloged servers remain approved/public. No demotions or removals warranted.

---

## 9. Catalog Hooks Summary

| Server | Status | Action |
| --- | --- | --- |
| All 19 entries | Approved/public, Streamable HTTP ✓ | No transport migration needed |
| TS-SDK vendors (Sentry, Linear, Figma, Notion, GitHub, Neon, Supabase, Slack) | SDK version unverified | **Pending:** `subregistry-audit` to confirm ≥v1.26.0 |
| com.hubspot/mcp (not yet added) | New capabilities live; OAuth 2.1 confirmed | **Next curate run** — add to catalog |
| Python-SDK vendors | v2 migration window (27 days to July 27 stable) | Audit pass should confirm v2 readiness |

---

## Summary

| Topic | Status |
| --- | --- |
| Microsoft tool-poisoning warning | **Signed manifests required July 2026** for MS agent frameworks; reinforces registry approval role |
| CVE-2026-35394 | Mobile MCP Android intent injection; fixed v0.0.50; not in catalog |
| MCP spec countdown | **26 days** to July 28 final |
| Glama scale | **50,777** (+515 vs July 1) |
| HubSpot MCP new features | Content analytics + landing page creation now live; auth pattern confirmed |
| OceanLotus / ZiChatBot | PyPI campaign (May 2026 disclosure) added to landscape record |
| New CVEs / incidents | **None today** — clean window Day 4 |
| Catalog entries | All 19 approved/public; all on Streamable HTTP |
| Next action | `subregistry-audit`: TypeScript SDK ≥v1.26.0 verification; then `subregistry-curate` comms & support group (HubSpot first) |

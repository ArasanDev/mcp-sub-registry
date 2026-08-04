# MCP Ecosystem Update — 2026-08-04

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-03 EOD → 2026-08-04
**Prior report:** [2026-08-03-mcp-ecosystem-update.md](./2026-08-03-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Black Hat MCPwned briefing is TOMORROW (Aug 5–6):** The "MCPwned: How Exposed AI
  Agents Became the Internet's New Recon Toy" briefing is scheduled Aug 5–6 at Black Hat
  USA 2026 (Las Vegas). Slides not yet published. Research details confirmed: honeypot
  simulated 16 AI infrastructure personas across 16 ports; captured **3,993 requests from
  327 unique source IPs in 48 hours**, including **155 MCP probes** and **344 AI API key
  probes**. Cataloged attack classes: LiteLLM model-registration abuse, MCP resource
  enumeration, framework-aware credential brute-forcing, coordinated scanning of local
  inference services. Presenter is affiliated with Team Cymru.
  [[Black Hat schedule]](https://blackhat.com/us-26/briefings/schedule/index.html)
  [[event.team-cymru.com BH26]](https://event.team-cymru.com/black-hat-usa-2026)
- **Active MCP WG sessions today and tomorrow:** SDK Working Group meets today (Aug 4)
  at 6:00pm. Tomorrow (Aug 5): Inspector V2 WG (8am), MCP Apps WG (8am), and the new
  Gateways Interest Group (2pm) — all scheduled concurrently with the Black Hat briefings.
  The Gateways Interest Group is particularly relevant; its outputs may shape gateway/catalog
  integration patterns.
  [[MCP Events]](https://meet.modelcontextprotocol.io/)
- **Registry scale (Aug 4):** Glama **~67,664** (+486 vs Aug 3 ~67,178); PulseMCP
  **~22,090+** (stable); MCPToplist **~96,771** (Aug 2 snapshot — cross-registry aggregate
  unchanged). Trust gap: ~97k indexed vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **Security: Day 39 clean window.** No new CVEs targeting any of the 19 cataloged servers.
  Vigilance remains elevated ahead of Black Hat MCPwned slides.
- **AWS Agent Registry namespace migration: 2 days away (Aug 6).** Transition from
  `bedrock-agentcore` to `agent-registry` namespace. Our `com.aws/mcp` is a distinct GA
  product and is unaffected. Watch for AWS Agent Registry GA announcement alongside
  or after migration.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 4) | vs. Aug 3 | Note |
|---|---|---|---|
| Glama | ~67,664 | +486 | Post-spec surge continuing; also reports 10,818 connectors; 494,862 tools |
| PulseMCP | ~22,090+ | ±0 | Stable |
| MCPToplist (cross-registry) | ~96,771 | — (Aug 2 snap) | No new aggregate since Aug 2 |
| Anthropic Connectors (verified) | 439 | — | Stable |
| Our catalog | 19 | — | Approved/public |

Glama now indexes **494,862 MCP tools** across its ~67,664 servers and 10,818 connectors —
the first confirmed crossing of the 494k tools threshold.
[[Glama search]](https://glama.ai/mcp/servers)

---

## 3. Black Hat 2026 — MCPwned Briefing Preview

The most anticipated AI-infrastructure security talk of the year delivers tomorrow. Based on
the published abstract, the confirmed research methodology is:

> A purpose-built AI honeypot simulated **16 LLM and AI infrastructure personas** across 16
> ports, returning framework-authentic responses, headers, errors, and protocol behaviors.
> In a **48-hour window**, the system captured **3,993 requests from 327 unique source IPs**,
> including **155 MCP probes** and **344 AI API key probes**.

Observed attacker playbook categories:
1. **LiteLLM model-registration abuse** — register rogue models via the admin API
2. **MCP resource enumeration** — probe `tools/list`, `resources/list`, server metadata
3. **Framework-aware credential brute-forcing** — adapts probe signatures to target framework
4. **Coordinated scanning for local inference services** — beyond MCP, targets Ollama, LM Studio, etc.

**Implication for catalog:** Remote-HTTP + auth-gated endpoints are structurally immune to
passive MCP enumeration (unauthenticated `initialize` or `tools/list` calls will return 401
on all 19 catalog entries). The honeypot data quantifies the threat level against *exposed*
MCP endpoints — reinforcing that our auth requirement is the right design.

**Action:** Read published slides as soon as they appear (Aug 5–6 or shortly after).
Run audit pass if any cataloged vendor endpoint is named.
[[Novee BH2026 preview]](https://novee.security/blog/black-hat-2026-briefings-ai-offensive-security/)
[[Decryption Digest BH2026]](https://www.decryptiondigest.com/blog/black-hat-2026-briefings-schedule-ai-security-talks)

---

## 4. MCP Working Group Activity (Aug 4–5)

Multiple community governance sessions cluster around today and tomorrow:

| Date/Time | Group | Relevance |
|---|---|---|
| Aug 4, 6:00pm | SDK Working Group (bi-weekly) | SDK v2 adoption, codemod, migration issues |
| Aug 5, 8:00am | Inspector V2 WG (weekly) | Developer tooling; debugging surface for MCP servers |
| Aug 5, 8:00am | MCP Apps Working Group | Sandboxed iframe UI extensions in new spec |
| Aug 5, 2:00pm | **Gateways Interest Group** | Gateway/catalog integration — directly relevant to our projection |

The **Gateways Interest Group** is the most relevant to this sub-registry. It was established
post-spec-release to address how gateways interact with the 2026-07-28 stateless transport,
`Mcp-Method`/`Mcp-Name` headers, and the new authorization model. Any guidance it produces
on catalog-projection contracts will inform our `GET /v0.1/gateway/catalog` shape.

No public outputs available yet (meetings are today/tomorrow). Monitor for meeting notes or
SEP proposals in the coming week.
[[MCP Events calendar]](https://meet.modelcontextprotocol.io/)

---

## 5. SDK & Spec (Day 7 Post-Release)

No new spec or SDK releases since July 28. All four Tier 1 SDK v2 releases stable:

- **TypeScript:** `@modelcontextprotocol/server` + `@modelcontextprotocol/client` v2.0.0
- **Python:** `mcp==2.0.0`
- **Go:** v1.7.0
- **C#:** v2.0.0 — Microsoft published the formal .NET Blog announcement this week.
  [[Microsoft .NET Blog — MCP C# SDK v2.0]](https://devblogs.microsoft.com/dotnet/announcing-v20-of-the-official-mcp-csharp-sdk/)

V1.x receives security patches for ≥6 months (through ~January 2027). CIMD (Client ID
Metadata Documents) adoption expanding post-spec; FastMCP CIMD support remains an open issue.

---

## 6. Snowflake Cortex AI Gateway — Status (Day 3 Post-Announcement)

No public preview launch yet. Current status remains:
- **Private preview** — the five identity partner integrations (Aembit, Linx Security,
  Okta, SailPoint, Saviynt) are in private preview.
- **Public preview** scheduled "soon" but no date confirmed as of Aug 4.
- Snowflake is actively briefing enterprise customers at Black Hat USA 2026 (Aug 1–6).

No new announcements from Snowflake today. Watch for public preview launch announcement
at or after BH2026 close (Aug 6).
[[Snowflake BH announcement]](https://www.snowflake.com/en/blog/enterprise-ai-security-agentic-mcp-governance/)

---

## 7. Security

### 7.1 MCP Security State — New Community Research

**"The State of MCP Server Security in 2026 — 118 Findings Across 68 Packages"** (DEV Community):
An independent audit of 68 MCP npm packages surfaced 118 security findings. Pattern summary:
- Path traversal dominant (file-operation misuse)
- Missing authentication on tool endpoints
- Overly permissive CORS headers
- Dependency confusion exposure

This is consistent with the GBHackers large-scale scan (July 11: 9,695 servers, 5,832 with
issues) and the Practical DevSecOps aggregate (43% of public MCP servers have ≥1 vulnerability;
5.5% have poisoned tool descriptions in production). Remote-HTTP + auth-gated catalog is
structurally immune to the dominant finding class (file path traversal in STDIO/local packages).
[[DEV community article]](https://dev.to/ecap0/the-state-of-mcp-server-security-in-2026-118-findings-across-68-packages-4fkd)

**Microsoft "The State of MCP Security in 2026"** — published this week on Microsoft Community Hub.
Article is paywalled/access-restricted; headline consistent with broader industry consensus
(exploit volume, supply-chain risk, 2026-07-28 spec partially addresses known vectors).
[[Microsoft Community Hub]](https://techcommunity.microsoft.com/blog/microsoft-security-blog/the-state-of-mcp-security-in-2026/4531327)

### 7.2 Day 39 Clean Window

No new CVEs targeting any of the 19 cataloged servers. All remain `approved`/`public`.

### 7.3 Pending Audit Items (unchanged)

- **CVE-2026-25536 (PRIORITY):** Verify all TypeScript SDK-backed catalog vendors are on
  `@modelcontextprotocol/sdk >=1.26.0` or migrated to v2.0.0.
- **CIMD compliance:** Audit OAuth-gated vendors (DCR deprecated in new spec).
- **Server Cards:** Poll `/.well-known/mcp/server-card.json` after SEP-2127 WG closes
  Aug 14 (10 days).

---

## 8. Catalog Hooks

All 19 cataloged servers remain `approved`/`public`. No demotions, no security flags.

**Curate queue (next run, unchanged):**
1. **HubSpot** (`mcp.hubspot.com`) — GA, OAuth 2.1 + PKCE, Anthropic Connectors Directory,
   CRM snapshot polling endpoint added July 31. #1 priority.
2. **X/Twitter** (`api.x.com/mcp`) — verify gateway-compatible auth path (pay-per-use pricing
   model complicates headless use) before adding.

---

## 9. Near-Term Watches (Next 11 Days)

| Date | Event | Action |
|---|---|---|
| **Aug 4 (today)** | SDK WG meeting 6pm | Monitor for outputs |
| **Aug 5 (tomorrow)** | Black Hat MCPwned briefing; Inspector/Apps/Gateways WG meetings | **Read slides ASAP; run audit if catalog server named** |
| **Aug 6** | AWS Agent Registry namespace migration (`bedrock-agentcore` → `agent-registry`) | `com.aws/mcp` unaffected; watch for GA |
| Aug 6 | Black Hat MCPwned briefing (day 2) | Continue monitoring |
| Aug 13–14 | AAIF MCP Dev Summit Seoul (co-located with OS Summit Korea) | Watch for governance/spec announcements |
| Aug 14 | SEP-2127 Server Cards WG closes | Begin `/.well-known/mcp/server-card.json` audit sweep |
| Aug 31 | SEP-2127 WG follow-on meeting | Potential post-WG implementation guidance |
| ASAP | CVE-2026-25536 + CIMD audit | Run `subregistry-audit` |
| ASAP | HubSpot curate | Run `subregistry-curate` |

---

## 10. Landscape Changes Today

- **Scale numbers updated:** Glama ~67,664 (+486); Glama tools now 494,862+.
- **No ranking changes** in Top 11. No new major landscape entrants.
- Landscape.md `Last updated` bumped to today.

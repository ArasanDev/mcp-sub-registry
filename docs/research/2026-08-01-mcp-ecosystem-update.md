# MCP Ecosystem Update — 2026-08-01

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-07-31 EOD → 2026-08-01
**Prior report:** [2026-07-31-mcp-ecosystem-update.md](./2026-07-31-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Black Hat USA 2026 opens today (August 1–6, Las Vegas):** "MCPwned: How Exposed AI Agents
  Became the Internet's New Recon Toy" is a scheduled Briefings talk (August 5–6) documenting
  attackers scanning and probing MCP endpoints at scale — 155 MCP probes captured in a 48-hour
  honeypot window. First major security-conference briefing treating exposed MCP servers as a
  recognized threat class.
  [[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
  [[Decryption Digest summary]](https://www.decryptiondigest.com/blog/black-hat-2026-briefings-schedule-ai-security-talks)
- **Runlayer: AARM Extended Conformance + 1Password integration:** Runlayer is one of only
  three companies to achieve AARM Extended Conformance (R1–R9); the 1Password partnership
  replaces plaintext secrets in MCP server configs with vault-resolved `op://` references with
  full audit logging. Runlayer is meeting the market at Black Hat (private executive briefings,
  SpeedVegas Supercar Track Day August 5).
  [[Runlayer AARM]](https://www.runlayer.com/blog/runlayer-and-aarm-partner-to-secure-enterprise-agents)
  [[Runlayer + 1Password]](https://1password.com/blog/secure-mcp-credentials-1password-runlayer)
- **Registry scale: Glama ~66,247; MCPToplist possibly ~95k+:** Glama climbed to approximately
  66,247 (up from 65,354 on July 31, +893). Cross-registry MCPToplist aggregate may now be
  near 95,000+, driven by Glama's post-spec surge. PulseMCP steady at 22,110+. Trust gap:
  ~95k+ indexed vs. 19 approved in our catalog.
  [[Glama]](https://glama.ai/mcp/servers)
  [[PulseMCP]](https://www.pulsemcp.com/servers)
  [[MCPToplist]](https://mcptoplist.com/)
- **AWS Agent Registry namespace migration in 5 days (August 6):** `bedrock-agentcore` →
  `agent-registry`; all endpoints, IAM policies, SDK clients, and CLI scripts must be updated.
  Our `com.aws/mcp` (AWS MCP Server, a distinct GA product) is **unaffected** — no catalog action.
  [[AWS docs]](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html)
- **SEP-2127 WG: 13 days to close (August 14):** Server Cards WG term ends August 14, 2026.
  `/.well-known/mcp.json` path confirmed; validator live at agent-ready.dev.  After WG closes,
  `subregistry-audit` should poll all 19 catalog servers for this endpoint and record findings.
  [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
  [[Validator]](https://agent-ready.dev/mcp-card-validator)
- **Security: Day 35 clean window** — No new CVEs affecting any of our 19 cataloged servers
  as of August 1, 2026. All 19 entries remain approved/public.

---

## 2. Registry Scale Update

| Directory | Count (Aug 1) | Prior (Jul 31) | Change |
|---|---|---|---|
| Glama | **~66,247** | 65,354 | +893 |
| PulseMCP | ~22,110+ | ~22,110+ | ≈ flat |
| MCPToplist (cross-registry) | **~95,000+** (est.) | 81,852 (Jul 28) | +13k+ est. |
| Our catalog | **19 approved** | 19 | — |

Glama continues its post-spec-release acceleration: the registry crossed 50k on July 1, 62k
on July 29, 65k on July 31, and now ~66k on August 1 — roughly +1,000/day on average over
the last 4 days. PulseMCP is flat, suggesting growth is concentrated in community/automated
indexing (Glama's domain) rather than hand-reviewed servers.

The MCPToplist cross-registry estimate of ~95,000+ reflects the aggregate of Glama (~66k),
PulseMCP (~22k), Smithery (~7k), mcp.so, and the Official MCP Registry. This is a significant
jump from the 81,852 snapshot on July 28; the increase is driven by Glama's continued surge.
**Note: MCPToplist blocked direct WebFetch; the ~95k figure is estimated from component
registries rather than a direct page read.** Verify on next audit.

[[Glama servers page]](https://glama.ai/mcp/servers)
[[PulseMCP directory]](https://www.pulsemcp.com/servers)

---

## 3. Black Hat USA 2026: MCP as a Security-Conference Threat Class

**Event:** Black Hat USA 2026, Las Vegas, August 1–6 (Briefings August 5–6).
**Context:** This is the first Black Hat USA at which MCP features as a named subject in
multiple briefings and the AI Summit agenda.

### "MCPwned: How Exposed AI Agents Became the Internet's New Recon Toy"

A scheduled Briefings talk documenting adversary reconnaissance against AI infrastructure,
with a specific MCP component:

- A purpose-built AI honeypot simulated 16 LLM/AI infrastructure personas across 16 ports.
- In a 48-hour window, the honeypot captured **3,993 requests from 327 unique source IPs**,
  including **155 MCP probes** and 344 AI API key probes.
- What emerged is a repeatable playbook: LiteLLM model-registration abuse, **MCP resource
  enumeration**, framework-aware credential brute-forcing, and coordinated scanning for exposed
  local inference services.
- The talk establishes exposed MCP servers as an active internet reconnaissance target —
  attackers are scanning for open MCP endpoints alongside exposed OpenAI proxy ports.

**Catalog relevance:** Our 19 approved servers are all vendor-operated HTTPS endpoints gated
behind OAuth/PAT authentication. Unauthenticated MCP resource enumeration (the documented
attack pattern) does not apply to auth-gated remote-HTTP endpoints. This is the strongest
external confirmation yet that our authentication requirement is a structural defense, not a
nice-to-have.

[[Black Hat USA 2026 Briefings]](https://blackhat.com/us-26/briefings.html)
[[Decryption Digest AI Security Briefings summary]](https://www.decryptiondigest.com/blog/black-hat-2026-briefings-schedule-ai-security-talks)

### Runlayer at Black Hat

Runlayer is present at Black Hat USA 2026 with private executive briefings (Four Seasons) and
a Supercar Track Day at SpeedVegas on August 5, signaling that enterprise MCP governance is
now being marketed at the security-buyer level — not just the DevOps or platform-engineering
level. This is a market-maturity signal.

---

## 4. Runlayer: AARM Conformance + 1Password Partnership

Two materially new Runlayer developments captured for the first time:

### AARM Extended Conformance (R1–R9)

**AARM** (Agent Authorization and Risk Model) is an open specification backed by Vanta and
donated to the Cloud Security Alliance. Runlayer is one of only **three companies** to have
achieved AARM Extended Conformance (alongside Noma Security and Formal), verified by AARM
Author Herman Errico in April 2026.

Conformance covers: MCP gateway proxying with real-time policy enforcement, threat detection,
audit logging, and least-privilege credential scoping. The AARM framework independently
validates the `discovered != approved != enabled` boundary — a third external framework (after
NSA and OWASP MCP Top 10) to do so.

[[Runlayer AARM announcement]](https://www.runlayer.com/blog/runlayer-and-aarm-partner-to-secure-enterprise-agents)
[[AARM builder listing]](https://aarm.dev/builders/runlayer)
[[Vanta donates AARM to CSA]](https://www.vanta.com/resources/vanta-donates-aarm-to-csa)

### Runlayer + 1Password: Secure Credential Injection

Runlayer now integrates 1Password for credential injection into agent sessions. Instead of
embedding raw API keys in MCP server config, operators enter a `op://vault/item/field`
reference; Runlayer resolves the secret at connection time from the 1Password vault with
real-time retrieval and full audit logging. The integration extends to OAuth client secrets
and refresh tokens via Runlayer's delegation flow.

**Catalog relevance:** This is exactly what our schema models: `required_secrets` stores
*names* (e.g. `"HUBSPOT_API_KEY"`), never values. The Runlayer + 1Password pattern is a
production implementation of secret-name-only catalog design. It confirms the approach and
gives operators a concrete runtime path without any catalog schema change needed.

[[Secure MCP credentials with 1Password and Runlayer]](https://1password.com/blog/secure-mcp-credentials-1password-runlayer)
[[1Password Unified Access announcement]](https://1password.com/press/2026/mar/1password-unified-access)

---

## 5. HubSpot MCP: Recent Updates (Leads Access Added)

The HubSpot remote MCP server recently added **Leads record read access** as part of an
ongoing series of capability updates since GA (April 13, 2026). The server currently supports:

- CRM: contacts, companies, deals, tickets, line items, quotes, invoices, orders, carts,
  products, subscriptions, segments (lists), and now **Leads** (read).
- Marketing: campaigns, landing pages (read + create), blog posts, site pages, marketing events.
- Write access on core CRM objects.

**Status:** Still confirmed as `#1 curate priority` for the next `subregistry-curate` run.
The server uses OAuth 2.1 + PKCE (no Dynamic Client Registration — use CIMD instead per the
new spec). One-click Claude connector is live. Auth path is clear.

[[HubSpot MCP GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot MCP developer page]](https://developers.hubspot.com/ai-tools/mcp)
[[HubSpot updates to Claude connector]](https://community.hubspot.com/t/updates-to-hubspot-connector-for-claude-remote-mcp-server/154482)

---

## 6. CIMD Adoption: Uneven but Moving

DCR (Dynamic Client Registration) was deprecated in the 2026-07-28 spec; CIMD (Client ID
Metadata Documents, SEP-991) is the replacement. Status as of August 1, 2026:

- **Stable:** SEP-991 stable as of July 20, 2026; Anthropic + Microsoft + Okta as launch
  integrators; Claude beta support for Team and Enterprise plans.
- **MCP Python SDK:** added minimal client-side CIMD support in v1.23.0; server-side
  unimplemented (open issue against FastMCP as well).
- **Ecosystem:** WorkOS, Datawiza, Scalekit, Descope, Stytch all published CIMD guides post-spec.
  GitLab has an open issue to implement CIMD for their MCP authorization flow.
- **Gap:** Support remains uneven. Our OAuth-gated catalog vendors (Atlassian, GitHub, Slack,
  Stripe, Supabase, Sentry, Asana, Linear, Vercel, HubSpot) should be assessed for CIMD
  compliance in the next `subregistry-audit` pass. DCR is formally deprecated but won't
  break existing connections for approximately 12 months.

[[CIMD at WorkOS]](https://workos.com/blog/client-id-metadata-documents-cimd-oauth-client-registration-mcp)
[[FastMCP CIMD issue]](https://github.com/PrefectHQ/fastmcp/issues/2863)
[[GitLab CIMD issue]](https://gitlab.com/gitlab-org/gitlab/-/work_items/585069)

---

## 7. Anthropic MCP Tunnels: Still Research Preview

MCP Tunnels (announced at "Code with Claude" in May 2026) remain in research preview as of
August 1, 2026. Key characteristics:

- Outbound-only encrypted tunnel — no inbound firewall rules or public exposure needed.
- Traffic flows: Claude Managed Agents → Anthropic infrastructure → Tunnel → Private MCP server.
- Depends on Cloudflare as third-party network provider; no SLA or continuity commitment.
- Runlayer has published integration guidance: [[Runlayer + MCP Tunnels]](https://www.runlayer.com/blog/anthropic-mcp-tunnels)

**Catalog relevance:** When MCP Tunnels reach GA, private-network MCP servers (currently
excluded from our catalog because they have no public HTTPS endpoint) could become catalogable
as `remotes[].type: "mcp-tunnel"` entries. This remains a roadmap item (CLAUDE.md §13 Next
actions #9) — no action until GA.

[[Anthropic MCP Tunnels docs]](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview)
[[InfoQ coverage]](https://www.infoq.com/news/2026/05/claude-mcp-tunnels/)

---

## 8. Security: Day 35 Clean Window

- **No new CVEs** affecting any of our 19 cataloged servers as of August 1, 2026.
- The most recent cataloged-server-relevant CVE was CVE-2026-66012 (SiYuan, July 31; desktop
  app, not in catalog).
- **Black Hat USA 2026** (August 5–6 Briefings) will surface new research. The "MCPwned"
  talk is the most catalog-relevant; expect post-conference disclosure of findings.
- All 19 catalog entries remain `approved`/`public`. Auth-gated + remote-HTTP remains the
  structural defense against all documented attack classes (SSRF, credential scan, MCP
  enumeration, supply-chain worm).

[[Practical DevSecOps MCP Security Statistics 2026]](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
[[Authzed Timeline of MCP Breaches]](https://authzed.com/blog/timeline-mcp-breaches)

---

## 9. Catalog Hooks — Flags and Next Actions

| Server | Finding | Action |
|---|---|---|
| All 19 entries | SEP-2127 WG closes Aug 14 | After Aug 14: run `subregistry-audit` to poll `/.well-known/mcp.json` |
| OAuth-gated entries (Atlassian, GitHub, Slack, Stripe, Supabase, Sentry, Asana, Linear, Vercel) | CIMD replacing DCR; audit pending | Include in next audit pass |
| All TS-SDK vendors | CVE-2026-25536 TS SDK audit still pending (≥v1.26.0 or v2) | Include in next audit pass |
| `com.aws/mcp` | AWS Agent Registry namespace migration Aug 6 — our AWS MCP Server is unaffected | Monitor for GA (still Preview) |
| None | HubSpot #1 curate priority confirmed | Run `subregistry-curate` next |

**No immediate catalog demotions.** All 19 entries remain `approved`/`public`.

---

## 10. Ordered Next Actions (unchanged from July 31, re-confirmed)

1. **`subregistry-curate`:** HubSpot (`mcp.hubspot.com`; OAuth 2.1 + PKCE; Leads access now
   confirmed; one-click Claude connector; #1 priority). Also assess Intercom, Zapier.
2. **`subregistry-audit`:** Post-Aug-14, add `/.well-known/mcp.json` probe to all 19 servers.
   Also verify TS SDK ≥1.26.0 / v2 and CIMD compliance for OAuth-gated vendors.
3. **`subregistry-deploy`:** Seed the 8 post-June-15 servers into the live DB
   (Stripe, Vercel, Asana, Webflow, Exa, Context7, AWS Knowledge MCP, AWS MCP Server).
4. **Track MCP Tunnels GA** — when released, assess `mcp-tunnel` endpoint type for catalog schema.
5. **Watch Black Hat 2026 disclosures** (August 5–6 Briefings) for any findings affecting
   cataloged vendor endpoints.

---

*Report produced by the MCP Sub-Registry autonomous research routine. All external claims cited. Next scheduled run: 2026-08-02.*

# MCP Ecosystem Update — 2026-06-19

Daily research pass. Covers developments since the June 18 report
([2026-06-18-mcp-ecosystem-update.md](./2026-06-18-mcp-ecosystem-update.md)).
Focus: Miasma Wave 3 (Mastra npm supply chain attack), SSRF findings across the MCP
server fleet, Agentjacking full details and catalog implications, MCP Server Cards /
SEP-2127 status, registry scale stats, and CVE-2026-25536 audit follow-through.
All external claims are cited.

---

## 1. Miasma Wave 3 — Mastra AI npm supply chain attack (June 17, 2026)

**Most critical development since the June 18 report. Miasma has now struck three distinct npm
ecosystems in 17 days.**

On June 17, 2026, an attacker compromised the `@mastra` npm organization and mass-published
**144 malicious package versions in an 88-minute window**, exposing packages with a combined
weekly download count exceeding 1.1 million.
[[SC Media brief]](https://www.scworld.com/brief/mastra-npm-packages-compromised-in-easy-day-js-supply-chain-attack)
[[StepSecurity technical analysis]](https://www.stepsecurity.io/blog/mastra-npm-packages-compromised-using-easy-day-js)
[[OX Security blog]](https://www.ox.security/blog/easy-day-js-supply-chain-attack-hits-mastra-ai-in-npm/)
[[Microsoft Security Blog (June 17)]](https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/)

### Attack method

The vector was a typosquatted package called **`easy-day-js`** — engineered to impersonate the
legitimate `dayjs` date library (same author name, homepage, repo URL, license, and version
numbers). An attacker compromised a former Mastra contributor account (`ehindero`) whose
npm scope access was never revoked, then silently injected `easy-day-js` as a dependency
across 140+ published packages.
[[Phoenix Security deep dive]](https://phoenix.security/easy-day-js-mastra-npm-supply-chain-typosquat-rat-2026/)

### Payload: cross-platform RAT

The second-stage payload is a full **Remote Access Trojan** that:

- Installs OS-level login persistence on Windows, macOS, and Linux
- Inventories **166 cryptocurrency wallet browser extensions**
- Harvests browser history from Chrome, Brave, and Edge
- Opens a remote module-execution channel for arbitrary follow-on commands

[[Orca Security analysis]](https://orca.security/resources/blog/mastra-npm-supply-chain-attack/)
[[Rankiteo blog]](https://blog.rankiteo.io/masnpm1781699577-npm-mastra-ai-cyber-attack-june-2026/)

### Detection and remediation

Socket flagged the malicious `easy-day-js` within **six minutes** of publication.
npm has since removed the malicious versions. Any environment that installed affected
Mastra packages since June 17 should be treated as potentially compromised: rotate all
credentials, audit login persistence mechanisms, roll back to pre-attack package versions.
[[AI Weekly summary]](https://aiweekly.co/alerts/mastra-npm-supply-chain-attack-backdoors-144-packages)
[[Cloudsmith inside-look]](https://cloudsmith.com/blog/inside-the-mastra-npm-supply-chain-attack)

### Miasma wave timeline (updated)

| Date | Target | Packages / vector |
|------|--------|-------------------|
| June 1, 2026 | `@redhat-cloud-services` npm namespace | 32 packages; Phantom Gyp binding.gyp trick |
| June 3, 2026 | `@vapi-ai/server-sdk` | 4 versions compromised |
| June 17, 2026 | `@mastra` npm org | **144 packages; easy-day-js typosquat; RAT** |

[[StepSecurity Phantom Gyp analysis]](https://www.stepsecurity.io/blog/binding-gyp-npm-supply-chain-attack-spreads-like-worm)
[[Morphisec "Shai-Hulud Wave 3"]](https://www.morphisec.com/blog/its-in-your-ai-assistant-now-shai-hulud-wave-3-and-the-miasma-worm-targeting-npm/)

### Registry impact

**Our catalog is structurally immune.** All 19 approved entries are remote-HTTP MCP
servers — none delivered via npm packages. The Miasma/SANDWORM_MODE threat class
(npm worm → malicious MCP server injection) cannot affect servers cataloged by URL rather
than installed as packages. This is the strongest practical validation of the remote-HTTP-first
curation approach.

---

## 2. SSRF at scale — BlueRock Security survey of 7,000+ MCP servers

**BlueRock Security** analyzed over **7,000 MCP servers** and found **36.7% potentially
vulnerable to Server-Side Request Forgery (SSRF)**.
[[BlueRock Security — MCP fURI / Markitdown]](https://www.bluerock.io/post/mcp-furi-microsoft-markitdown-vulnerabilities)

### What was exploited

Microsoft's **MarkItDown MCP server** (85k GitHub stars) had an SSRF exploited to retrieve
**AWS IAM access keys, secret keys, and SSH keys** directly from the EC2 instance metadata
endpoint (169.254.169.254). Proof-of-concept published by BlueRock.
[[Broader context via TrueFoundry]](https://www.truefoundry.com/blog/mcp-security-issues)

### Broader stats (June 2026 aggregate)

| Metric | Figure | Source |
|--------|--------|--------|
| Servers analyzed for SSRF | 7,000+ | BlueRock Security |
| Potentially SSRF-vulnerable | 36.7% | BlueRock Security |
| MCP implementations using file-system ops (path traversal risk) | 82% of 2,614 analyzed | Adversa AI / PracticalDevSecOps |
| Implementations with code-injection API patterns | 67% | Adversa AI |
| Internet-accessible MCP services (Censys) | 12,520 | Censys / June 2026 research |
| Unauthenticated services | ~40% | Censys |

[[Adversa AI June 2026 resources]](https://adversa.ai/blog/top-mcp-security-resources-june-2026/)
[[Practical DevSecOps]](https://www.practical-devsecops.com/mcp-security-vulnerabilities/)

### Registry impact

Our remote-HTTP catalog entries are operated by vendors (Sentry, Supabase, Neon, etc.)
who are responsible for their own server-side SSRF posture. The **CVE-2026-25536 audit
follow-up** (next `subregistry-audit` pass) should also cross-check that TypeScript SDK
versions are ≥1.26.0 — fixing SDK-level data leaks often also reduces attack surface for
SSRF through component isolation.

---

## 3. Agentjacking — full details and Sentry catalog nuance (CSA June 12, 2026)

**Agentjacking** was first documented by Tenet Security and published by the Cloud Security
Alliance on **June 12, 2026**.
[[CSA Research Note]](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)
[[CISO Platform Breach Report (June 16)]](https://www.cisoplatform.com/profiles/blogs/ciso-platform-breach-report-16-june-2026-agentjacking-against-ai-)
[[GBHackers]](https://gbhackers.com/agentjacking-attack-hijacks-ai-coding-agents/)

### Mechanism

1. Attacker obtains a **Sentry DSN** — a public, write-only credential often exposed in
   browser JavaScript or GitHub search results.
2. Using only an HTTP client, attacker injects malicious prompt-injection payloads into
   Sentry error events.
3. An AI coding agent using the Sentry MCP server reads those events and executes the
   attacker's embedded instructions (RCE on the developer's machine).

The attack chain bypasses EDR, WAF, IAM, VPN, and firewalls — every action is technically
authorized. Tenet Security named this the **"Authorized Intent Chain"** pattern.

### Scale

- **2,388 organizations** exposed in controlled testing using only public Sentry APIs
- **100+ agents** acted on injected errors in testing
- Confirmed execution at Fortune 500 enterprises and independent developers
[[Decryption Digest]](https://www.decryptiondigest.com/blog/agentjacking-sentry-mcp-ai-coding-agent-attack)

Tenet disclosed findings to Sentry on June 3, 2026. Sentry acknowledged the issue and
**declined to address it at the platform level**, calling the attack class "technically not
defensible" from their side.
[[Tenet Security full report]](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/)

### Catalog implication for `com.sentry/mcp`

**No catalog action required; nuance documented here for operator awareness.**

The agentjacking attack uses the Sentry MCP server as a **trust conduit** for user-submitted
data (error events). The endpoint `https://mcp.sentry.dev/mcp` itself is correctly implemented:
it returns HTTP 401 to unauthenticated requests (verified 2026-06-16 audit) — the Clawdbot
pattern does NOT apply. The vulnerability is in the trust model: once authenticated, the MCP
server faithfully returns error events that may contain attacker-injected instructions.

**Risk framing for operators:** AI coding agents that use Sentry MCP with broad `tools/*` grants
should treat Sentry event content as **untrusted external data**, not trusted tool output.
This is an operator/agent-configuration concern, not a registry-catalog concern.
The entry remains `approved` / `public`.

---

## 4. SEP-2127 (MCP Server Cards) — June 2026 merge target likely slips

**Status:** Working Group active; June 2026 merge target appears to be slipping toward
post-RC (after July 28, 2026).

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
[[SEP-1649 issue]](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1649)
[[Go implementation library]](https://github.com/olgasafonova/mcp-servercard-go)

Key facts:
- WG led by David Soria Parra (Anthropic) + Sam Morrow Drums (GitHub); charter dated
  2026-03-26; **term ends Aug 14, 2026**
- Standard path: `/.well-known/mcp/server-card.json`
- Claude Desktop and Cursor have already shipped MCP v2.1 with Server Card support
  (April 2026), ahead of the spec merge
- Parallel IETF track: `draft-serra-mcp-discovery-uri-04` (expires Sep 2026)
- **Apify** has an open issue to update their MCP server to the hybrid ora.run + registry +
  SEP shape, suggesting broad vendor awareness
  [[Apify issue #790]](https://github.com/apify/apify-mcp-server/issues/790)

**Registry action (unchanged from prior reports):** Once SEP-2127 merges, extend
`subregistry-audit` to GET `/.well-known/mcp/server-card.json` on each cataloged server
origin and record tool count + protocol version in `verification.notes`. No schema migration needed.

---

## 5. Registry scale stats — mid-June 2026 snapshot

| Registry / source | Count | As of | Notes |
|---|---|---|---|
| Official MCP Registry (registry.modelcontextprotocol.io) | ~9,652 latest; ~28,959 versioned | May 24, 2026 | API confirmed |
| Cross-registry ecosystem tracker (Official + Glama + Smithery + mcp.so + github.com/modelcontextprotocol) | 59,312 | June 3, 2026 | [[Digital Applied tracker]](https://www.digitalapplied.com/blog/mcp-server-ecosystem-tracker-50-servers-cataloged-2026) |
| Glama | ~37,000 | mid-2026 | Auto-indexed; unvetted |
| mcp.so | ~20,222 | April 2026 | Unvetted marketplace |
| Our curated catalog | **19** | 2026-06-18 | All approved, public, remote-HTTP |

[[TrueFoundry MCP registries comparison]](https://www.truefoundry.com/blog/best-mcp-registries)
[[Agensi comparison]](https://www.agensi.io/learn/smithery-vs-glama-vs-agensi-comparison)

**Observation:** The ecosystem crossed 59k servers in aggregate; our catalog remains
disciplined at 19. The signal value of curation — the gap between "indexed" (59k) and
"trusted" (19) — continues to widen.

---

## 6. CVE-2026-25536 audit follow-up — SDK 1.26.0 patch status

As flagged in the June 18 report, this is now an open audit action:

**CVE-2026-25536** — MCP TypeScript SDK cross-client data leak. Affects SDK versions
1.10.0–1.25.3 in StreamableHTTPServerTransport deployments with multiple concurrent clients
(JSON-RPC message ID collisions route responses to the wrong client).
**Fixed in SDK 1.26.0.**
[[CVE detail via GitLab advisory]](https://advisories.gitlab.com/npm/@modelcontextprotocol/sdk/CVE-2026-25536/)
[[Tenable CVE page]](https://www.tenable.com/cve/CVE-2026-25536)
[[The Vulnerable MCP Project]](https://vulnerablemcp.info/)

**Catalog audit task (unresolved):** Cataloged vendors likely running the TypeScript SDK
include: GitHub, Slack, Notion, Cloudflare, Sentry, Linear, Figma, Neon, Supabase, Stripe,
Vercel, Webflow, Exa, Context7. All should be running ≥1.26.0 to be clear of this CVE.
This is a **next `subregistry-audit` pass** item.

---

## 7. MCP Tunnels — still research preview

Anthropic's **MCP Tunnels** (announced May 19, 2026 at "Code with Claude" London) remain
in **research preview / request access** mode — not yet generally available.
[[Anthropic MCP Tunnels overview — The New Stack]](https://thenewstack.io/anthropic-mcp-tunnels-sandboxes/)
[[InfoQ announcement]](https://www.infoq.com/news/2026/05/claude-mcp-tunnels/)

MCP Tunnels allow agents to reach MCP servers inside private networks without inbound
firewall rules (single outbound connection, end-to-end encrypted). The companion
**self-hosted sandboxes** feature is in public beta.

**Registry action:** No action until GA. At GA, consider tracking
`remotes[].type: "mcp-tunnel"` as a new endpoint archetype for private-network servers.
This was already noted in CLAUDE.md §13 next actions.

---

## 8. HubSpot MCP — confirmed GA, ready for next curate run

- **Endpoint:** `https://mcp.hubspot.com` (confirmed live)
- **Auth:** OAuth 2.1 + PKCE
- **GA date:** April 13, 2026
- Write capabilities, Activity history, marketing content objects, CRM data
[[HubSpot remote MCP GA changelog]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
[[HubSpot MCP docs]](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/integrate-with-the-remote-hubspot-mcp-server)

**Recommendation:** HubSpot is the primary target for the next `subregistry-curate` run
(Comms & support group, as planned in §13). Endpoint is confirmed live and GA.

---

## 9. Spec RC — no new changes since June 18

The MCP 2026-07-28 RC (locked May 21, 2026) has no additional changes since the June 18
detailed report. **39 days to final spec publication (July 28).**

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
[[MCP 2026 roadmap]](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)

Key items still pending for gateway operators before July 28:
1. Transport validation updated for stateless protocol (no session IDs)
2. Mandatory `Mcp-Method` / `Mcp-Name` header support
3. Vendor SDK confirmation that ≥1.26.0 shipped with RC transport support (combines
   CVE-2026-25536 patch + RC transport changes)

---

## Catalog summary

No catalog entries require immediate status changes from today's research.

| Server | Action | Reason |
|--------|--------|--------|
| `com.sentry/mcp` | No change; operator note added here | Agentjacking via event-injection uses Sentry MCP as trust conduit; endpoint is correctly auth-gated; risk is operator/agent config, not catalog curation |
| All TypeScript SDK vendors | **Flag for next audit** | CVE-2026-25536 — verify running SDK ≥1.26.0 |
| HubSpot MCP | **Queue for next curate run** | GA confirmed; endpoint live; OAuth 2.1 + PKCE |

All 19 current entries remain `approved` / `public` / remote-HTTP. No demotions.

---

## Threat landscape summary (cumulative — June 2026)

| Threat | Class | Status | Our exposure |
|--------|-------|--------|-------------|
| SANDWORM_MODE (Feb 16/June 2026) | npm worm → MCP config injection | Active | None — remote-HTTP catalog |
| Miasma Wave 1-3 (June 1/3/17) | npm supply chain worm → RAT | Active, escalating | None — remote-HTTP catalog |
| Agentjacking via Sentry events (June 12) | Trust-conduit injection via MCP server data | Active; Sentry won't fix | Operator risk if using Sentry MCP; endpoint itself is auth-gated |
| OX Security STDIO RCE (April 2026) | 200k+ instances; STDIO transport design flaw | Ongoing; Anthropic declined protocol change | Immune — no STDIO in catalog |
| CVE-2026-25536 | SDK cross-client data leak (TypeScript ≤1.25.3) | Patched in 1.26.0 | Audit pass pending |
| BlueRock SSRF (2026) | 36.7% of 7k MCP servers SSRF-vulnerable | Ongoing research | Vendor responsibility; not a catalog-layer fix |
| CVE-2026-27825/27826 MCPwnfluence | CVSS 9.1 RCE + SSRF in mcp-atlassian (patched 0.17.0) | Resolved | Not in our catalog |

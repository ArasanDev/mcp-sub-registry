# MCP Ecosystem Update — 2026-06-24

Daily research pass. Covers developments since the June 23 report
([2026-06-23-mcp-ecosystem-update.md](./2026-06-23-mcp-ecosystem-update.md)).
Focus: Registry scale signals (Glama batch-indexes to 47,579; PulseMCP 19,410+); new
quantitative security research on MCP npm ecosystem concentration risk; GitGuardian's
24,008-secret MCP config exposure finding; UNC1069/Axios WAVESHAPER.V2 campaign and its
MCP config-exfiltration component; MCP Dev Summit Shanghai announced; spec RC countdown 34
days to July 28.

All external claims cited with source URLs.

---

## 1. Registry Scale: Glama 47,579 / PulseMCP 19,410+

### Glama

Glama's MCP server index stands at **47,527–47,579** as of the June 23 indexing run — up
from 44,392 recorded on June 22. That is an increase of roughly **3,100–3,200 servers in
two days**, consistent with another large batch-indexing event (the previous such event
added ~5,868 on June 21–22). Glama also now lists **6,230 MCP connectors** and **290,691
MCP tools** indexed.

[[Glama MCP servers]](https://glama.ai/mcp/servers)

### PulseMCP

PulseMCP's daily-updated directory now reports **19,410+ servers** in the full catalog
(up from ~19,240 on June 23), with **19,240+ remote-typed servers** as a sub-filter.

[[PulseMCP directory]](https://www.pulsemcp.com/servers)

### Trust gap persists

Cumulative cross-registry estimate (Official MCP Registry + Glama + Smithery + PulseMCP +
mcp.so + GitHub): **~72,000–73,000** indexed MCP servers. Our curated set: **19 approved**.
The sub-registry's value proposition — 19 trustworthy vs. 70k+ unvetted — continues to
widen with each batch-indexing event.

---

## 2. MCP npm Ecosystem Concentration Risk (Security Boulevard, June 2026)

Security Boulevard published a practitioner study on the MCP npm package ecosystem. The
headline stat: **973 MCP-tagged packages on npm, 71% single-maintainer, 56% published in
the last 30 days, 25% have no linked source repository**.

Key findings from the study:

- **Concentration risk:** 71% single-maintainer packages means the entire attack surface of
  those packages rests on one account's security hygiene. Social engineering a single
  maintainer (as UNC1069 did with Axios — see §3) is sufficient to compromise the package.
- **Newness:** 56% of the MCP npm ecosystem is less than 30 days old. Packages this new have
  minimal community review and no established security track record.
- **No source repo:** 25% of packages have no linked source repository, making provenance
  verification impossible.
- **Registry failures:** 9 of 11 MCP registries tested **failed to detect malicious uploads**
  in OX Security's earlier PoC testing (April 2026).
- **STDIO default:** every STDIO-typed MCP package can execute OS commands on install. The
  STDIO transport passes configuration parameters directly into OS command execution.
- **Secrets sprawl (GitGuardian crossover):** MCP config files store API keys, database
  credentials, and OAuth tokens in plaintext JSON; many quickstart guides instruct users to
  embed credentials in config — normalizing the insecure pattern.
- **NVD: 133 CVEs** now mentioning "prompt injection"; 78% rated CRITICAL or HIGH.

[[Security Boulevard — 973 MCP Packages]](https://securityboulevard.com/2026/06/973-mcp-packages-71-single-maintainer-a-practitioners-guide-to-ai-developer-security/)

### Catalog implication — structural immunity confirmed

Our catalog contains **zero npm/STDIO packages**; all 19 entries are remote-HTTP endpoints.
This is structural immunity to the single-maintainer, newness, and STDIO-RCE risks documented
above. The concentration-risk finding reinforces keeping the catalog's current policy of
approving only vendor-operated remote endpoints with known ownership and auth gates.

---

## 3. GitGuardian: 24,008 MCP Config Secrets on Public GitHub

GitGuardian's 2026 State of Secrets Sprawl report quantifies a previously under-reported
attack surface: **24,008 unique secrets found in MCP configuration files on public GitHub,
2,117 confirmed live at scan time**. AI-service credential leaks surged **81% year-over-year**,
with 29 million total secrets on public GitHub in 2026.

The root cause: popular MCP quickstart documentation recommends embedding API keys, database
credentials, and OAuth tokens directly in plaintext config JSON (`.claude/config.json`,
`mcp_settings.json`, etc.) rather than using vault references or environment injection.

GitGuardian's recommended enterprise governance framework:
1. Authenticate via remote OAuth with scoped tokens or vault-issued dynamic credentials.
2. Inject credentials via environment variables or vault references — never embed in config.
3. Detect exposure via continuous scanning of config files and GitHub repositories.

[[GitGuardian State of Secrets Sprawl 2026]](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026)
[[GitGuardian — AI-Service Leaks 81% Surge blog]](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)
[[GitGuardian MCP Governance Framework]](https://blog.gitguardian.com/mcp-governance-framework/)

### Catalog implication

Our catalog stores **secret names, never secret values** (the hard boundary in CLAUDE.md §3).
The `requiredSecrets` / `config` fields in our schema record what credentials a server needs,
not what credentials any operator holds. This is exactly the pattern GitGuardian recommends.
No catalog change needed; this finding validates the schema design.

---

## 4. UNC1069 / Axios WAVESHAPER.V2 — MCP Config Exfiltration Component

Previously documented as a general npm supply chain incident; now capturing a detail specific
to the registry boundary: the **Axios npm supply chain attack (March 31, 2026)** by North
Korea-nexus threat actor UNC1069 included MCP-specific targeting.

### What happened

On March 31, 2026, UNC1069 social-engineered the real `axios` npm maintainer and published
two malicious versions (`1.14.1` and `0.30.4`). These were live for ~3 hours and delivered
the **WAVESHAPER.V2** backdoor to macOS, Windows, and Linux. The malware:

- Exfiltrated environment variables, cloud access keys, and GitHub PATs.
- **Enumerated MCP configuration files** for Claude Code, Cursor, Windsurf, and VS Code
  Continue (Lorikeet Security's analysis).
- **Injected rogue server definitions** into those config files, turning the AI assistant
  into an ongoing exfiltration channel after initial infection.

This is the first documented case of a North Korea-nexus actor specifically targeting MCP
config files as a persistence and exfiltration vector.

[[Google Cloud GTIG — UNC1069 Axios campaign]](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package)
[[The Hacker News — UNC1069 social engineering]](https://thehackernews.com/2026/04/unc1069-social-engineering-of-axios.html)
[[Tenable FAQ — Axios UNC1069]](https://www.tenable.com/blog/faq-about-the-axios-npm-supply-chain-attack-by-north-korea-nexus-threat-actor-unc1069)
[[CSA Labs Research Note]](https://labs.cloudsecurityalliance.org/research/csa-research-note-axios-npm-supply-chain-unc1069-20260401-cs/)

### Catalog implication

This attack targets **MCP client config files** (where server URLs are registered), not the
servers themselves. Our catalog surfaces endpoint URLs for operators to configure — the
catalog itself is not an attack surface. However, this confirms the broader threat model:
rogue entries injected into client configs can masquerade as legitimate catalog servers.

The sub-registry's role — providing a trustworthy, stable reference of approved server URLs
that operators can compare against their running configs — becomes more important, not less,
as this attack class matures.

---

## 5. MCP Dev Summit Shanghai / AGNTCon + MCPCon China

A new AAIF event has been announced: **AGNTCon + MCPCon China** (MCP Dev Summit Shanghai),
organized under the Linux Foundation's lfopensource.cn umbrella.

Status as of June 24, 2026:
- CFP open; closes May 29, 2026 CST (already closed).
- CFP notifications: July 6, 2026.
- Schedule announcement: July 8, 2026.
- Exact event dates not published in available search results; event likely Q3 2026.

This follows the AAIF's India (Bengaluru, Mumbai) and North America (NYC, April 2–3) dev
summits. The global expansion of AAIF events into China is a signal of MCP protocol
adoption in Asian enterprise markets.

[[AGNTCon + MCPCon China]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/)
[[AAIF blog — MCP is now enterprise infrastructure]](https://aaif.io/blog/mcp-is-now-enterprise-infrastructure-everything-that-happened-at-mcp-dev-summit-north-america-2026/)

---

## 6. New Security Resources Published

Two new resources consolidate the MCP threat landscape:

### Adversa AI — Top MCP Security Resources June 2026

Adversa AI published a roundup post compiling the key CVEs, frameworks, tools, and threat
intelligence from the MCP security space through June 2026. Complements their existing
MCP Security TOP 25 vulnerability classification.

[[Adversa AI — Top MCP Security Resources June 2026]](https://adversa.ai/blog/top-mcp-security-resources-june-2026/)

### Authzed — Timeline of MCP Security Breaches

Authzed published a timestamped timeline of MCP security incidents, providing a historical
index that complements the Vulnerable MCP Project (vulnerablemcp.info) CVE database. Useful
reference for auditing the gap between discovery date and catalog re-verification.

[[Authzed — Timeline of MCP Security Breaches]](https://authzed.com/blog/timeline-mcp-breaches)

### PipeLab — State of MCP Security 2026

A comprehensive cross-incident analysis of attack patterns and defense coverage across the
known MCP vulnerability classes.

[[PipeLab — State of MCP Security 2026]](https://pipelab.org/blog/state-of-mcp-security-2026/)

---

## 7. Spec RC Countdown: 34 Days

The **2026-07-28 MCP specification RC** final ships July 28, 2026 — **34 days from today**.
The ten-week validation window for Tier-1 SDK maintainers and client implementers is active;
no new breaking changes beyond what was documented in the June 18–23 reports.

No catalog schema change required. The stateless protocol core is compatible with our stored
endpoint metadata model.

[[MCP RC blog post]](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)

---

## 8. SEP-2127 (MCP Server Cards) — No Merge Yet

SEP-2127 remains in Draft status; the Working Group term runs to August 14, 2026. CFP
notifications for the Shanghai event (July 6) and the spec RC ship date (July 28) both
precede the WG term end — suggesting Server Cards may land post-RC as previously flagged.
Claude Desktop and Cursor already ship `/.well-known/mcp/server-card.json` support (April
2026). Once merged, `subregistry-audit` can query this endpoint to verify tool counts and
protocol version for cataloged servers.

[[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)

---

## 9. Catalog Hooks — No Action Required

Checked all 19 approved catalog entries against today's findings:

| Finding | Catalog impact |
|---|---|
| npm single-maintainer risk | All catalog entries are remote HTTP endpoints (zero STDIO/npm packages) — immune |
| GitGuardian 24,008 secrets | Schema already stores secret names only; `requiredSecrets` field is correct |
| UNC1069/WAVESHAPER MCP config targeting | Attacks MCP client configs, not server endpoints; no catalog change |
| Glama/PulseMCP count increase | Discovery-tier growth; does not affect approved set |
| Spec RC countdown 34 days | No catalog schema change required |
| SEP-2127 | No merge yet; no action until spec lands |

**Pending from prior reports (still open):**
- CVE-2026-25536 (MCP TypeScript SDK data leak, patched ≥1.26.0): audit pass to verify all
  TypeScript-SDK-based vendors in catalog run ≥1.26.0. Target: next `subregistry-audit` run.
- SSE-typed entries: audit for Streamable HTTP migration. Asana already updated (v2/mcp).
- DNS rebinding CVE-2026-11624: verify all cataloged vendors run MCP server ≥v0.25.

---

## Summary

| Metric | Value | Change |
|---|---|---|
| Glama indexed servers | ~47,579 | +3,187 since June 22 |
| PulseMCP servers | 19,410+ | +170 since June 23 |
| Cross-registry estimate | ~72–73k | (steady) |
| Our approved catalog | 19 | unchanged |
| Days to spec RC final | 34 | −1 |
| MCP npm packages (Security Boulevard) | 973 | new research |
| Single-maintainer % | 71% | new data |
| MCP config secrets on public GitHub (GitGuardian) | 24,008 | new data |

**Key new signal:** The Security Boulevard + GitGuardian research quantifies the STDIO/npm
attack surface in detail. Our remote-HTTP-only catalog is structurally immune to all measured
risk vectors (STDIO RCE, single-maintainer compromise, config-file secrets sprawl). The
UNC1069/Axios campaign confirms adversaries are actively targeting MCP config files —
reinforcing the sub-registry's role as a trustworthy reference for what URLs belong in those
configs.

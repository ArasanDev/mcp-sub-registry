# MCP Ecosystem Update — 2026-11-26

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since the 2026-11-25 report. 1-day window (Nov 25–26).
**Today's date:** 2026-11-26

---

## Summary

Three major findings today: (1) **GitHub MCP Server has advanced to v2.3.0 (Nov 24)** — the
"winget-only / unconfirmed v2.0.3" flag in §13 is now closed, and three additional unreported
releases (v2.1.0, v2.2.0, v2.3.0) need catalog audit; (2) security — two Python SDK CVEs now
confirmed with fixed versions after weeks flagged as "NVD-unconfirmed"; a new Microsoft MCP
Gateway EoP (CVSS 8.8) from November Patch Tuesday; (3) **MCP release cadence formalized** —
official 6-month cycle blog published Nov 11; next spec 2027-03-30.

Also: PulseMCP "updated daily" label has returned (ingestion appears resumed after Oct pause);
MCPCon Nairobi recap still absent (Day 6, longest gap in AAIF history); Skills Over MCP WG
SEP-2640 confirmed Final.

**Headline:** CVE-2026-59951 and CVE-2026-109527 (Python SDK DoS class) **confirmed with
fixed versions** — audit gate for Python SDK vendors can now be executed with confidence.
CVE-2026-109492 (Microsoft MCP Gateway EoP, CVSS 8.8, Nov Patch Tuesday) surfaces today as
a new finding; not in catalog. Day 99+ clean window holds for all 19 catalog servers.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Official MCP Registry** | ~65,580 (Stork.AI) | Nov 16, 2026 | Most precise recent snapshot. [[stork.ai]](https://www.stork.ai/blog/mcp-registry-endpoints-checked-november-2026.md) |
| **Official MCP Registry (est.)** | ~67,000–68,000 (est.) | Nov 26, 2026 | Extrapolated from Nov 16 figure at ~3,166/week. API Tracker Nov 1 snapshot: 53,075 registry records (different counting method — includes all versions). [[apitracker.io]](https://apitracker.io/mcp-statistics/2026-11-01) |
| **Glama** | ~127,500–128,500 (est.) | Nov 26, 2026 | Homepage still cached at 122,052 (undated); Oct 28 confirmed 111,899 → ~530 net new/day. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,500–21,980 (est.) | Nov 2026 | Ingestion appears **resumed** — page titles now show "updated daily" label (were static late Oct). [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy shutdown Oct 31; smithery.ai directory stays live. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom + Zendesk Bridge curate queue remains. |

---

## Security

### Python SDK CVEs CONFIRMED — CVE-2026-59951 and CVE-2026-109527

Both CVEs were previously flagged as "Debian tracker entries, NVD-unconfirmed" (since Nov 21
report). They are **now indexed on Vulners / OSV / OpenCVE** with confirmed affected ranges and
fixed versions.

**CVE-2026-59951 — Stateful Streamable HTTP Session Accumulation (DoS)**

- **CWE:** Uncontrolled Resource Consumption (CWE-400)
- **Affected:** `mcp` ≥1.8.0 <1.30.0 AND ≥2.0.0 <2.2.0.
  Stateless HTTP, stdio, and SSE transports are **not** affected.
- **Impact:** Stateful Streamable HTTP transport retains session entries indefinitely with no
  idle expiration or aggregate session-count limit → memory exhaustion → service denial.
- **Fixed:** `mcp>=1.30.0` (1.x line) or `mcp>=2.2.0` (2.x line).
- **CVSS:** 6.9 (CVSS 4.0, OSV); 7.5 (CVSS 3.1, Red Hat).
- **NVD status:** Listed on OSV, Vulners, OpenCVE, Vulnrichment as of ~Nov 25–26.
- [[OSV]](https://osv.dev/vulnerability/CVE-2026-59951) · [[Rapid7/Vulners]](https://vulners.com/rapid7/RAPID7:CVE-2026-59951) · [[OpenCVE]](https://app.opencve.io/cve/CVE-2026-59951) · [[ThreatFrontier]](https://threatfrontier.com/articles/mcp-python-sdk-oauth-credential-theft-issuer-fix)

**CVE-2026-109527 — HTTP/OAuth Unbounded Request Bodies (DoS)**

- **CWE:** Allocation of Resources Without Limits or Throttling (CWE-770)
- **Affected:** `mcp` <1.29.1 AND ≥2.0.0a1 <2.1.0 (some sources cite slightly different
  ranges; conservative gate: treat anything below 1.30.0/2.2.0 as affected).
- **Impact:** HTTP and OAuth endpoints accept unbounded request bodies → memory exhaustion.
- **Fixed:** `mcp>=1.29.1` (or `>=1.30.0` per the broader cluster fix); `mcp>=2.1.0` (or
  `>=2.2.0` to also cover CVE-2026-59951).
- **CVSS:** 7.5 (CVSS 3.1, Mend).
- **NVD status:** Referenced in Vulnrichment (CISA) and Vulners.
- [[Vulners/Vulnrichment]](https://vulners.com/vulnrichment/VULNRICHMENT:CVE-2026-109527) · [[Mend/Vulners]](https://vulners.com/mend/MEND:CVE-2026-109527) · [[OpenCVE]](https://app.opencve.io/cve/CVE-2026-109527)

**Catalog impact:** None — our 19 entries are remote-HTTP *servers* operated by third-party
vendors (Anthropic, Atlassian, Stripe, GitHub, etc.). They do not ship the Python SDK as a
transport server in the affected mode. However, the **`subregistry-audit` gate for Python SDK
vendors** can now be executed: vendors using the Python SDK must be on `mcp>=2.3.0` (latest
Oct 2, 2026) or `mcp>=1.30.0` (1.x). This confirms and completes the previously flagged
"unconfirmed" action item.

---

### NEW: CVE-2026-109492 — Microsoft MCP Gateway Elevation of Privilege (CVSS 8.8)

- **Published:** ~November 10, 2026 (Microsoft November Patch Tuesday).
- **Affected product:** Microsoft MCP Gateway (official Microsoft product, not in our catalog).
- **CWE:** Authorization Bypass Through User-Controlled Key (CWE-639).
- **Impact:** An authenticated attacker with network access can send specially crafted requests
  to reach another user's resources in a multi-tenant MCP Gateway deployment (tenant isolation
  bypass / IDOR-class vulnerability).
- **Severity:** Important, CVSS 3.1 = **8.8** (High). No user interaction required; network
  attack vector; low-privilege attacker sufficient.
- **Fixed:** Version 1.0.0 (per MSRC advisory; fix for all earlier versions).
- **Exploitation:** Not publicly exploited as of Nov 26; not on CISA KEV.
- **Catalog impact:** None — Microsoft MCP Gateway is not a catalog entry. This is a
  multi-tenant gateway runtime product, not a discoverable/approvable MCP server endpoint.
  **Gateway operators** using Microsoft MCP Gateway should apply the Nov Patch Tuesday fix.
- [[MSRC]](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-109492) · [[BleepingComputer Patch Tuesday]](https://www.bleepingcomputer.com/news/microsoft/microsoft-november-2026-patch-tuesday-fixes-1-235-flaws-outlook-zero-day/) · [[Strix.ai]](https://www.strix.ai/cve/CVE-2026-109492) · [[FixLane]](https://fixlane.poparecon.com/incidents/2397)

---

### CVE-2026-134817 (mcp-server-kubernetes) and CVE-2026-125271 (AWS API MCP) — Confirmed

Previously flagged as "unconfirmed" in Nov 21 report. Both are now confirmed from vendor sources.

**CVE-2026-134817 — mcp-server-kubernetes Argument Injection (CVSS 7.1)**

- Remote MCP clients can pass dash-prefixed argument values to inject `kubectl` flags,
  enabling host filesystem reads.
- Fixed in `mcp-server-kubernetes` v4.2.0.
- Not in catalog. STDIO/agent-side tool.
- [[hol.org]](https://hol.org/guard/security/campaigns/cve-2026-134817-mcp-server-kubernetes-argument-injection-file-read) · [[Strix.ai]](https://www.strix.ai/cve/CVE-2026-134817)

**CVE-2026-125271 — AWS API MCP Server Policy Bypass**

- Incorrect operation name normalization allows certain operation names to bypass deny rules.
- Affects AWS API MCP Server (`aws-api-mcp-server`) >=0.2.13 <1.5.1.
- Fixed in v1.5.1; no workaround.
- **Not the same product as `com.aws/mcp`** (AWS MCP Server for agents / Agent Toolkit for
  AWS). Our catalog entry is unaffected.
- [[AWS Security Bulletins]](https://aws.amazon.com/security/security-bulletins/2026-176-aws/)

---

### Additional Community CVEs (Nov 25–26 Window)

New items identified today; all are STDIO/local/client tools — no catalog action needed.

| CVE | Component | CVSS | Type | Catalog status |
|-----|-----------|------|------|----------------|
| CVE-2026-134492 | `mcp-server-fetch` (Anthropic reference) | 2.3 LOW | SSRF via IPv6 site-local bypass | Not in catalog (STDIO reference impl.) |
| CVE-2026-135614 | `ecs-mcp-server` (Amazon) <0.1.36 | 5.5 | Sensitive data redaction bypass | Not in catalog |
| CVE-2026-75612 | `yt-mcp` <1.18.1 | 7.5 | Arbitrary file read | Not in catalog |
| CVE-2026-76807 | Todoist MCP Server | 9.3 Critical | Localhost no-auth | Not in catalog |

Sources: [[FixLane roundup]](https://fixlane.poparecon.com/guides/mcp-server-vulnerabilities-2026) · [[Strix.ai CVE-2026-135614]](https://www.strix.ai/cve/CVE-2026-135614) · [[VulDB CVE-2026-134492]](https://vuldb.com/vuln/442381)

**CVE-2026-134492 notable context:** This is Anthropic's official `mcp-server-fetch` reference
implementation. The SSRF is in the address check that is supposed to block non-public addresses;
it treats IPv6 site-local addresses (fec0::/10) as public. Very low CVSS (2.3) because practical
impact is limited — most hosts have no route to that range. Fixed in 2026.11.11 version. This is
a STDIO tool, not a remote-HTTP endpoint, and is structurally immune in our catalog model.

---

### CVE-2026-123272 — mcp-go OAuth Resource Confusion (Updated)

No new exploits or patches since the Nov 5 disclosure. mcp-go v1.2.1 fix confirmed as complete.
Red Hat tracking advisory RHSA-2026:95406. CVSS 3.1 = 8.0 (High); CVSS 4.0 = 5.1.
Affected range: mcp-go ≥v0.48.0 <v1.2.1. Gateway operators using mcp-go as a client should
verify they are on v1.2.1.
[[vuldb]](https://vuldb.com/vuln/431624) · [[Vulners NVD]](https://vulners.com/nvd/NVD:CVE-2026-123272)

---

### Security Window Summary

**Day 99+** clean for all 19 cataloged remote-HTTP servers. No cataloged server has been named
in any active CVE, incident, or security advisory. The remote-HTTP + OAuth-gated catalog model
continues to provide structural immunity against:
- All STDIO/package-install attack classes (npm worms, PyPI supply chain)
- All argument injection / path traversal on local server processes
- Python SDK transport-layer DoS (CVEs confirmed today) — vendors operate the server
- mcp-go client OAuth confusion (client library, not catalog servers)

---

## Governance & Events

### MCPCon Nairobi Recap — Day 6 Still Pending

The MCP Dev Summit Nairobi (Nov 19–20, 2026) concluded 6 days ago. No AAIF blog post or
official recap has been published as of Nov 26. This is now the longest post-event gap in AAIF
MCP Dev Summit history.

What is confirmed from pre-event sources and livestream listings:
- Event ran Nov 19–20, 2026 at Nairobi, Kenya (Linux Foundation event page confirmed).
- Gates Foundation was a Diamond Sponsor.
- Two-day program covered agent architecture + orchestration, infrastructure, and security.
- An attendee reception was held Thursday Nov 19.
- AAIF AAIF AAIF project page lists both days' livestream recordings as "MCP Dev Summit Nairobi 2026 Livestream."

The gap may reflect AAIF's increased editorial throughput at scale (now 247+ member orgs),
or a consolidation of Nairobi + upcoming 2026 year-end recap into one post. Monitor aaif.io/blog.

[[Linux Foundation event page]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/) · [[AAIF MCP project]](https://aaif.io/projects/model-context-protocol)

---

### MCP Spec / SEP — No New Activity

No new SEPs or spec blog posts surfaced for Nov 25–26. Latest confirmed SEPs:
- **SEP-3392** (Extension Lifecycle, Final, 2026-09-25)
- **SEP-3398** (Release Cycle Updates, Accepted, 2026-09-17) — formalizes MCP release cadence
  as the **last Tuesday of March and September**; this confirms next spec release as ~March 31,
  2027. [[modelcontextprotocol.io/seps]](https://modelcontextprotocol.io/seps)
- **SEP-2575** (Make MCP Stateless) — listed as Accepted/Final on the SEP index.

**MCP Release Cadence formalized (blog published Nov 11, 2026):** Anthropic/MCP blog
confirmed the 6-month release schedule: specs ship on the **last Tuesday of March and
September**. Next spec release: **2027-03-30**. Planning cycle has started. Luca Chang joins
Den Delimarsky and David Soria Parra as Release Manager. Governed by SEP-3398.
[[MCP release cycle blog]](https://blog.modelcontextprotocol.io/posts/mcp-release-cycle/)

**Skills Over MCP WG (SEP-2640):** SEP-2640 is confirmed Final (merged Sep 13, 2026).
Bi-weekly working sessions active (Nov 3 session logged). Official extension namespace:
`io.modelcontextprotocol/skills` in `modelcontextprotocol/ext-skills`.
[[Skills Over MCP WG]](https://modelcontextprotocol.io/community/working-groups/skills-over-mcp)

The spec / SEP space is otherwise quiet in the Nov 25–26 window, consistent with post-July-28
maturation and the confirmed March 2027 planning window.

---

### GitHub MCP Server — v2.3.0 Now Latest (MAJOR: 3 Unreported Releases)

The "v2.0.3 unconfirmed / winget only" flag in §13 is now **fully resolved**. The official
GitHub releases page confirms four releases since the last reported v2.0.2 (Oct 8, 2026):

| Version | Date | Key changes |
|---|---|---|
| **v2.0.3** | Oct 21, 2026 | UTF-8 URI encoding fix; Go 1.27.3 (compromised CA); cursor pagination on `list_label` |
| **v2.1.0** | Nov 3, 2026 | Artifact management tools (experimental); agentic workflow improvements; integer overflow rejection |
| **v2.2.0** | Nov 16, 2026 | "The one with Skills" — server instructions replaced by **filtered MCP Skills** (SEP-2640 integration); public agent automation tools; secret scanning alert opt-in hiding |
| **v2.3.0** | Nov 24, 2026 | Dependabot alert tools; code scanning alert tools; secret scanning alert tools; Swift in global security advisories; experimental PR artifact tools |

**Latest: v2.3.0 (Nov 24, 2026).** The v2.2.0 Skills integration is particularly notable:
GitHub MCP is the first major vendor-hosted remote server to ship native MCP Skills support,
ahead of any formal catalog schema change.

[[GitHub MCP releases]](https://github.com/github/github-mcp-server/releases)

**Catalog action:** `subregistry-audit` should bump `verifiedAt` for `com.github/mcp` to Nov 24.
Also consider whether `tool_count` or `skills` metadata fields should track the new Skills
capability once SEP-2640 / SEP-2127 schema paths are stable.

---

## Catalog Hooks

No catalog server demotions needed. Flags and actions:

1. **GitHub MCP v2.3.0 (Nov 24) — run `subregistry-audit` for `com.github/mcp`:** bump
   `verifiedAt` to Nov 24. Confirm Skills compatibility flags (v2.2.0 ships SEP-2640 Skills).
   The "unconfirmed v2.0.3" flag in §13 audit item (b) is closed; update it to v2.3.0.

2. **Python SDK audit gate is now executable** — CVE-2026-59951 and CVE-2026-109527 confirmed.
   Gate: `mcp>=2.3.0` (latest Oct 2 stable) or `mcp>=1.30.0` (1.x). Run `subregistry-audit`
   to verify catalog Python-SDK vendors. Update §13 audit gate language from "NVD-unconfirmed"
   to "confirmed, fixed ≥1.30.0/≥2.2.0."

3. **CVE-2026-109492 (Microsoft MCP Gateway)** — not a catalog concern but relevant to gateway
   operators. Recommend documenting in §13 as a gateway-operator advisory.

4. **CVE-2026-134817 / CVE-2026-125271** — confirmation closes the "unconfirmed" flag from the
   Nov 21 report. Both are catalog-immune; remove from open items.

5. **MCPCon Nairobi recap** — keep monitoring aaif.io/blog. If recap published, check for any
   new spec/governance signals that affect the catalog or ranking.

6. **PulseMCP ingestion** — appears resumed; next research pass should confirm live count.

7. **Curate queue unchanged:** HubSpot, Intercom, Zendesk Bridge remain the top 3 priorities.

---

## Sources

- [[OSV CVE-2026-59951]](https://osv.dev/vulnerability/CVE-2026-59951)
- [[Vulners CVE-2026-59951]](https://vulners.com/rapid7/RAPID7:CVE-2026-59951)
- [[Vulners CVE-2026-109527]](https://vulners.com/vulnrichment/VULNRICHMENT:CVE-2026-109527)
- [[ThreatFrontier Python SDK OAuth fix]](https://threatfrontier.com/articles/mcp-python-sdk-oauth-credential-theft-issuer-fix)
- [[MSRC CVE-2026-109492]](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-109492)
- [[BleepingComputer Nov Patch Tuesday]](https://www.bleepingcomputer.com/news/microsoft/microsoft-november-2026-patch-tuesday-fixes-1-235-flaws-outlook-zero-day/)
- [[Strix.ai CVE-2026-109492]](https://www.strix.ai/cve/CVE-2026-109492)
- [[FixLane CVE-2026-109492]](https://fixlane.poparecon.com/incidents/2397)
- [[AWS Security Bulletin CVE-2026-125271]](https://aws.amazon.com/security/security-bulletins/2026-176-aws/)
- [[hol.org CVE-2026-134817]](https://hol.org/guard/security/campaigns/cve-2026-134817-mcp-server-kubernetes-argument-injection-file-read)
- [[VulDB CVE-2026-134492]](https://vuldb.com/vuln/442381)
- [[Linux Foundation Nairobi event]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)
- [[AAIF MCP project]](https://aaif.io/projects/model-context-protocol)
- [[modelcontextprotocol.io SEPs]](https://modelcontextprotocol.io/seps)
- [[apitracker.io Nov 1 snapshot]](https://apitracker.io/mcp-statistics/2026-11-01)
- [[Glama]](https://glama.ai/mcp/servers)
- [[wingetly GitHub MCP v2.0.3]](https://wingetly.io/apps/github/github-mcp-server)
- [[SC World roundup]](https://www.scworld.com/perspective/the-mcp-server-nobody-inventoried)
- [[Daramola Substack CVE roundup]](https://daramola.substack.com/p/twelve-mcp-security-fixes-in-ten)
- [[GitHub MCP releases]](https://github.com/github/github-mcp-server/releases)
- [[MCP release cycle blog (Nov 11)]](https://blog.modelcontextprotocol.io/posts/mcp-release-cycle/)
- [[Skills Over MCP WG]](https://modelcontextprotocol.io/community/working-groups/skills-over-mcp)
- [[AAIF blog]](https://aaif.io/blog)
- [[PulseMCP servers]](https://www.pulsemcp.com/servers)

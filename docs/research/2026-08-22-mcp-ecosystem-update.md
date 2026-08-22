# MCP Ecosystem Update — 2026-08-22

**Produced by:** MCP Sub-Registry autonomous research routine
**Covers:** 2026-08-21 EOD → 2026-08-22
**Prior report:** [2026-08-21-mcp-ecosystem-update.md](./2026-08-21-mcp-ecosystem-update.md)

---

## 1. Headline Summary

- **Glama: ~75,614 (flat vs. Aug 21).** Search-index page title unchanged at "75,614 in the Glama
  Registry" — no new indexing pulse detected on Aug 22. The previous day's +1,085 surge has not
  continued; likely a batch-flush that has now settled.
  [[Glama]](https://glama.ai/mcp/servers)
- **PulseMCP: ~22,020–22,070 (flat, Day 12 of ingestion-rework pause).** The stated "mid-August"
  restart deadline is now 12+ days overdue. No step-jump detected. The expected backlog-driven
  step-jump remains a highest-priority watch item for landscape counts.
  [[PulseMCP]](https://www.pulsemcp.com/servers)
- **AAIF Seoul blog recap: STILL NOT PUBLISHED (Day 8 post-summit).** aaif.io/blog is egress-blocked
  from this environment; search index continues to show only the North America recap and no
  Seoul-specific AAIF post. External analyst coverage (Futurumgroup) published; official AAIF
  recap at or beyond the upper end of its estimated Aug 22–24 window.
  [[AAIF blog]](https://aaif.io/blog)
  [[Futurumgroup coverage]](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- **GitHub MCP Server: v1.10.0 (Aug 19) + v1.10.1 (Aug 20) released.** Two releases landed since
  the Aug 10 v1.9.0 capture in §13. v1.10.0 is a security/reliability update; v1.10.1 patches a
  schema regression. These are new data points for `com.github/mcp`'s `verifiedAt` update.
  [[GitHub MCP Server releases]](https://github.com/github/github-mcp-server/releases)
- **CVE-2026-76404 (Splunk MCP Server App, CVSS 9.1, Aug 19).** Enterprise Splunk add-on, NOT a
  hosted remote-HTTP server; Splunk is NOT in our catalog. Remote-HTTP-only catalog is structurally
  immune. Documented for completeness.
  [[Splunk advisory SVD-2026-0801]](https://advisory.splunk.com/advisories/SVD-2026-0801)
- **Security: Day 57 clean.** No new CVEs against any of the 19 cataloged remote-HTTP servers for
  Aug 21–22.

---

## 2. Scale & Registry Landscape

| Registry | Count (Aug 22) | vs. Aug 21 | Note |
|---|---|---|---|
| Glama | ~75,614 | flat | Search-index title unchanged [[Glama]](https://glama.ai/mcp/servers) |
| PulseMCP | ~22,020–22,070 | flat (Day 12) | Ingestion-rework pause; deadline overdue [[PulseMCP]](https://www.pulsemcp.com/servers) |
| MCPToplist (cross-registry) | 100,958 | (Aug 10 snap; 12 days stale) | No new snapshot |
| Official MCP Registry | ~9,652 | — | v0.1 frozen; v1 in development |
| Smithery | ~7,300 | — | No August update; infra rebuild |
| Anthropic Connectors | 950+ | — | Per claude.com July 28 blog |
| Our catalog | 19 | — | All approved/public; all on Streamable HTTP |

**Glama pattern (Aug 14–22):** flat (~72,328), +148, +614, +683, +756, +1,085 (Aug 21), **flat (Aug 22)**.
The large Aug 21 batch pulse has settled. No second pulse detected today. The 75k milestone crossed
Aug 21 stands; next structural milestone is 76k, expected within 1–2 days at resumed pace.

**PulseMCP Day 12:** The ingestion-rework pause is now formally well past its stated "mid-August"
end date with no public announcement of restart. When the restart occurs, the backlog should produce
a step-jump. This is the highest-priority count watch item.

---

## 3. New Catalog-Relevant Events

### 3a. GitHub MCP Server v1.10.0 and v1.10.1

Two new releases landed since the v1.9.0 capture in §13's audit next-actions list:

**v1.10.0 (August 19, 2026):**
- Security and reliability update
- Improvements to repository deletion, HTTPS enforcement, and symbolic link handling
- Better GitHub Enterprise Server compatibility
- Enhanced tool contracts and Projects features

**v1.10.1 (August 20, 2026):**
- Patch release: fixes `add_issue_comment` schema compatibility regression introduced in v1.10.0

**Catalog implication:** The §13 next actions already flag `com.github/mcp` for a `verifiedAt`
update (at v1.9.0); this raises the target to v1.10.1. No endpoint or auth changes detected
from release notes — the endpoint remains `https://api.githubcopilot.com/mcp` and OAuth 2.0
auth unchanged. Update `verifiedAt` in the next `subregistry-audit` pass.
[[GitHub MCP Server releases]](https://github.com/github/github-mcp-server/releases)

---

## 4. Security

### 4a. CVE-2026-76404 — Splunk MCP Server App (CVSS 9.1, Aug 19)

**Vulnerability:** Unsafe deserialization in the Splunk MCP Server App (versions < 1.2.1).
The credential management component fails to validate stored data types during deserialization.
An authenticated Splunk `admin`-role user can supply crafted serialized data to trigger arbitrary
OS command execution (CWE-502).

**Patch:** Splunk MCP Server App v1.2.1. Published Aug 19, 2026.
[[Splunk advisory SVD-2026-0801]](https://advisory.splunk.com/advisories/SVD-2026-0801)
[[GBHackers coverage]](https://gbhackers.com/splunk-fixes-17-vulnerabilities/)
[[TheHackerWire]](https://www.thehackerwire.com/splunk-mcp-server-app-rce-via-deserialization-cve-2026-76404/)

**Catalog impact:** None. The Splunk MCP Server App is an enterprise add-on installed in
Splunk Enterprise environments — it is NOT a hosted remote-HTTP endpoint. Splunk is not
in our catalog. This CVE falls into the same structural class as the prior enterprise add-on
CVEs documented in prior reports: deserialization/RCE in STDIO/packaged apps, against which
our remote-HTTP-only catalog is structurally immune.

**Pattern note:** CVE-2026-76404 is the second CVE in the `splunk-mcp-*` namespace in 2026
(after CVE-2026-20205, CVSS 7.2, token leak in logs, patched v1.0.3, April 2026). This
reinforces the posture of excluding Splunk's MCP app from our catalog while monitoring
Splunk should they ever offer a hosted remote-HTTP server endpoint.

### 4b. Adversa AI August 2026 Security Resources Roundup

Adversa AI published their "MCP Security Best Practices & Resources: August 2026" roundup,
aggregating CVE disclosures, framework references, and security tooling from the past month.
[[Adversa AI August 2026 roundup]](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)

This resource supplements the two Adversa AI August 2026 digests (six-stage MCP kill chain
HMM + SPELLSMITH) already captured in §13. No new cataloged-server CVEs found in this roundup
beyond CVE-2026-76404 (Splunk, above).

### 4c. Continuous clean window — Day 57

No new CVEs, tool poisoning disclosures, or security incidents involving any of the 19
cataloged remote-HTTP servers found for Aug 21–22. The clean window that began after the
June 2026 incident cluster continues.

---

## 5. Ongoing Watch Items (status as of Aug 22)

| Item | Status | Days Active | Expected |
|---|---|---|---|
| AAIF Seoul blog recap | NOT published | Day 8 | ~Aug 22–24 |
| PulseMCP ingestion restart + step-jump | Not yet | Day 12 overdue | Unknown |
| SEP-2127 PR merge | Still open (PR #2127) | — | Post-WG-close; Aug 31/Sep 7 meetings |
| MCPToplist snapshot refresh | 12 days stale | — | No cadence signal |
| `subregistry-audit` SEP-2127 trigger | **OVERDUE** | Triggered Aug 14 | Next session |
| `com.github/mcp` verifiedAt update | **OVERDUE** | v1.10.1 latest | Next audit pass |
| `com.slack/mcp` verifiedAt update | Pending | — | Next audit pass |
| TS SDK vendors ≥1.26.0 audit | Pending | — | Next audit pass |
| Python SDK vendors ≥1.28.1 audit | Pending | — | Next audit pass |

---

## 6. No Landscape Ranking Changes

No new entrants, funding events, acquisitions, or product changes detected on Aug 22 that
would alter the current top-11 ranking or watch-list entries in `landscape.md`. Landscape
updated only for "Last updated" date and Glama count confirmation.

---

## 7. Catalog Actions

No new catalog actions required from today's research. The `subregistry-audit` pass flagged
in §13 (SEP-2127 server-card audit, `com.github/mcp` verifiedAt, TS/Python SDK version
checks, CIMD compliance) remains the highest-priority next action.

---

## Sources

- [Glama MCP Registry](https://glama.ai/mcp/servers)
- [PulseMCP Server Directory](https://www.pulsemcp.com/servers)
- [GitHub MCP Server releases](https://github.com/github/github-mcp-server/releases)
- [Splunk SVD-2026-0801 advisory](https://advisory.splunk.com/advisories/SVD-2026-0801)
- [GBHackers — Splunk 17 vulnerabilities](https://gbhackers.com/splunk-fixes-17-vulnerabilities/)
- [TheHackerWire — CVE-2026-76404](https://www.thehackerwire.com/splunk-mcp-server-app-rce-via-deserialization-cve-2026-76404/)
- [CVE-2026-76404 Intruder overview](https://cvemon.intruder.io/cves/CVE-2026-76404)
- [Adversa AI August 2026 MCP security resources](https://adversa.ai/blog/top-mcp-security-resources-august-2026/)
- [Futurumgroup AAIF Seoul coverage](https://futurumgroup.com/insights/mcp-dev-summit-2026-aaif-sets-a-clear-direction-with-disciplined-guardrails/)
- [SEP-2127 PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [Blackhat USA 2026 slides repository](https://github.com/onhexgroup/Conferences/releases/tag/bhusa2026)

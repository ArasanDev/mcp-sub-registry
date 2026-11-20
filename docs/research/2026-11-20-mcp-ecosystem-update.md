# MCP Ecosystem Update — 2026-11-20

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since yesterday's report (2026-11-19). Incremental pass: 1-day window.
**Today's date:** 2026-11-20

---

## Summary

One-day incremental pass. Yesterday's report covered MCPCon Nairobi Day 1 underway, Glama
~123,500+ (est.), TS SDK v2.4.0 latest, GitHub MCP v2.0.2 current, Intercom confirmed,
HubSpot write-access expansion, CVE-2026-111771 NVD pub Nov 5. Today's additions:

1. **MCPCon Nairobi concludes (Day 2 / final day today)** — event ends today; no recap or
   session outputs published yet. Monitor aaif.io/blog post-event (expected Nov 20–21).
2. **NEW CVE: CVE-2026-116686** (Python SDK client SSRF/$ref external resolution, Oct 27,
   2026, CVSS 6.5 Medium) — newly surfaced in research trail; not previously recorded in §13.
   Python SDK client resolves server-supplied JSON Schema `$ref` pointers against external
   network/filesystem paths, enabling DoS (event loop blocking) if the client connects to an
   adversarial server. Fixed in `mcp>=1.30.0` (1.x) or `mcp>=2.2.0` (2.x). **Catalog action:
   add audit item** — verify Python-SDK-based catalog vendors are on ≥1.30.0 or ≥2.2.0.
3. **Glama: ~124,500–125,000 (est.)** — no new independent snapshot found; projection from
   Oct 28 confirmed 111,899 at ~530/day average. Prior day estimate was ~123,500.
4. **TypeScript SDK: v2.4.0 still latest** — no v2.5.0 or November release found. v1.x
   backport at v1.32.2 (Oct 23).
5. **PulseMCP: flat** — ~21,614–21,710 (late Oct); no November ingestion data found.
6. **MCP spec: unchanged** — 2026-07-28 remains final; next release March 30, 2027.
7. **Day 92+ clean window** — no new CVEs affecting the 19 approved remote-HTTP catalog
   servers. CVE-2026-116686 is a client-side SDK flaw; direct catalog server exposure is
   minimal (servers do not consume untrusted MCP server connections), but Python-SDK-based
   vendors should update client components.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Glama** | ~124,500–125,000 (est.) | Nov 20, 2026 | Projected from Oct 28 confirmed 111,899 at ~530/day. [[Glama]](https://glama.ai/mcp/servers) |
| **Official MCP Registry** | ~53,075 distinct names | Nov 1, 2026 | Third-party snapshot; v1 API still "Ideating." |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; ingestion paused. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy gone since Oct 31. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom overdue. |

---

## MCPCon Nairobi — Final Day (Nov 20)

The MCP Dev Summit Nairobi 2026 concludes today (Day 2). The event focuses on developers and
startups building practical AI tools and services in Africa, organized by AAIF / Linux Foundation.

No session outputs, blog recap, or formal announcements have been published as of this writing.
Pre-event livestream schedules are listed on the AAIF project page but no post-event summary is
indexed yet.

**Next action:** Monitor aaif.io/blog for the Nairobi recap (expected Nov 20–21). Any MCP
governance signals, new AAIF project announcements, or spec previews from the event should be
captured in the next daily pass.

Sources:
- [[Linux Foundation — MCP Dev Summit Nairobi]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)
- [[AAIF MCP Project Page]](https://aaif.io/projects/model-context-protocol)

---

## Security: CVE-2026-116686 (Python SDK — NEW)

**CVE-2026-116686** — MCP Python SDK client SSRF / external `$ref` resolution.
- **Published:** Oct 27, 2026 (NVD "Received" status; Red Hat and Mend.io indexed)
- **CVSS:** 6.5 (Medium); CWE-918 (SSRF / server-side request forgery)
- **Mechanism:** When a Python SDK client connects to an MCP server, the server can supply a
  JSON Schema with `$ref` pointers referencing external network URLs or filesystem paths. The
  SDK's client resolves these automatically without restriction, potentially causing DoS (event
  loop blocking on remote fetch), limited SSRF, or exposure of local file contents.
- **Fixed in:** `mcp>=1.30.0` (1.x line) or `mcp>=2.2.0` (2.x line).
- **Catalog impact:** Our 19 catalog servers are remote-HTTP hosted endpoints — they are
  *servers*, not clients. Direct vulnerability is minimal. However, if any catalog vendor's
  implementation uses the Python SDK internally as a *client* (e.g., to call another MCP server),
  they should upgrade. **Audit item added** (see §13 next actions).

This CVE was disclosed Oct 27 but was not surfaced in the Nov 18/19 research passes. Adding it
to the security trail now.

Sources:
- [[Red Hat CVE-2026-116686]](https://access.redhat.com/security/cve/CVE-2026-116686)
- [[TuxCare CVE tracker]](https://tuxcare.com/cve-tracker/cve/details/cve-2026-116686/)
- [[Mend.io]](https://www.mend.io/vulnerability-database/CVE-2026-116686/)

---

## TypeScript SDK Status

No new release since v2.4.0 (Oct 23, 2026). The v1.x backport line is at v1.32.2. The
package-split betas (`@modelcontextprotocol/core`, `@modelcontextprotocol/client`,
`@modelcontextprotocol/node`) remain at `2.0.0-beta.5`; no stable package-split release yet.

Audit gate remains: **all TS-SDK-based catalog vendors should be on v2.4.0 (or ≥v2.3.0 minimum
for the Oct 20 CVE cluster)**. The existing next action in §13 covers this.

Source: [[releases.sh MCP TypeScript SDK]](https://releases.sh/modelcontextprotocol/mcp-typescript-sdk.md)

---

## Catalog Hooks

No new endpoint failures, ownership changes, or security concerns found for the 19 approved
catalog servers today. HubSpot and Intercom remain the overdue curate items (see §13 next actions).

**New audit item from today:** Verify Python-SDK-based catalog vendors are on `mcp>=1.30.0` (1.x)
or `mcp>=2.2.0` (2.x) for CVE-2026-116686.

---

## What to Watch Next

- **MCPCon Nairobi recap** — aaif.io/blog (expected Nov 20–21). Any new AAIF project, governance
  signal, or spec preview from Nairobi.
- **Glama fresh snapshot** — no independent count found today; next pass should attempt a live
  fetch of the Glama count to replace projection with a confirmed figure.
- **curate: HubSpot + Intercom** — both overdue; next priority after audit pass.
- **audit: Python SDK vendors** — CVE-2026-116686 adds a new verification item alongside the
  existing TS SDK v2.3.0+ audit gate.

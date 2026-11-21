# MCP Ecosystem Update — 2026-11-21

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed since yesterday's report (2026-11-20). Incremental pass: 1-day window.
**Today's date:** 2026-11-21

---

## Summary

One-day incremental pass. Yesterday's report covered: MCPCon Nairobi concluding Day 2, NEW
CVE-2026-116686 (Python SDK SSRF/$ref, CVSS 6.5), Glama ~124,500–125,000 (est.), TS SDK v2.4.0
latest, Day 92+ clean. Today's additions:

1. **MCPCon Nairobi recap still pending** — event concluded Nov 20; no AAIF blog post indexed as
   of Nov 21. Expected within days.
2. **TWO previously unrecorded TS SDK CVEs from October 2026 now surfaced:** CVE-2026-104850
   (OAuth client credential exposure, fixed SDK 1.31.0, CVSS 7.5) and CVE-2026-111768 (HTTP
   server request-body DoS, fixed SDK 1.32.0, CVSS 7.5). Both broaden the existing TS SDK
   audit gate from v2.3.0 minimum to v2.3.0 (CVE-2026-111771) + 1.31.0/2.2.0 (CVE-2026-104850)
   + 1.32.0/2.3.0 (CVE-2026-111768). **Full cluster audit item: all TS SDK-based catalog vendors
   should be on SDK ≥1.32.0 (1.x) or @modelcontextprotocol/server ≥2.3.0 (2.x).**
3. **Smithery dead-URL aftermath quantified** — third-party census (Nov 16, Stork.AI): ~216
   Smithery entries still point at defunct run.tools/server.smithery.ai URLs; 1,044 total
   official registry entries advertise unreachable endpoints across all origins.
4. **MCP server reachability studies (Nov 5–16):** Two independent censuses show 54–55% of
   official registry remote endpoints respond to unauthenticated handshake; 34–36% return 401
   (auth-required); 10% are dead. Validates our auth-gated curation model.
5. **New November CVEs (community/STDIO packages):** CVE-2026-130901 (Amazon document-loader,
   path traversal, critical, Nov 17), CVE-2026-77383 (mcp-ssh-manager OS command injection, CVSS
   8.7), CVE-2026-54032 (LibreChat XSS via MCP config dialog, low severity). None in catalog.
6. **Official MCP Registry growth (early Nov data):** ~59,603 distinct servers as of Nov 8
   (third-party snapshot); adding ~3,032–3,278 per week through early-mid November.
7. **Day 93+ clean window** for the 19 approved remote-HTTP catalog servers.

---

## Registry Scale

| Registry | Count | As of | Notes |
|---|---|---|---|
| **Glama** | ~124,500–125,000 (est.) | Nov 21, 2026 | Homepage cached 122,052 (undated, likely early-mid Nov). Oct 28 confirmed 111,899. ~530/day → Nov 21 est. ~124,500–125,000. [[Glama]](https://glama.ai/mcp/servers) |
| **Official MCP Registry** | ~62,000–65,000 (est.) | Nov 21, 2026 | Nov 8 third-party snapshot: 59,603 distinct servers. Adding ~3,032–3,278/week through early Nov. [[dev.to weekly digest]](https://dev.to/lazaretto/this-week-in-the-mcp-registry-3278-new-servers-week-of-2026-11-09-2e4h) |
| **PulseMCP** | ~21,614–21,710 | late Oct 2026 | Flat; ingestion paused. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery (Arcade.dev)** | Directory-only | Nov 2026 | Proxy gone since Oct 31. ~216 entries still point at defunct run.tools URLs. [[Smithery]](https://smithery.ai/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; HubSpot + Intercom overdue. |

---

## MCPCon Nairobi — Recap Pending

The MCP Dev Summit Nairobi 2026 concluded Nov 20 (Day 2 / final day). As of Nov 21, no AAIF
blog post or session summary has been indexed.

The event was focused on developers and startups building practical AI tools and services in
Africa, organized by AAIF / Linux Foundation. It follows the full AAIF global events series
(Seoul Aug 13–14, Shanghai Sept 6–7, Tokyo Sept 10–11, Amsterdam Sept 17–18, Toronto Oct 5–6,
San Jose Oct 22–23, Nairobi Nov 19–20). Prior summit recaps were published 1–5 days after event
close (Seoul recap on the same day; North America recap appeared within a few days).

**Next action:** Monitor aaif.io/blog for the Nairobi recap. Any new AAIF project announcements,
governance signals, or spec previews from Nairobi should be captured in the next daily pass.

Sources:
- [[Linux Foundation — MCP Dev Summit Nairobi]](https://events.linuxfoundation.org/mcp-dev-summit-nairobi/)
- [[AAIF blog (index)]](https://aaif.io/blog)

---

## Security: Two Previously Unrecorded TS SDK CVEs (October 2026)

### CVE-2026-104850 — OAuth Client Credential Exposure

- **Published:** Oct 6, 2026 (GHSA-6qxp-vccf-f47h; Tenable, GitLab Advisory DB indexed)
- **CVSS:** 7.5 (High); CWE-522 (Insufficiently Protected Credentials) per GitLab, CWE-345 per OpenCVE
- **Mechanism:** When a MCP TypeScript SDK client uses OAuth to connect to an MCP server, the
  client allows the *server* to dictate which authorization server receives the client's OAuth
  credentials. An adversarial MCP server can redirect OAuth credential flow to an attacker-
  controlled authorization endpoint, enabling credential theft.
- **Affected:** `@modelcontextprotocol/sdk` ≥1.12.0, <1.31.0
- **Fixed in:** `@modelcontextprotocol/sdk` 1.31.0 / `@modelcontextprotocol/client` 2.2.0
- **Important caveat:** Per GHSA and Hackernoon analysis, upgrading alone is insufficient for
  certain configurations. Check the GitHub advisory (GHSA-6qxp-vccf-f47h) for required config
  changes before relying solely on the version bump.
- **Catalog impact:** Our 19 catalog servers are hosted remote-HTTP endpoints — they don't use
  the TS SDK *client* to connect to other MCP servers. Direct exposure is minimal. However,
  if any catalog vendor's implementation uses the TS SDK client internally, they must upgrade.
  **Widens the existing audit gate: SDK ≥1.31.0 is now a minimum threshold alongside ≥2.3.0.**
- **KEV:** Not in CISA KEV catalog. No confirmed exploit in the wild.

Sources:
- [[Vulert CVE-2026-104850]](https://vulert.com/vuln-db/CVE-2026-104850)
- [[Tenable CVE-2026-104850]](https://www.tenable.com/cve/CVE-2026-104850)
- [[Hackernoon — the token endpoint]](https://hackernoon.com/the-mcp-server-chose-the-token-endpoint-two-official-sdks-trusted-it)
- [[GitLab Advisory CVE-2026-104850]](https://advisories.gitlab.com/npm/@modelcontextprotocol/sdk/CVE-2026-104850/)

### CVE-2026-111768 — HTTP Server Request-Body DoS

- **Published:** Oct 20, 2026 (GitLab Advisory DB, Corgea; TheHackerWire lists Nov 5 for NVD "Received")
- **CVSS:** 7.5 (High); CWE-400 (Uncontrolled Resource Consumption)
- **Mechanism:** HTTP-facing MCP servers using the TypeScript SDK did not enforce limits on the
  number of array elements or object keys accepted in a single tool-call request body. A single
  within-spec 4 MiB request can crash the Node.js process via JavaScript heap out-of-memory
  during tool argument validation. Stdio-only servers are **not affected**.
- **Affected:** `@modelcontextprotocol/sdk` ≥1.3.0, <1.32.0; `@modelcontextprotocol/server`
  ≥2.0.0, <2.3.0
- **Fixed in:** `@modelcontextprotocol/sdk` 1.32.0 / `@modelcontextprotocol/server` 2.3.0
- **Important caveat:** The fix adds a configurable limit that is **disabled by default**. After
  upgrading, operators must explicitly set `{ maxToolInputElements }` and reduce `maxRequestBodySize`
  to activate protection. See the upstream SDK changelog.
- **Catalog impact:** Our catalog servers are vendor-hosted remote-HTTP endpoints; direct exposure
  depends on whether the vendor runs the TS SDK HTTP transport. **Updated audit gate: all
  TS-SDK-based catalog vendors should be on SDK ≥1.32.0 (1.x) or server ≥2.3.0 (2.x) and have
  explicitly configured the new limits.**
- **KEV:** Not in CISA KEV catalog. No confirmed exploit in the wild.

Sources:
- [[GitLab Advisory CVE-2026-111768]](https://advisories.gitlab.com/npm/@modelcontextprotocol/sdk/CVE-2026-111768/)
- [[Corgea CVE cluster writeup]](https://corgea.com/research/cve-2026-111767-111770-111768-mcp-typescript-sdk-cross-session-leak-dos/)
- [[TuxCare CVE-2026-111768]](https://tuxcare.com/cve-tracker/cve/details/cve-2026-111768/)
- [[TheHackerWire CVE-2026-111768]](https://www.thehackerwire.com/vulnerability/CVE-2026-111768/)

**Updated TS SDK audit gate (cumulative):**

| CVE | Mechanism | Min fix (1.x) | Min fix (2.x) | Config needed? |
|---|---|---|---|---|
| CVE-2026-25536 | Cross-client data leak | 1.26.0 | — | No |
| CVE-2026-0621 | ReDoS | 1.25.2 | — | No |
| CVE-2026-104850 | OAuth client cred. exposure | 1.31.0 | client 2.2.0 | Yes (see GHSA) |
| CVE-2026-111771 | Audience validation bypass | — | 2.3.0 | Yes (explicit config) |
| CVE-2026-111768 | HTTP request-body DoS | 1.32.0 | server 2.3.0 | Yes (enable limits) |

**Effective minimum gate: SDK ≥1.32.0 (1.x) or server ≥2.3.0 (2.x), with explicit config for
CVE-2026-104850 and CVE-2026-111768.**

---

## Security: New November Week CVEs (Community/STDIO — Catalog Immune)

Three new CVEs from Nov 16–20, 2026. None affect the 19 approved remote-HTTP catalog servers.

| CVE | Product | Type | CVSS | Fixed | Catalog impact |
|---|---|---|---|---|---|
| CVE-2026-130901 | Amazon document-loader-mcp-server | Path traversal | Critical | v1.0.21+ | Not in catalog; unverified by independent source |
| CVE-2026-77383 | bvisible mcp-ssh-manager | OS command injection | 8.7 (High) | v3.6.7 | Not in catalog |
| CVE-2026-54032 | LibreChat (MCP config dialog) | Stored XSS | Low | LibreChat 0.8.6 | Not in catalog |

**CVE-2026-130901 note:** VulDB reports this as a critical path traversal in the
`amazon/document-loader-mcp-server` package, logged Nov 17, 2026. Independent advisory not
found; no matching NVD entry confirmed. Treat with caution until vendor-confirmed.

Sources:
- [[VulDB CVE-2026-130901]](https://vuldb.com/vuln/441566)
- [[VulDB CVE-2026-77383]](https://vuldb.com/vuln/441549)
- [[VulDB CVE-2026-54032]](https://vuldb.com/vuln/441636)
- [[Radar CVE-2026-77383]](https://radar.offseq.com/threat/cve-2026-77383-cwe-78-os-command-injection-in-bvisible-mcp-ssh-manager-e81bb80f901e14a3)

---

## Smithery Dead-URL Aftermath

Smithery's proxy and managed-identity services shut down Oct 31, 2026 as announced. A Stork.AI
census (Nov 16) of the official MCP registry found that **~200+ official registry entries still
point at defunct `run.tools` and `server.smithery.ai` URLs** — vendors who hosted via Smithery
but have not yet updated their registry listings. The same census found 1,044 total official
registry entries advertise unreachable endpoints across all origins.

Smithery's own migration notice advises switching to each server's vendor-hosted URL, listed on
the smithery.ai server page.

**Catalog impact:** None of our 19 approved catalog servers were hosted via Smithery. All 19 use
vendor-operated remote-HTTP endpoints that remain live. No action needed.

This is a useful data point: even after a major proxy shutdown, 200+ entries remain broken with
no automated cleanup in the official registry. Reinforces our active curation model — our catalog
verifies endpoints explicitly and updates `verifiedAt` on each audit.

Sources:
- [[Smithery future / migration notice]](https://smithery.ai/future)
- [[Stork.AI — Smithery shutdown MCP server URLs]](https://stork.ai/blog/smithery-shutdown-mcp-server-urls)
- [[ApiTracker Smithery migration]](https://apitracker.io/smithery-migration)

---

## MCP Registry Reachability Research (Nov 5–16)

Two independent censuses of the official MCP registry's remote endpoints, published this month:

**Digital Applied (Nov 5, 2026):** Sampled 1,000 registry remote endpoints, sent each an
unauthenticated `initialize` request. Results: 55% answered valid initialize, 34% returned
auth-required (401/403/WWW-Authenticate), 11% did not respond. The 34% auth-required figure is
a *positive* signal for curation: those endpoints are deployed with authentication. The 11%
dead/no-response figure indicates ongoing churn.

**Stork.AI (Nov 16, 2026):** Wider census. Results: 54% answered, 36% auth-required, 10% dead.
Additionally flagged ~200+ Smithery-origin entries still pointing at defunct addresses.

**NestDaddy / TechBytes (Nov 14, 2026):** Audited 37,383 remote MCP servers; 89.6% responded;
~1 in 3 required authentication before exposing tools. Different methodology (may include
redirects / partial handshakes as "responded").

**Key takeaway for our registry:** The 34–36% auth-required rate across the ecosystem confirms
that authentication is becoming the norm for production remote MCP servers. All 19 of our
approved catalog servers require authentication (OAuth or API key) — we are ahead of the
ecosystem median and should maintain this as a curation bar.

Sources:
- [[Digital Applied — MCP remote server health census Nov 2026]](https://www.digitalapplied.com/blog/mcp-remote-server-health-census-november-2026)
- [[Stork.AI — MCP registry endpoints checked Nov 2026]](https://www.stork.ai/blog/mcp-registry-endpoints-checked-november-2026)
- [[TechBytes — We tested 37,000 MCP servers]](https://techbytes.app/posts/we-tested-37000-mcp-servers/)

---

## Official MCP Registry Growth

Third-party snapshot series tracking the official MCP registry through early November:

- **Nov 8 snapshot:** 59,603 distinct servers (third-party snapshot; v1 API still "Ideating")
- **Week of Nov 2:** +3,032 new servers added
- **Week of Nov 9:** +3,278 new servers added
- **Estimated Nov 21:** ~65,000–67,000 distinct servers (extrapolating from Nov 8 + ~3,100/week)

The registry v1 API remains in "Ideating" status per the working group charter; no GA date set.
Weekly churn is concentrated among a few prolific publishers (e.g., `io.usefulapi` added 278
listings in one week alone).

Sources:
- [[dev.to — Nov 2 weekly digest]](https://dev.to/lazaretto/this-week-in-the-mcp-registry-3032-new-servers-week-of-2026-11-02-5hfh)
- [[dev.to — Nov 9 weekly digest]](https://dev.to/lazaretto/this-week-in-the-mcp-registry-3278-new-servers-week-of-2026-11-09-2e4h)
- [[dev.to — Nov 8 full count: 59,603]](https://dev.to/fast_data_asap/i-counted-every-server-in-the-official-mcp-registry-59603-entries-and-october-alone-added-16282-1jlj)
- [[MCP Registry charter — v1 "Ideating"]](https://modelcontextprotocol.io/community/registry/charter.md)

---

## TypeScript SDK Status

No new release since v2.4.0 (Oct 23, 2026). v1.x backport at v1.32.2. No November release
found. The updated TS SDK audit gate table above now incorporates CVE-2026-104850 and
CVE-2026-111768; effective minimum is SDK ≥1.32.0 (1.x) or server ≥2.3.0 (2.x).

Source: [[releases.sh MCP TypeScript SDK]](https://releases.sh/modelcontextprotocol/mcp-typescript-sdk.md)

---

## Catalog Hooks

No new endpoint failures, ownership changes, or security concerns found for the 19 approved
catalog servers today. HubSpot and Intercom remain the overdue curate items.

**Updated audit items from today's research:**
- **Extend TS SDK audit gate:** Verify all TS-SDK-based catalog vendors are on SDK ≥1.32.0 (1.x)
  or server ≥2.3.0 (2.x) for the full CVE-2026-104850 + CVE-2026-111768 + CVE-2026-111771 cluster.
  Config changes may be required beyond the version bump (see CVE-2026-104850 GHSA and CVE-2026-111768
  limit configuration).
- No new Python SDK concerns beyond CVE-2026-116686 (already recorded Nov 20).

---

## What to Watch Next

- **MCPCon Nairobi recap** — aaif.io/blog (expected within 1–5 days of Nov 20 close). Any new
  AAIF project, governance signal, or spec preview from Nairobi.
- **Glama fresh snapshot** — homepage cached figure (122,052) may be ~2 weeks old; next pass
  should attempt a live fetch to get a confirmed figure.
- **curate: HubSpot + Intercom** — both overdue; next priority after audit pass.
- **audit: TS SDK vendors** — full CVE cluster (CVE-2026-104850 + CVE-2026-111768 + CVE-2026-111771)
  now requires SDK ≥1.32.0 (1.x) or server ≥2.3.0 (2.x), plus config changes for two of the three CVEs.
- **audit: Python SDK vendors** — CVE-2026-116686: verify ≥1.30.0 (1.x) or ≥2.2.0 (2.x).

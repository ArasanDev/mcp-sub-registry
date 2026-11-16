# MCP Ecosystem Update — 2026-11-16

**Prepared by:** MCP Sub-Registry Orchestrator (autonomous daily pass)
**Scope:** What changed in the MCP ecosystem since the last report (2026-08-27). Covers the
~80-day gap: September, October, and early November 2026.
**Today's date:** 2026-11-16

---

## Registry Scale

| Registry | Count | Change vs Aug 27 | Notes |
|---|---|---|---|
| **Glama** | **~121,515** | **+~42,500 (+54%)** | Confirmed from cached page snapshots dated 2026-11-15 13:33. [[Glama]](https://glama.ai/mcp/servers) |
| **PulseMCP** | ~21,614–21,710 | ~Flat (–300 to +50) | Late-October snapshot; submissions still paused. No step-jump. [[PulseMCP]](https://www.pulsemcp.com/servers) |
| **Smithery** | ~26,000–27,400 | **+~19,000–20,000** | Major rebound — Smithery joined/was acquired by **Arcade.dev** in August 2026; server count jumped dramatically from ~7,300 at last report. Free-tier shutdown in March 2026 is now partially reversed under Arcade.dev ownership. [[Smithery]](https://smithery.ai/) |
| **Official MCP Registry** | ~47,267 active servers | n/a (was ~9,652 May 2026) | October 21, 2026 estimate from third-party tracker. [[registry.modelcontextprotocol.io]](https://registry.modelcontextprotocol.io/) |
| **Our catalog** | 19 approved/public | — | All remote-HTTP; all approved/public. HubSpot + Intercom overdue for curate. |

**Trust gap:** ~121k Glama indexed vs. 19 curated/approved. Gap widened significantly over 80 days.

**Glama trajectory note:** Grew from ~79k (Aug 27) to ~121.5k (Nov 15) — +42.5k in ~80 days, averaging ~530 net new servers/day. The Glama Oct 9 snapshot shows 97.6k, meaning the 100k milestone was crossed in late September or early October 2026. The 120k milestone was crossed around November 10, 2026.

---

## Security — CVE-2026-59822 (LANDMARK: First MCP KEV Entry)

### CVE-2026-59822 — LiteLLM MCP Auth Bypass (CISA KEV Listed Sept 2, 2026)

**This is the first MCP-specific vulnerability added to the CISA Known Exploited Vulnerabilities catalog** — a significant governance signal for the ecosystem. Multiple sources including Forkast and CSA confirm the KEV listing.

| Field | Detail |
|---|---|
| **CVE** | CVE-2026-59822 |
| **Vendor** | BerriAI / LiteLLM |
| **Description** | Authentication bypass in LiteLLM's MCP Streamable HTTP endpoint. Any fabricated Bearer token reaches and calls configured MCP tools; a failed key check fell back to an empty `UserAPIKeyAuth` object instead of rejecting the request. |
| **CVSS** | 8.8 (v4.0) / 8.2 (v3.1) |
| **KEV Listed** | 2026-09-02 — first MCP-specific KEV entry in CISA history |
| **Federal remediation deadline** | 2026-09-16 (now 60 days past) |
| **Patched** | litellm v1.84.0 (May 14, 2026) — patch predates KEV listing |
| **Exploitation** | Wiz Research confirmed active exploitation via honeypot; probing MCP enumeration endpoints observed |
| **Catalog impact** | **None** — LiteLLM is not in our catalog. Remote-HTTP + auth-gated model is structurally immune to this bypass class. |

**Sources:** [[Wiz Research]](https://www.wiz.io/es-es/vulnerability-database/cve/cve-2026-59822) [[Forkast coverage]](https://forkast.news/the-relay-has-no-lock-litellms-mcp-auth-bypass-marks-a-first-for-the-cisa-kev-catalog/) [[CSA research note (PDF)]](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_litellm_gateway_default_credentials_20260910-csa-styled.pdf) [[Corgea analysis]](https://corgea.com/research/cve-2026-59822-litellm-mcp-streamable-http-auth-bypass) [[OrcarRouter timeline]](https://www.orcarouter.ai/blog/2026-09-02-litellm-mcp-auth-bypass-kev)

**Ecosystem impact:** The KEV listing signals that MCP-specific vulnerabilities have crossed the threshold where US federal agencies treat them as an active operational risk. This validates the registry's posture of requiring auth-gated, remote-HTTP endpoints as a minimum trust bar.

**Continuing clean window for cataloged servers:** The 19 cataloged remote-HTTP servers have no confirmed CVEs through today (Day ~82+ clean from last verified pass). The LiteLLM bypass does not affect any cataloged vendor.

### Earlier CVEs (Q3 2026 — Previously Noted, No New Status)
- **CVE-2026-50548 / CVE-2026-50549 (DuneSlide, CVSS 9.8):** Cursor terminal sandbox escape via injected text; previously documented. Not catalog-relevant.
- **CVE-2026-55581 (mcp-shell, OS command injection):** `allowlist` check missed shell's `-c` flag; fixed in v0.6.0. Not in catalog.
- **CVE-2026-66012 (SiYuan, CVSS 10.0):** Unauthenticated administrator takeover via `/mcp` kernel endpoint; desktop app only; not in catalog.

**Note:** The [Vulnerable MCP Project](https://vulnerablemcp.info/) and [Practical DevSecOps statistics report](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/) are now the two canonical community resources tracking MCP CVEs.

---

## MCP Spec — March 2027 Next Release Confirmed

The 2026-07-28 specification remains the current final. A **November 11, 2026 release note** from the modelcontextprotocol changelog confirms:

- **Six-month release cadence:** The next spec release is now targeting **March 30, 2027**.
- **SEP-2640 Skills extension:** TypeScript SDK has shipped an implementation of the Skills extension (SEP-2640), which standardizes reusable agent capability bundles — directly relevant to AAIF's "Agent Skills" project (see below).
- **Ruby SDK 1.2.0:** Full 2026-07-28 spec support added in Ruby SDK 1.2.0 (October/November 2026).
- **Deprecations:** Roots, Sampling, and Logging formally deprecated under SEP-2577, consistent with the 12-month window announced at spec release.

**Sources:** [[Releasebot MCP changelog]](https://releasebot.io/updates/modelcontextprotocol) [[releases.sh MCP changelog]](https://releases.sh/modelcontextprotocol)

### SEP-2127 Server Cards — Status Unclear; Hold Audit Pass

SEP-2127 (MCP Server Cards, `/.well-known/mcp.json`) path and finalization status remain ambiguous. Conflicting signals in the research pass:

- One GitHub issue (from a site operator, 28 days old as of this writing) claims SEP-2127 was merged as **Final on 2026-10-06** and delegated to an experimental extension repository.
- Other sources describe it as still open or in draft.
- Path conflicts persist: `/.well-known/mcp.json` vs. `/.well-known/mcp/server-card.json` vs. per-endpoint `/server-card`.
- A follow-on WG meeting was scheduled for September 7, 2026 (after the Aug 31 session); no public notes found for either session.

**Action:** Do not run the SEP-2127 server card audit pass until the finalization status is confirmed against the primary modelcontextprotocol GitHub repo (`seps/2127-mcp-server-cards.md`). The validator at [agent-ready.dev](https://agent-ready.dev/how-to-publish-an-mcp-server-card) is live. When status is confirmed, trigger the audit.

**Sources:** [[SEP-2127 PR]](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127) [[Server Card guide]](https://bex.co/2026/07/08/mcp-server-cards-well-known-discovery) [[agent-ready.dev validator]](https://agent-ready.dev/how-to-publish-an-mcp-server-card)

---

## AAIF Global Events — September–November 2026

The AAIF ran a dense global conference circuit across the period. Key events:

### MCPCon Shanghai (AGNTCon + MCPCon China) — September 6–7
- Ran as planned at Shanghai International Convention Center, co-located with KubeCon China.
- 40+ sessions, 1,500+ attendees.
- No detailed public recap found in research pass (consistent with AAIF's historic 10–14 day lag for event recap posts).
- Sessions recorded and posted to AAIF YouTube; check for published recordings.
- **Source:** [[Linux Foundation announcement]](https://x.com/linuxfoundation/status/2075384556006297639) [[Schedule]](https://www.lfopensource.cn/mcp-dev-summit-shanghai/program/schedule/)

### MCPCon Japan (AGNTCon + MCPCon Japan) — September 10–11
- Belle Salle Shibuya Garden, Tokyo.
- Announced as the first AAIF event in Japan, targeting production-ready agentic AI builders.
- **Source:** [[AAIF press]](https://aaif.io/news/agntcon-mcpcon-japan-to-convene-builders-advancing-production-ready-agentic-ai) [[Hometown News]](https://www.hometownnewsvolusia.com/online_features/press_releases/agntcon-mcpcon-japan-to-convene-builders-advancing-production-ready-agentic-ai/article_6a49225b-12a6-5838-8585-322c2aedafca.html)

### MCPCon Europe (AGNTCon + MCPCon Europe) — September 17–18
- Amsterdam, Netherlands.
- **Source:** [[Crossmint conference calendar]](https://www.crossmint.com/learn/ai-agent-conference-calendar)

### MCPCon North America (AGNTCon + MCPCon North America) — October 22–23 ⭐ MAJOR
- San Jose McEnery Convention Center, San Jose, CA.
- **Four new AAIF projects announced** (see below) — most significant ecosystem governance milestone since the 2026-07-28 spec release.
- **Sources:** [[Linux Foundation press]](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox) [[AAIF blog]](https://aaif.io/blog/four-cool-things-from-agntcon-mcpcon) [[AGI Pulse analysis]](https://agipulse.org/e/1042?lang=en) [[Enterprise AI World]](https://www.enterpriseaiworld.com/Articles/News/News/Agentic-AI-Foundation-Details-Four-New-Projects-to-Address-Key-Areas-of-The-Agentic-AI-Stack-177170.aspx)

### MCPCon Nairobi — November 19–20 (3 DAYS AWAY)
- Scheduled for November 19–20, 2026 in Nairobi.
- Monitor aaif.io for schedule and announcements.

---

## AAIF: Four New Projects Announced at MCPCon North America

At AGNTCon + MCPCon North America (Oct 22, 2026), the Agentic AI Foundation announced **four new hosted projects**, taking the total from 3 to 10 in its first year. The announcing organizations:

| Project | Donated by | Layer / Purpose |
|---|---|---|
| **Agent Skills** | **Anthropic** | Open format for packaging reusable agent capabilities; uses a SKILL.md folder structure — directly aligned with our `.claude/skills/` architecture. Standardizes how skills/tools are shared across agents. |
| **Open Responses** | **OpenAI** | Multi-provider LLM interface specification built on OpenAI's Responses API; enables vendor-neutral agent frameworks to swap model backends. |
| **OpenEnv** | **Hugging Face** | Framework for building reinforcement-learning environments; exposes MCP or Gym interfaces; targets agent training and evaluation. |
| **OpenSandbox** | **Alibaba** | General-purpose sandbox platform for safe AI application execution; isolates AI agent actions from host environments. |

**Significance for the sub-registry:**
- **Agent Skills** is an Anthropic donation that directly parallels our skills system. If Agent Skills becomes the cross-industry standard for skill packaging, our `.claude/skills/` structure already mirrors the documented `SKILL.md` folder pattern. No schema change needed now — but watch for a formal Agent Skills registry/index that could become an upstream source.
- The involvement of Anthropic, OpenAI, Hugging Face, and Alibaba as project donors — alongside the existing AAIF founding members (Anthropic, OpenAI, Google, Runlayer) — signals that AAIF is now the primary cross-industry governance body for the agentic stack. This validates the AAIF as the right venue to track for spec governance signals.

---

## New Catalog Candidates

### HubSpot — OVERDUE (Was #1 Priority Since July 2026)
- **Endpoint:** `mcp.hubspot.com` (Streamable HTTP)
- **Auth:** OAuth 2.1 + PKCE only; no DCR; no private-app-token path
- **Status:** GA since April 13, 2026; one-click Claude connector live
- **August 2026 capability expansion confirmed:** Leads record read, Conversations data, Help Desk reply ratings, conditional field logic, landing pages + content analytics, marketing email tools, quotes/revenue (beta)
- **Action:** Add in next `subregistry-curate` run. Note `no DCR` in `auth.notes`.
- **Sources:** [[HubSpot GA]](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available) [[HubSpot MCP guide]](https://www.digitalapplied.com/blog/hubspot-mcp-server-ai-agent-integration-guide) [[Zapier HubSpot MCP]](https://zapier.com/blog/hubspot-with-zapier-mcp/)

### Intercom — New Candidate (Confirmed Live)
- **Endpoint:** `https://mcp.intercom.com/mcp` (Streamable HTTP; legacy SSE at `/sse` deprecated)
- **EU endpoint:** `https://mcp.eu.intercom.com/mcp`
- **Auth:** OAuth (recommended) or Bearer API key
- **Availability:** US + EU workspaces; Australian-hosted workspaces NOT supported
- **Tools:** ~13–15 tools covering conversations, contacts, companies, Help Center articles (read + write)
- **Action:** Evaluate in next curate run alongside HubSpot (Comms & Support persona group). Note AU limitation in `availability.notes`.
- **Sources:** [[Intercom MCP server]](https://www.intercom.com/integrations/connectors/intercom-mcp-server) [[Intercom developer docs]](https://developers.intercom.com/docs/guides/mcp.md) [[Speakeasy guide]](https://www.speakeasy.com/docs/ai-control-plane/guides/intercom)

### Zapier MCP — Evaluate Separately
- Zapier exposes 30,000+ app actions (including HubSpot, Intercom, and others) through a single MCP endpoint.
- Different model than vendor-hosted MCP servers: user configures which actions to expose; not a fixed tool list.
- Catalog model question: is a Zapier MCP entry appropriate given the per-user configurable nature? Evaluate during curate run.
- **Source:** [[Zapier MCP]](https://zapier.com/blog/hubspot-with-zapier-mcp/)

---

## Smithery — Acquired by Arcade.dev (August 2026)

Smithery joined Arcade.dev in August 2026, partially reversing the free-tier shutdown from March 2026. Server count jumped from ~7,300 (Aug 27) to ~26,000–27,400 by late October.

This is a significant change to the landscape ranking. Smithery is no longer a contracting directory — it is now part of Arcade.dev's tooling platform. The governance model and curation quality under Arcade.dev ownership are unconfirmed; treat current Smithery listings as community-grade until further verification.

**Landscape ranking update needed:** Smithery (#10) entry must be updated to reflect Arcade.dev ownership and revised count.

---

## GitHub MCP Server — Likely v2.0.2 (October 2026)

One third-party aggregator reports GitHub MCP Server v2.0.2 released October 8, 2026. This cannot be directly confirmed from primary sources in this research pass. GitHub's official release page at github.com/github/github-mcp-server/releases is the authoritative source.

Previous confirmed version: v1.10.1 (August 20, 2026; last documented in CLAUDE.md).

**Action:** Verify latest version and update `verifiedAt` for `com.github/mcp` in next `subregistry-audit` pass.

**Source:** [[developersdigest tracker]](https://www.developersdigest.tech/mcp-servers/github)

---

## Catalog Hooks

No cataloged server has a reported security concern, dead endpoint, or ownership change confirmed in this pass. All 19 remain approved/public.

**Recommended actions (priority order):**
1. **`subregistry-curate` — HubSpot + Intercom** (Comms & Support group). Both are confirmed live with stable endpoints. HubSpot is 7+ months overdue for curating.
2. **`subregistry-audit` — `com.github/mcp` verifiedAt update** (v2.0.2 likely Oct 2026 if confirmed).
3. **SEP-2127 server card audit pass** — confirm finalization status against primary spec repo first; paths still in conflict.
4. **CVE-2026-25536 TypeScript SDK audit** (pending since June 2026): verify all TS-SDK-based catalog vendors are on SDK v2.0.0 or ≥v1.26.0.

---

## Sources

- [Glama MCP Server Registry](https://glama.ai/mcp/servers)
- [Forkast: LiteLLM KEV first MCP entry](https://forkast.news/the-relay-has-no-lock-litellms-mcp-auth-bypass-marks-a-first-for-the-cisa-kev-catalog/)
- [Wiz CVE-2026-59822](https://www.wiz.io/es-es/vulnerability-database/cve/cve-2026-59822)
- [CSA LiteLLM research note PDF](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/09/CSA_research_note_litellm_gateway_default_credentials_20260910-csa-styled.pdf)
- [Corgea CVE-2026-59822 analysis](https://corgea.com/research/cve-2026-59822-litellm-mcp-streamable-http-auth-bypass)
- [Linux Foundation: AAIF four new projects](https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox)
- [AAIF blog: four cool things from MCPCon North America](https://aaif.io/blog/four-cool-things-from-agntcon-mcpcon)
- [AGI Pulse: AAIF adds four projects](https://agipulse.org/e/1042?lang=en)
- [MCPCon Japan AAIF press](https://aaif.io/news/agntcon-mcpcon-japan-to-convene-builders-advancing-production-ready-agentic-ai)
- [Releasebot MCP changelog](https://releasebot.io/updates/modelcontextprotocol)
- [releases.sh MCP changelog](https://releases.sh/modelcontextprotocol)
- [SEP-2127 PR](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127)
- [agent-ready.dev validator](https://agent-ready.dev/how-to-publish-an-mcp-server-card)
- [Intercom MCP server page](https://www.intercom.com/integrations/connectors/intercom-mcp-server)
- [Intercom developer docs](https://developers.intercom.com/docs/guides/mcp.md)
- [HubSpot MCP GA changelog](https://developers.hubspot.com/changelog/remote-hubspot-mcp-server-is-now-generally-available)
- [Vulnerable MCP Project](https://vulnerablemcp.info/)
- [Practical DevSecOps MCP statistics 2026](https://www.practical-devsecops.com/mcp-security-statistics-2026-report/)
- [Agenstry: MCP discovery fragmentation](https://agenstry.com/blog/mcp-discovery-fragmentation)

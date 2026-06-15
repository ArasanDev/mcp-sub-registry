# MCP Registry Landscape — Canonical Ranking

Living ranking of the significant MCP registry / catalog / governance players, maintained
by the orchestrator's daily research routine (`CLAUDE.md` §10). Update this table when the
field shifts; archive deep findings as dated reports in this folder.

- **Latest deep report:** [2026-06-15-mcp-registry-landscape.md](./2026-06-15-mcp-registry-landscape.md)
- **Latest daily update:** [2026-06-15-mcp-ecosystem-update.md](./2026-06-15-mcp-ecosystem-update.md)
- **Last updated:** 2026-06-15 (second pass — daily research run)

## Ranking criteria

Significance to a *curated sub-registry that feeds a gateway* — weighted toward: ecosystem
influence, scale, curation/trust quality, governance maturity, and relevance to our niche
(clean `discovered != approved != enabled` separation). Not a pure popularity list.

## Top 10 (2026-06-15)

| # | Player | Layer | Scale / signal | Curation & governance | Relevance to us |
| --- | --- | --- | --- | --- | --- |
| 1 | **Official MCP Registry** | Upstream discovery | Authoritative; v0.1 frozen → v1 GA | Metadata only, no quality/security guarantees | Our primary **sync source** |
| 2 | **JFrog MCP Registry** | Enterprise registry | Part of JFrog supply-chain suite; **GA March 18, 2026** | Curated internal catalog, RBAC, audit, allowlist | **Closest analogue** — benchmark; now fully shipped |
| 3 | **Obot** | Gateway + catalog | OSS (MIT); **$35M seed confirmed** | **Clean** discovery→approval→runtime, IT-verified trust | Best model-match; well-funded; study its split |
| 4 | **Lunar.dev MCPX** | Gateway + catalog | OSS core + commercial | Partial separation, sandbox vetting, hardened tools | Model-match; trust tooling ideas |
| 5 | **Docker MCP Catalog / Gateway** | Directory + OCI | Major vendor; OCI private catalogs | Container-per-server isolation; no enterprise RBAC | Private-catalog distribution pattern |
| 6 | **PulseMCP** | Directory | ~18,240+ hand-reviewed; official co-steward | Largest hand-reviewed directory | Curation precedent + sync source |
| 7 | **Glama** | Directory | ~36,950 servers | Light curation on a large set | Breadth reference + sync source |
| 8 | **Smithery** | Directory + hosting | ~7,000+ (upper bound confirmed) | No formal governance; prototyping-grade | Discovery breadth, not a trust layer |
| 9 | **TrueFoundry** | Enterprise gw + registry | Commercial, VPC-native | RBAC, audit, virtual servers | Enterprise registry benchmark |
| 10 | **Kong AI Gateway** | Gateway + registry | Incumbent API-gw; registry in tech preview | Standard API governance patterns | Watch: incumbent entering the space |

**Honorable mentions / watch list:** mcp.so (~20,222, unvetted), MCP Market (~10k, community),
Runlayer (IT-curated, ABAC), MintMCP (10k+ catalog, vetting undocumented), Microsoft MCP
Gateway (k8s, no catalog), AWS Bedrock AgentCore, Composio, Operant, Portkey, Airlock,
agentic-community/mcp-gateway-registry (OSS gateway+registry),
**Agensi** (new Q1-Q2 2026; curated marketplace with automated 8-point security scan; covers SKILL.md + MCP).

## Standing reads

- **White space:** a focused, standalone, MCP-Registry-compatible **curated catalog with a
  documented gateway projection** is uncrowded — most rivals bundle curation into a
  full gateway/runtime suite.
- **Trust is the wedge:** provenance, version-pinning, verification, and change-detection
  are the differentiators buyers care about post-incident (postmark-mcp, CVE-2025-54136,
  CVE-2026-26118, CVE-2026-33032, and RSAC 2026's systemic supply-chain advisory).
- **Spec watch:** MCP 2026-07-28 RC (locked May 21; ships July 28) removes session state
  and adds mandatory `Mcp-Method`/`Mcp-Name` headers. No catalog schema change required;
  Gateway operator must update transport validation before July 28.
</content>

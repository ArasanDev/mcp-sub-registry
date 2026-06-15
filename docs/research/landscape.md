# MCP Registry Landscape — Canonical Ranking

Living ranking of the significant MCP registry / catalog / governance players, maintained
by the orchestrator's daily research routine (`CLAUDE.md` §10). Update this table when the
field shifts; archive deep findings as dated reports in this folder.

- **Latest deep report:** [2026-06-15-mcp-registry-landscape.md](./2026-06-15-mcp-registry-landscape.md)
- **Latest daily update:** [2026-06-15-mcp-ecosystem-update.md](./2026-06-15-mcp-ecosystem-update.md)
- **Last updated:** 2026-06-15 (third pass — scheduled test run)

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
| 10 | **Runlayer** | Enterprise gateway + catalog | $11M seed (Khosla/Felicis); MCP founder (D.S. Parra) as consultant; 18,000+ server catalog | Security-approved servers, ABAC, fast-tracked approval; curated vs. raw | Watch closely: well-funded, protocol-authority endorsement, 18K catalog is largest by count |
| 11 | **Kong AI Gateway** | Gateway + registry | Incumbent API-gw; registry in tech preview | Standard API governance patterns | Watch: incumbent entering the space |

**Honorable mentions / watch list:** mcp.so (~20,222, unvetted), MCP Market (~10k, community),
MintMCP (**SOC 2 Type II certified**; STDIO-to-production containerization; 10k+ catalog),
Microsoft MCP Gateway (k8s, no catalog),
**AWS Agent Registry** (April 9, 2026 preview; private org catalog in Bedrock AgentCore; indexes agents/MCP servers/skills; exposes as MCP endpoint; watch for GA),
Composio, Operant, Portkey, Airlock,
agentic-community/mcp-gateway-registry (OSS gateway+registry),
**Agensi** (new Q1-Q2 2026; curated marketplace with automated 8-point security scan; covers SKILL.md + MCP).

## Standing reads

- **White space:** a focused, standalone, MCP-Registry-compatible **curated catalog with a
  documented gateway projection** is uncrowded — most rivals bundle curation into a
  full gateway/runtime suite.
- **Trust is the wedge:** provenance, version-pinning, verification, and change-detection
  are the differentiators buyers care about post-incident (postmark-mcp, CVE-2025-54136,
  CVE-2026-26118, CVE-2026-33032, RSAC 2026's systemic supply-chain advisory,
  VIPER-MCP's 106 zero-days across 39,884 repos, and Akamai's database MCP flaws).
- **NSA validation (May 20, 2026):** The NSA published MCP security design guidance
  explicitly recommending source-verified, reputable MCP registries as a control layer.
  The `discovered != approved != enabled` boundary is exactly the NSA's recommended
  gate. Document: U/OO/6030316-26, 17pp.
  [NSA PDF](https://www.nsa.gov/Portals/75/documents/Cybersecurity/CSI_MCP_SECURITY.pdf)
- **Scale signal (Censys, June 2026):** 12,520 internet-accessible MCP services found;
  ~40% expose tools with no authentication. The unvetted surface grows while our
  approved set stays narrow and verified.
- **Spec watch:** MCP 2026-07-28 RC (locked May 21; ships July 28) removes session state
  and adds mandatory `Mcp-Method`/`Mcp-Name` headers. No catalog schema change required;
  Gateway operator must update transport validation before July 28.
</content>

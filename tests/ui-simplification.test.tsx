import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Sidebar } from "../apps/web/src/app/shell/Sidebar";
import { CapabilityCard } from "../apps/web/src/components/CapabilityCard";
import type { ServerResponse } from "../apps/web/src/api/types";

describe("ui simplification", () => {
  it("keeps advanced navigation visually separated from the primary flow", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Sidebar, {
        active: "overview",
        onSelect: () => undefined,
        adminKey: "",
        onAdminKeyChange: () => undefined
      })
    );

    expect(markup).toContain("Discover");
    expect(markup).toContain("Advanced");
    expect(markup).toContain("Maintenance");
    expect(markup).toContain("API docs");
  });

  it("renders a single explicit import action on discovery cards", () => {
    const server = {
      server: {
        name: "io.github.example/fetch",
        title: "Fetch",
        description: "Fetches a URL and extracts markdown.",
        version: "1.0.0",
        _meta: {}
      },
      _meta: {
        "com.mcp-gateway.registry/curation": {
          status: "pending",
          visibility: "private",
          featured: false,
          tags: [],
          qualityLabel: null,
          notes: null,
          meta: {},
          curatedAt: null
        },
        "com.mcp-gateway.registry/server": {
          sourceNames: ["modelcontextprotocol"],
          isOfficial: true
        }
      }
    } as ServerResponse;

    const markup = renderToStaticMarkup(
      React.createElement(CapabilityCard, {
        server,
        onClick: () => undefined,
        onImport: () => undefined
      })
    );

    expect(markup).toContain("Import");
    expect(markup).not.toContain("Inspect");
  });
});

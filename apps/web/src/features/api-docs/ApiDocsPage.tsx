import { useState } from "react";
import { apiGet } from "../../api/client";
import { Button } from "../../components/Button";
import { JsonBlock } from "../../components/JsonBlock";
import { Badge } from "../../components/Badge";
import type { TagSummary } from "../../api/types";
import { ServerCog, Code2, Tag, Activity } from "lucide-react";

const endpoints = [
  "GET /v0.1/servers",
  "GET /v0.1/servers/:name",
  "GET /v0.1/servers/:name/versions",
  "GET /v0.1/servers/:name/versions/:version",
  "GET /v0.1/catalog",
  "GET /v0.1/search",
  "GET /v0.1/tags",
  "GET /v0.1/sources"
];

export function ApiDocsPage({
  tags,
  activity
}: {
  tags: TagSummary[];
  activity: string[];
}) {
  const [openApi, setOpenApi] = useState<unknown>({});
  const [sample, setSample] = useState<unknown>({});

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">API Reference</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Compatibility surface exposing standard MCP Registry endpoints for clients and gateways.
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <ServerCog className="w-4 h-4 text-primary" /> Endpoints
            </h3>
            <div className="space-y-2">
              {endpoints.map((endpoint) => {
                const [method, path] = endpoint.split(" ");
                return (
                  <div key={endpoint} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50 font-mono text-xs">
                    <span className="font-bold text-primary">{method}</span>
                    <span className="text-muted-foreground">{path}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => void apiGet("/openapi.json").then(setOpenApi)} variant="secondary" className="w-full">
                Fetch OpenAPI Spec
              </Button>
              <Button onClick={() => void apiGet("/v0.1/catalog?limit=3").then(setSample)} variant="secondary" className="w-full">
                Fetch Catalog Sample
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Global Tags
            </h3>
            {tags.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No tags created yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge tone="private" key={tag.slug}>{tag.slug}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Recent Activity
            </h3>
            <div className="space-y-2">
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No recent activity.</p>
              ) : (
                activity.map((line) => (
                  <div key={line} className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3 py-1">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm min-h-[300px]">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" /> Inspector
            </h3>
            <JsonBlock value={Object.keys(sample).length ? sample : Object.keys(openApi).length ? openApi : { message: "Click a button on the left to inspect an API response." }} />
          </div>
        </div>
      </div>
    </div>
  );
}
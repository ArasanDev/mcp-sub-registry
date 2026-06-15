import * as React from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { ServerResponse } from "../api/types";
import { curationMeta, readinessMeta, readinessTone, serverMeta } from "../lib/meta";

export interface CapabilityCardProps {
  server: ServerResponse;
  onClick?: () => void;
  onImport?: (e: React.MouseEvent) => void;
}

// Gets a clean display name, stripping standard prefixes
function getDisplayName(name: string) {
  return name.replace(/^io\.github\.[^/]+\//, "").replace(/^@[^/]+\//, "").split("/").pop() || name;
}

export function CapabilityCard({ server, onClick, onImport }: CapabilityCardProps) {
  const displayName = getDisplayName(server.server.name);
  const letter = displayName.charAt(0).toUpperCase();
  const curation = curationMeta(server);
  const readiness = readinessMeta(server);
  const meta = serverMeta(server);
  const publisher = meta.sourceNames?.[0] || "manual";
  const trustTone = curation.status === "approved" ? "good" : "warn";

  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card/80 transition-all duration-300 hover:cursor-pointer hover:border-primary/25 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl shadow-sm border border-border/60 bg-muted/70 flex items-center justify-center text-xl font-bold text-foreground shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
        >
          {letter}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-base tracking-tight truncate">
                {displayName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{publisher}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge tone={trustTone}>{curation.status || "pending"}</Badge>
              <Badge tone={readinessTone(readiness.status)}>{readiness.status || "unknown"}</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-snug line-clamp-3">
            {server.server.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate">{publisher === "manual" ? "Manual record" : `Source: ${publisher}`}</span>
        <span className="font-mono text-[11px] text-muted-foreground/80">{server.server.version}</span>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onImport?.(e);
          }}
        >
          Import
        </Button>
      </div>
    </div>
  );
}

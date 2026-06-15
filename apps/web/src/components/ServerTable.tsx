import { Badge } from "./Badge";
import type { ServerResponse } from "../api/types";
import {
  curationMeta,
  curationTone,
  lifecycleTone,
  readinessMeta,
  readinessTone,
  serverMeta,
  versionMeta
} from "../lib/meta";
import { formatDate } from "../lib/format";
import { cn } from "../lib/utils";

export function ServerTable({
  rows,
  selectedName,
  onSelect
}: {
  rows: ServerResponse[];
  selectedName?: string | null;
  onSelect: (server: ServerResponse) => void;
}) {
  return (
    <div className="w-full overflow-x-auto border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm shadow-sm">
      <table className="w-full text-left text-sm text-foreground whitespace-nowrap">
        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Name</th>
            <th className="px-6 py-4">Version</th>
            <th className="px-6 py-4">Curation</th>
            <th className="px-6 py-4">Readiness</th>
            <th className="px-6 py-4">Lifecycle</th>
            <th className="px-6 py-4">Source</th>
            <th className="px-6 py-4 rounded-tr-xl">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map((row) => {
            const readiness = readinessMeta(row);
            const serverVersion = versionMeta(row);
            const source = serverMeta(row);
            const curation = curationMeta(row);
            const isSelected = selectedName === row.server.name;

            return (
              <tr
                key={`${row.server.name}:${row.server.version}`}
                className={cn(
                  "hover:bg-muted/50 cursor-pointer transition-colors duration-150 group",
                  isSelected ? "bg-primary/5 hover:bg-primary/10" : ""
                )}
                onClick={() => onSelect(row)}
              >
                <td className="px-6 py-4 max-w-[300px]">
                  <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {row.server.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">
                    {row.server.title || row.server.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                  {row.server.version}
                </td>
                <td className="px-6 py-4">
                  <Badge tone={curationTone(curation.status)}>
                    {curation.status || "pending"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={readinessTone(readiness.status)}>
                    {readiness.status || "unknown"}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={lifecycleTone(serverVersion.status)}>
                    {serverVersion.status || "active"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {source?.sourceNames?.[0] || "manual"}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {formatDate(serverVersion.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
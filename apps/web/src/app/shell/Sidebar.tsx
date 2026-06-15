import type { ReactNode } from "react";
import { advancedTabs, primaryTabs, type Tab } from "../routes";
import { Layers, CheckCircle, Database, Settings, Server, PlusSquare, BookOpen, DownloadCloud } from "lucide-react";
import { cn } from "../../lib/utils";

const ICONS: Record<string, ReactNode> = {
  overview: <Layers className="w-5 h-5" />,
  review: <CheckCircle className="w-5 h-5" />,
  catalog: <BookOpen className="w-5 h-5" />,
  registry: <Database className="w-5 h-5" />,
  sources: <Server className="w-5 h-5" />,
  manual: <PlusSquare className="w-5 h-5" />,
  backup: <DownloadCloud className="w-5 h-5" />,
  api: <Settings className="w-5 h-5" />
};

export function Sidebar({
  active,
  onSelect,
  adminKey,
  onAdminKeyChange
}: {
  active: Tab;
  onSelect: (tab: Tab) => void;
  adminKey: string;
  onAdminKeyChange: (value: string) => void;
}) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full z-10 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          M
        </div>
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight text-[15px] leading-tight text-foreground">MCP Sub-Registry</span>
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Import first</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto" aria-label="Primary">
        <div className="space-y-1">
          {primaryTabs.map(([key, label]) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                type="button"
                onClick={() => onSelect(key)}
              >
                {ICONS[key] || <div className="w-5 h-5" />}
                {label}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/80">
            Advanced
          </p>
          <div className="space-y-1">
            {advancedTabs.map(([key, label]) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground/80 hover:bg-muted hover:text-foreground"
                  )}
                  type="button"
                  onClick={() => onSelect(key)}
                >
                  {ICONS[key] || <div className="w-5 h-5" />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-border/50 space-y-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="adminKey" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Operator Key
          </label>
          <input
            id="adminKey"
            type="password"
            autoComplete="off"
            placeholder="Required for curation"
            value={adminKey}
            onChange={(event) => onAdminKeyChange(event.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>
    </aside>
  );
}

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import type { Tab } from "../routes";

export function AppShell({
  active,
  onSelect,
  adminKey,
  onAdminKeyChange,
  children
}: {
  active: Tab;
  onSelect: (tab: Tab) => void;
  adminKey: string;
  onAdminKeyChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar
        active={active}
        onSelect={onSelect}
        adminKey={adminKey}
        onAdminKeyChange={onAdminKeyChange}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {children}
      </div>
    </div>
  );
}
export const primaryTabs = [
  ["overview", "Discover"],
  ["review", "Review"],
  ["catalog", "Published"],
  ["registry", "Sub-registry"],
  ["sources", "Sources"],
  ["manual", "Add server"]
] as const;

export const advancedTabs = [
  ["backup", "Maintenance"],
  ["api", "API docs"]
] as const;

export const tabs = [...primaryTabs, ...advancedTabs] as const;

export type Tab = (typeof tabs)[number][0];

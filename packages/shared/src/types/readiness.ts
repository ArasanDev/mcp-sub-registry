export type ReadinessStatus =
  | "ready"
  | "needs_secret"
  | "needs_config"
  | "package_only"
  | "remote_only"
  | "unknown"
  | "deprecated"
  | "deleted";

export interface GatewayReadiness {
  status: ReadinessStatus;
  reasons: string[];
  installType: "package" | "remote" | "mixed" | "unknown";
  hasPackage: boolean;
  hasRemote: boolean;
  requiredSecrets: string[];
  requiredConfig: string[];
}

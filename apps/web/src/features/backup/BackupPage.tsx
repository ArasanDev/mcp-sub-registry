import { useState } from "react";
import { apiGet, apiPost } from "../../api/client";
import { Button } from "../../components/Button";
import { JsonBlock } from "../../components/JsonBlock";
import { DownloadCloud, UploadCloud, ShieldAlert } from "lucide-react";

type BackupSummary = {
  sources?: unknown[];
  serverVersions?: unknown[];
  curations?: unknown[];
  tags?: unknown[];
  serverTags?: unknown[];
  tools?: unknown[];
};

export function BackupPage({
  adminKey,
  onActivity,
  onImported
}: {
  adminKey: string;
  onActivity: (line: string) => void;
  onImported: () => void;
}) {
  const [backupText, setBackupText] = useState("");
  const [result, setResult] = useState<unknown>({});
  const [error, setError] = useState("");

  async function exportBackup() {
    setError("");
    try {
      const backup = await apiGet<BackupSummary>("/admin/backup", adminKey);
      setBackupText(JSON.stringify(backup, null, 2));
      setResult(summaryFor(backup));
      onActivity("Exported backup");
    } catch (currentError) {
      setError(errorMessage(currentError));
    }
  }

  async function importBackup() {
    setError("");
    try {
      const parsed = JSON.parse(backupText);
      const imported = await apiPost("/admin/backup/import", parsed, adminKey);
      setResult(imported);
      onActivity("Imported backup");
      onImported();
    } catch (currentError) {
      setError(errorMessage(currentError));
    }
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Backup & Restore</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Export or restore your operator state including sources, server records, manual tools, and curation metadata.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-4">
            <h3 className="font-semibold text-foreground tracking-tight flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-primary" /> JSON Payload
            </h3>
            <div className="flex gap-2">
              <Button onClick={() => void exportBackup()} variant="secondary" size="sm">
                <DownloadCloud className="w-4 h-4 mr-2" /> Export State
              </Button>
              <Button onClick={() => void importBackup()} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                <UploadCloud className="w-4 h-4 mr-2" /> Import State
              </Button>
            </div>
          </div>
          
          <textarea
            className="w-full flex-1 bg-background border border-border rounded-xl p-4 text-xs font-mono text-muted-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none"
            value={backupText}
            onChange={(event) => setBackupText(event.currentTarget.value)}
            placeholder="Click 'Export State' to generate a backup, or paste valid JSON here and click 'Import State' to restore."
          />
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Result
            </h3>
            {error ? (
              <div className="p-3 mb-4 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-500">
                {error}
              </div>
            ) : null}
            <JsonBlock value={result} />
          </div>
        </div>
      </div>
    </div>
  );
}

function summaryFor(backup: BackupSummary) {
  return {
    sources: backup.sources?.length ?? 0,
    serverVersions: backup.serverVersions?.length ?? 0,
    curations: backup.curations?.length ?? 0,
    tags: backup.tags?.length ?? 0,
    serverTags: backup.serverTags?.length ?? 0,
    tools: backup.tools?.length ?? 0
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Backup operation failed";
}

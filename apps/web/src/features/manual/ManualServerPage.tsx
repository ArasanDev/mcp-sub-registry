import { useMemo, useState, type FormEvent } from "react";
import { apiPost } from "../../api/client";
import { Button } from "../../components/Button";
import { JsonBlock } from "../../components/JsonBlock";
import { PlusSquare, Terminal, Package, Key } from "lucide-react";

export function ManualServerPage({
  adminKey,
  onCreated,
  onActivity
}: {
  adminKey: string;
  onCreated: () => void;
  onActivity: (line: string) => void;
}) {
  const [preview, setPreview] = useState<Record<string, unknown>>({});
  const [result, setResult] = useState<unknown>({});

  const template = useMemo(
    () => ({
      name: "io.example/private-server",
      version: "1.0.0",
      title: "Private MCP Server",
      description: "Private MCP server curated into this sub-registry.",
      remotes: [{ type: "streamable-http", url: "https://mcp.example.com/mcp" }]
    }),
    []
  );

  async function createManualServer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const remote = String(form.get("remote") || "");
    const packageIdentifier = String(form.get("packageIdentifier") || "");
    const envName = String(form.get("envName") || "");
    const payload = {
      name: String(form.get("name") || ""),
      version: String(form.get("version") || ""),
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      remotes: remote ? [{ type: String(form.get("remoteType") || "streamable-http"), url: remote }] : undefined,
      packages: packageIdentifier
        ? [
            {
              registryType: String(form.get("registryType") || "npm"),
              identifier: packageIdentifier,
              version: String(form.get("packageVersion") || ""),
              runtimeHint: String(form.get("runtimeHint") || ""),
              transport: { type: "stdio" },
              environmentVariables: envName
                ? [
                    {
                      name: envName,
                      description: String(form.get("envDescription") || ""),
                      isRequired: form.get("envRequired") === "on",
                      isSecret: form.get("envSecret") === "on"
                    }
                  ]
                : undefined
            }
          ]
        : undefined
    };

    setPreview(payload);
    const created = await apiPost("/admin/servers", payload, adminKey);
    setResult(created);
    onActivity(`Created manual server ${payload.name}`);
    onCreated();
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 animate-in fade-in duration-500 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Add server</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Create a minimal private or internal MCP server entry. Advanced package and remote metadata stay hidden by default.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <form className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-8" onSubmit={createManualServer}>
            
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <PlusSquare className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">Identity</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Bundle ID</span>
                  <input name="name" placeholder={template.name} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </label>
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Display Title</span>
                  <input name="title" placeholder={template.title} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </label>
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</span>
                  <textarea name="description" rows={3} placeholder={template.description} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Version</span>
                  <input name="version" placeholder={template.version} required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                </label>
              </div>
            </section>

            <details className="space-y-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center gap-2 border-b border-border/50 pb-2 text-lg font-semibold tracking-tight text-foreground">
                <Terminal className="w-5 h-5 text-primary" />
                Advanced metadata
              </summary>
              <div className="space-y-6 pt-4">
                <section className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Transport</span>
                      <select name="remoteType" defaultValue="streamable-http" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                        <option value="streamable-http">Streamable HTTP</option>
                        <option value="sse">SSE</option>
                      </select>
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Endpoint URL</span>
                      <input name="remote" placeholder="https://mcp.example.com/mcp" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                    </label>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">Local package</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Registry</span>
                      <select name="registryType" defaultValue="npm" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
                        <option value="npm">npm</option>
                        <option value="pypi">PyPI</option>
                        <option value="oci">OCI</option>
                        <option value="nuget">NuGet</option>
                      </select>
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Package Version</span>
                      <input name="packageVersion" placeholder="1.0.0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Identifier</span>
                      <input name="packageIdentifier" placeholder="@scope/server" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Runtime Hint</span>
                      <input name="runtimeHint" placeholder="npx" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                    </label>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <Key className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">Environment config</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Variable Name</span>
                      <input name="envName" placeholder="API_KEY" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</span>
                      <input name="envDescription" placeholder="API key used by the server" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                    </label>
                    <div className="flex gap-6 md:col-span-2 mt-2">
                      <label className="flex items-center gap-2">
                        <input name="envRequired" type="checkbox" className="w-4 h-4 rounded border-border" />
                        <span className="text-sm font-medium text-foreground">Required</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input name="envSecret" type="checkbox" className="w-4 h-4 rounded border-border" />
                        <span className="text-sm font-medium text-foreground">Secret</span>
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </details>

            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" size="lg">Create Private Server</Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Payload Preview</h3>
            <JsonBlock value={preview} />
          </div>
          
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Creation Result</h3>
            <JsonBlock value={result} />
          </div>
        </div>
      </div>
    </div>
  );
}

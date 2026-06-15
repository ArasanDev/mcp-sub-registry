export function Topbar({
  health,
  registryCount,
  catalogCount
}: {
  health: string;
  registryCount: number;
  catalogCount: number;
}) {
  const isHealthy = health === "healthy" || health === "ok";
  
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 glass z-10 shrink-0 sticky top-0">
      <div>
        <h2 className="font-semibold text-foreground tracking-tight text-sm hidden md:block">
          Trusted catalog
        </h2>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          <span className="text-foreground">{registryCount}</span> indexed
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          <span className="font-bold">{catalogCount}</span> approved
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isHealthy ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
          <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
          System {health}
        </div>
      </div>
    </header>
  );
}

import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Shell } from "@/components/layout/shell";
import { DashboardPage } from "@/routes/dashboard";
import { CatalogPage } from "@/routes/catalog";
import { UpstreamPage } from "@/routes/upstream";
import { GatewayPage } from "@/routes/gateway";
import { SettingsPage } from "@/routes/settings";
import { PublicCatalogPage } from "@/routes/public-catalog";
import { PublicServerPage } from "@/routes/public-server";

// Root route — renders children directly; layout is applied per-group below
const rootRoute = createRootRoute({
  component: () => <Outlet />
});

// ── Admin routes (wrapped in Shell sidebar) ──────────────────────
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: () => (
    <Shell>
      <Outlet />
    </Shell>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: DashboardPage
});

const catalogRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/catalog",
  component: CatalogPage
});

const catalogDetailRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/catalog/$name",
  component: () => {
    const { name } = catalogDetailRoute.useParams();
    return <CatalogPage preselect={decodeURIComponent(name)} />;
  }
});

const upstreamRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/upstream",
  component: UpstreamPage
});

const gatewayRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/gateway",
  component: GatewayPage
});

const settingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: SettingsPage
});

// ── Public routes (no Shell — full-page brand UI) ─────────────────
const publicServersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/servers",
  component: PublicCatalogPage
});

const publicServerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/server/$slug",
  component: () => {
    const { slug } = publicServerDetailRoute.useParams();
    return <PublicServerPage slug={slug} />;
  }
});

const routeTree = rootRoute.addChildren([
  adminLayoutRoute.addChildren([
    indexRoute,
    catalogRoute,
    catalogDetailRoute,
    upstreamRoute,
    gatewayRoute,
    settingsRoute
  ]),
  publicServersRoute,
  publicServerDetailRoute
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

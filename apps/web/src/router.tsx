import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { Shell } from "@/components/layout/shell";
import { DashboardPage } from "@/routes/dashboard";
import { CatalogPage } from "@/routes/catalog";
import { UpstreamPage } from "@/routes/upstream";
import { GatewayPage } from "@/routes/gateway";
import { SettingsPage } from "@/routes/settings";

const rootRoute = createRootRoute({
  component: () => (
    <Shell>
      <Outlet />
    </Shell>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage
});

const catalogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog/$name",
  component: () => {
    const { name } = catalogDetailRoute.useParams();
    return <CatalogPage preselect={decodeURIComponent(name)} />;
  }
});

const upstreamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upstream",
  component: UpstreamPage
});

const gatewayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gateway",
  component: GatewayPage
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  catalogDetailRoute,
  upstreamRoute,
  gatewayRoute,
  settingsRoute
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

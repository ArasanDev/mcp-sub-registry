export type RiskLevel = "Low" | "Medium" | "High";
export type AuthType = "OAuth" | "API Key" | "None";

export interface PublicTool {
  name: string;
  description: string;
}

export interface PublicServer {
  slug: string;
  name: string;
  description: string;
  category: string;
  auth: AuthType;
  risk: RiskLevel;
  toolCount: number;
  tools?: PublicTool[];
  toolsNote?: string;
  authSetup?: string;
  schemaHash?: string;
}

export const PUBLIC_SERVERS: PublicServer[] = [
  {
    slug: "github-mcp",
    name: "GitHub MCP",
    description: "Full GitHub API: repos, PRs, issues, actions",
    category: "Dev Tools",
    auth: "OAuth",
    risk: "Low",
    toolCount: 26,
    tools: [
      { name: "github::create_repository", description: "Create a new GitHub repository under your account or org" },
      { name: "github::fork_repository", description: "Fork an existing repository to your account" },
      { name: "github::create_or_update_file", description: "Create or update a single file in a repository" },
      { name: "github::search_repositories", description: "Search GitHub repositories by query" },
      { name: "github::push_files", description: "Push multiple files in one commit to a repository" },
      { name: "github::create_pull_request", description: "Open a pull request from a branch" },
      { name: "github::list_issues", description: "List issues for a repository with filters" },
      { name: "github::create_issue", description: "Create a new issue in a repository" },
      { name: "github::search_code", description: "Search code across GitHub repositories" }
    ],
    toolsNote: "Showing 9 of 26 tools.",
    authSetup: "Configure a GitHub OAuth App or use a Personal Access Token. Set the token as GITHUB_TOKEN in your gateway credential store. OAuth flow is handled automatically when the user authenticates via the gateway.",
    schemaHash: "sha256:a3f8c2e1d4b7091f5e6a8c3d2b1e4f7a9c0d3e6f8a1b4c7d0e3f6a9b2c5d8e1"
  },
  {
    slug: "brave-search",
    name: "Brave Search",
    description: "Web and news search via Brave Search API",
    category: "Search",
    auth: "API Key",
    risk: "Low",
    toolCount: 2,
    tools: [
      { name: "brave::web_search", description: "Search the web using Brave Search" },
      { name: "brave::news_search", description: "Search recent news articles via Brave" }
    ],
    authSetup: "Generate an API key at brave.com/search/api. Store as BRAVE_API_KEY in your gateway credential store.",
    schemaHash: "sha256:b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8b1c4"
  },
  {
    slug: "stripe",
    name: "Stripe",
    description: "Payments, customers, invoices via Stripe API",
    category: "Payments",
    auth: "API Key",
    risk: "Medium",
    toolCount: 14,
    tools: [
      { name: "stripe::create_payment_intent", description: "Create a new payment intent" },
      { name: "stripe::retrieve_customer", description: "Retrieve a customer object by ID" },
      { name: "stripe::list_invoices", description: "List invoices for a customer" },
      { name: "stripe::create_refund", description: "Refund a charge" }
    ],
    authSetup: "Use a Stripe Secret Key from the Stripe Dashboard (Developers → API Keys). Store as STRIPE_SECRET_KEY. Use restricted keys scoped to only the operations you need.",
    schemaHash: "sha256:c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5"
  },
  {
    slug: "grafana",
    name: "Grafana",
    description: "Query and explore Grafana dashboards and metrics",
    category: "Observability",
    auth: "API Key",
    risk: "Low",
    toolCount: 8,
    tools: [
      { name: "grafana::search_dashboards", description: "Search for dashboards by query string" },
      { name: "grafana::get_dashboard", description: "Retrieve a dashboard by UID" },
      { name: "grafana::query_datasource", description: "Execute a query against a Grafana datasource" },
      { name: "grafana::list_alerts", description: "List all alert rules" }
    ],
    authSetup: "Create a Grafana Service Account with Viewer role and generate a token. Store as GRAFANA_API_KEY. Set GRAFANA_URL to your instance URL.",
    schemaHash: "sha256:d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6"
  },
  {
    slug: "linear",
    name: "Linear",
    description: "Issues, projects, and cycles via Linear API",
    category: "Project Mgmt",
    auth: "OAuth",
    risk: "Low",
    toolCount: 11,
    tools: [
      { name: "linear::create_issue", description: "Create a new issue in a team" },
      { name: "linear::list_issues", description: "List issues with filters" },
      { name: "linear::update_issue", description: "Update issue status, priority, or assignee" },
      { name: "linear::list_projects", description: "List projects for a workspace" }
    ],
    authSetup: "Set up a Linear OAuth App in Settings → API → OAuth applications. The gateway handles the OAuth flow. Users authorize per-workspace.",
    schemaHash: "sha256:e4f7a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7"
  },
  {
    slug: "notion",
    name: "Notion",
    description: "Pages, databases, and blocks via Notion API",
    category: "Productivity",
    auth: "OAuth",
    risk: "Low",
    toolCount: 18,
    tools: [
      { name: "notion::search_pages", description: "Search pages and databases in your workspace" },
      { name: "notion::get_page", description: "Retrieve a page and its properties" },
      { name: "notion::create_page", description: "Create a new page in a database or as a subpage" },
      { name: "notion::query_database", description: "Query a Notion database with filters and sorts" }
    ],
    authSetup: "Create a Notion Integration at notion.so/my-integrations. For full access, use OAuth 2.0 — the gateway handles the authorization flow. Share specific pages/databases with the integration.",
    schemaHash: "sha256:f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8"
  },
  {
    slug: "aws-kb-retrieval",
    name: "AWS KB Retrieval",
    description: "Query AWS Knowledge Base via Bedrock",
    category: "Cloud",
    auth: "API Key",
    risk: "Medium",
    toolCount: 1,
    tools: [
      { name: "aws_kb::retrieve", description: "Retrieve relevant passages from an AWS Bedrock Knowledge Base" }
    ],
    authSetup: "Requires AWS credentials with bedrock:Retrieve permission on the target Knowledge Base. Configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_KB_ID in the gateway credential store. Use an IAM role with least-privilege access.",
    schemaHash: "sha256:a0b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3"
  },
  {
    slug: "playwright",
    name: "Playwright",
    description: "Browser automation and web scraping",
    category: "Testing",
    auth: "None",
    risk: "High",
    toolCount: 5,
    tools: [
      { name: "playwright::navigate", description: "Navigate the browser to a URL" },
      { name: "playwright::screenshot", description: "Take a screenshot of the current page" },
      { name: "playwright::click", description: "Click an element on the page" },
      { name: "playwright::fill", description: "Fill a form input with a value" },
      { name: "playwright::evaluate", description: "Execute JavaScript in the browser context" }
    ],
    authSetup: "No authentication required — this server runs as a local process via the Connector Runtime. The gateway must be configured to run it in a sandboxed environment. Review the risk level before enabling in production.",
    schemaHash: "sha256:b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8b1c4"
  }
];

export function getServerBySlug(slug: string): PublicServer | undefined {
  return PUBLIC_SERVERS.find(s => s.slug === slug);
}

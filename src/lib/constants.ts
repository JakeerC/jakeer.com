import { IconType } from "react-icons";
import { siteConfig } from "./config";
import {
  SiReact,
  SiSpringboot,
  SiApachekafka,
  SiRedis,
  SiPostgresql,
  SiTypescript,
  SiStorybook,
  SiVite,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiNextdotjs,
  SiGithub,
  SiGit,
  SiGnubash,
  SiAuth0,
  SiJavascript,
} from "react-icons/si";
import { FaJava, FaAws, FaDocker } from "react-icons/fa";
import { MdArchitecture } from "react-icons/md";
import {
  LuCode,
  LuTrendingUp,
  LuBrain,
  LuWorkflow,
  LuDatabase,
} from "react-icons/lu";
import { VscMcp } from "react-icons/vsc";

export const recentPosts = [
  {
    index: 1,
    slug: "react-performance-optimization",
    title: "React Performance Optimization: From Good to Great",
    excerpt:
      "Deep dive into memoization, lazy loading, and virtual DOM optimization techniques that cut render time by 60% in production.",
    date: "Jul 10, 2026",
    readTime: "8 min read",
    tags: ["React", "Performance"],
  },
  {
    index: 2,
    slug: "spring-boot-microservices",
    title: "Building Resilient Microservices with Spring Boot & Resilience4j",
    excerpt:
      "How circuit breakers, bulkheads, and retry patterns keep your financial services alive when dependencies fail.",
    date: "Jun 28, 2026",
    readTime: "12 min read",
    tags: ["Java", "Spring Boot"],
  },
  {
    index: 3,
    slug: "system-design-api-gateway",
    title: "Designing an API Gateway: Patterns and Anti-Patterns",
    excerpt:
      "Rate limiting, auth aggregation, request routing — what a well-designed gateway buys you and where teams go wrong.",
    date: "Jun 15, 2026",
    readTime: "10 min read",
    tags: ["System Design", "Architecture"],
  },
];

/******* Projects *************/
export const projects = [
  {
    name: "Resilient Payment Processor",
    description:
      "High-throughput payment processing service handling 10K+ transactions/sec with automatic retry, idempotency, and dead-letter queue support for financial-grade reliability.",
    tags: ["Java", "Spring Boot", "Kafka", "Redis", "PostgreSQL"],
    github: "#",
    demo: "",
    status: "Production",
    features: [
      "Idempotent API design prevents double-charges",
      "Distributed tracing with Zipkin + Sleuth",
      "Auto-scaling on AWS ECS with CloudWatch",
      "Circuit breaker via Resilience4j",
      "99.99% uptime SLA maintained for 18 months",
    ],
  },
  {
    name: "React Design System",
    description:
      "A battle-tested component library used across 5 internal Wells Fargo applications — accessible, theme-able, and fully typed with comprehensive Storybook documentation.",
    tags: ["React", "TypeScript", "Storybook", "Vite", "CSS Modules"],
    github: "#",
    demo: "#",
    status: "Active",
    features: [
      "WCAG 2.1 AA compliant out of the box",
      "Dark & light themes via CSS custom properties",
      "40+ components with prop-type documentation",
      "100% TypeScript with generics support",
      "Tree-shakeable exports for optimal bundle size",
    ],
  },
  {
    name: "API Rate Limiter Middleware",
    description:
      "Express.js middleware implementing token bucket and sliding window algorithms for precise API rate limiting with Redis-backed distributed counters.",
    tags: ["Node.js", "Redis", "TypeScript", "Express"],
    github: "#",
    demo: "",
    status: "Open Source",
    features: [
      "Token bucket and sliding window algorithms",
      "Redis-backed for distributed systems",
      "Per-user and per-route granularity",
      "Configurable response headers",
      "Zero external dependencies beyond Redis client",
    ],
  },
  {
    name: "DevDash — Developer Dashboard",
    description:
      "A personal developer dashboard aggregating GitHub stats, Jira tickets, Confluence docs, and CI/CD pipeline status in a single unified interface.",
    tags: ["Next.js", "React", "TypeScript", "GitHub API"],
    github: "#",
    demo: "#",
    status: "Personal",
    features: [
      "Real-time GitHub activity graph",
      "Jira sprint board integration",
      "CI/CD pipeline status at a glance",
      "Customizable widget layout",
      "Dark mode with CSS design tokens",
    ],
  },
];

export const featuredProjects = [
  {
    name: "Resilient Payment Processor",
    description:
      "High-throughput payment processing service handling 10K+ transactions/sec with automatic retry, idempotency, and DLQ support.",
    tags: ["Java", "Spring Boot", "Kafka", "Redis"],
    link: siteConfig.socials.github,
    features: [
      "Idempotent API design",
      "Distributed tracing with Zipkin",
      "Auto-scaling on AWS ECS",
      "99.99% uptime SLA",
    ],
  },
  {
    name: "React Design System",
    description:
      "A battle-tested component library used across 5 internal Wells Fargo apps — accessible, theme-able, and fully typed.",
    tags: ["React", "TypeScript", "Storybook", "Vite"],
    link: siteConfig.socials.github,
    features: [
      "WCAG 2.1 AA compliant",
      "Dark & light themes",
      "Comprehensive Storybook docs",
      "Tree-shakeable exports",
    ],
  },
];

export const statusColors: Record<string, string> = {
  Production: "#22c55e",
  Active: "#3b82f6",
  "Open Source": "var(--accent)",
  Personal: "#f59e0b",
};
/******* Projects *************/

export const snippetCategories = [
  {
    slug: "react",
    label: "React",
    count: 12,
    description: "Hooks, patterns, optimization",
  },
  {
    slug: "java",
    label: "Java",
    count: 8,
    description: "Spring Boot, streams, patterns",
  },
  {
    slug: "typescript",
    label: "TypeScript",
    count: 10,
    description: "Types, generics, utilities",
  },
  {
    slug: "git",
    label: "Git",
    count: 15,
    description: "Aliases, workflows, fixups",
  },
  {
    slug: "aws",
    label: "AWS CLI",
    count: 9,
    description: "S3, EC2, IAM, Lambda",
  },
  {
    slug: "shell",
    label: "Shell / Bash",
    count: 11,
    description: "One-liners, scripts, utils",
  },
];

export const ADMIN_TAG_OPTIONS = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Java",
  "Spring Boot",
  "System Design",
  "Architecture",
  "Kafka",
  "Distributed Systems",
  "PostgreSQL",
  "Database",
  "Performance",
  "CSS",
  "Tailwind",
  "Git",
  "AWS",
  "Shell / Bash",
].map((tag) => ({ label: tag, value: tag }));

export const ADMIN_CATEGORY_OPTIONS = [
  { label: "Writing", value: "writing" },
  { label: "Snippet", value: "snippets" },
  { label: "Tool", value: "tools" },
  { label: "Note", value: "notes" },
];

export const ADMIN_LANG_OPTIONS = [
  { label: "Select Language", value: "" },
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "React", value: "react" },
  { label: "JSX", value: "jsx" },
  { label: "Java", value: "java" },
  { label: "Bash / Shell", value: "bash" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "CSS", value: "css" },
  { label: "HTML", value: "html" },
  { label: "SQL", value: "sql" },
  { label: "JSON", value: "json" },
  { label: "YAML", value: "yaml" },
  { label: "Markdown", value: "markdown" },
];

export const ADMIN_LEVEL_OPTIONS = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

export const iconMap: Record<string, IconType> = {
  "AI/ML": LuBrain,
  Architecture: MdArchitecture,
  AWS: FaAws,
  "AWS CLI": FaAws,
  "Caching & Load Distribution": SiRedis,
  "CI/CD": LuWorkflow,
  "CSS Modules": SiCss,
  Database: LuDatabase,
  Databases: SiPostgresql,
  Development: LuCode,
  "Docker/K8s": FaDocker,
  Express: SiExpress,
  Fundamentals: SiJavascript,
  Git: SiGit,
  "GitHub API": SiGithub,
  Java: FaJava,
  JavaScript: SiJavascript,
  Kafka: SiApachekafka,
  MCP: VscMcp,
  "Messaging & Event Streaming": SiApachekafka,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  Performance: LuTrendingUp,
  PostgreSQL: SiPostgresql,
  React: SiReact,
  Redis: SiRedis,
  Security: SiAuth0,
  "Shell / Bash": SiGnubash,
  "Spring Boot": SiSpringboot,
  Storybook: SiStorybook,
  "System Design": MdArchitecture,
  TypeScript: SiTypescript,
  Vite: SiVite,
};

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
import { LuCode, LuTrendingUp, LuBrain, LuNetwork, LuWorkflow } from "react-icons/lu";

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

export const knowledgeBases = [
  {
    slug: "java",
    label: "Java",
    description: "JVM internals, Spring Boot, design patterns, and concurrency.",
    icon: "Java",
    color: "#f89820",
    principles: [
      { label: "CORE CONCEPTS", text: "Deep dive into JVM internals and memory management." },
      { label: "SPRING BOOT", text: "Production-ready patterns and best practices." },
      { label: "PERFORMANCE", text: "Concurrency, threading, and optimization." },
    ],
    topics: [
      {
        label: "JVM Internals",
        notes: [
          { slug: "garbage-collection", title: "Garbage Collection Algorithms", minutes: 8 },
          { slug: "memory-model", title: "Java Memory Model", minutes: 6 },
        ],
      },
    ],
  },
  {
    slug: "javascript",
    label: "JavaScript",
    description: "Closures, event loop, ES modules, and async patterns.",
    icon: "JavaScript",
    color: "#f7df1e",
    principles: [
      { label: "THE EVENT LOOP", text: "Understanding the call stack and task queues." },
      { label: "ASYNC PATTERNS", text: "Promises, async/await, and error handling." },
      { label: "UNDER THE HOOD", text: "Execution context, closures, and prototypes." },
    ],
    topics: [
      {
        label: "Core Concepts",
        notes: [
          { slug: "event-loop", title: "The Event Loop Explained", minutes: 5 },
          { slug: "closures", title: "Mastering Closures", minutes: 4 },
        ],
      },
    ],
  },
  {
    slug: "typescript",
    label: "TypeScript",
    description: "Advanced types, generics, utility types, and type guards.",
    icon: "TypeScript",
    color: "#3178c6",
    principles: [
      { label: "TYPE SAFETY", text: "Catching errors at compile time." },
      { label: "GENERICS", text: "Writing reusable, type-safe components." },
      { label: "ADVANCED TYPES", text: "Mapped types, conditional types, and more." },
    ],
    topics: [
      {
        label: "Advanced Types",
        notes: [
          { slug: "generics-deep-dive", title: "Generics Deep Dive", minutes: 7 },
          { slug: "utility-types", title: "Essential Utility Types", minutes: 5 },
        ],
      },
    ],
  },
  {
    slug: "react",
    label: "React",
    description: "Hooks, render optimization, state management, and server components.",
    icon: "React",
    color: "#61dafb",
    principles: [
      { label: "COMPONENT LIFECYCLE", text: "Understanding mounts, updates, and unmounts." },
      { label: "PERFORMANCE", text: "Memoization, lazy loading, and rendering." },
      { label: "STATE MANAGEMENT", text: "Context, reducers, and global state." },
    ],
    topics: [
      {
        label: "Optimization",
        notes: [
          { slug: "render-optimization", title: "Render Optimization", minutes: 8 },
          { slug: "hooks-best-practices", title: "Hooks Best Practices", minutes: 6 },
        ],
      },
    ],
  },
  {
    slug: "ai-ml",
    label: "AI/ML",
    description: "LLMs, prompt engineering, RAG, embeddings, and fine-tuning.",
    icon: "AI/ML",
    color: "#10a37f",
    principles: [
      { label: "LARGE LANGUAGE MODELS", text: "Architecture, tokens, and context windows." },
      { label: "PROMPT ENGINEERING", text: "Techniques for better model outputs." },
      { label: "APPLIED AI", text: "RAG, embeddings, and vector databases." },
    ],
    topics: [
      {
        label: "LLM Fundamentals",
        notes: [
          { slug: "prompt-engineering", title: "Prompt Engineering Techniques", minutes: 5 },
          { slug: "rag-architecture", title: "RAG Architecture Overview", minutes: 7 },
        ],
      },
    ],
  },
  {
    slug: "mcp",
    label: "MCP",
    description: "Model Context Protocol, tool use, and server architecture.",
    icon: "MCP",
    color: "#8b5cf6",
    principles: [
      { label: "PROTOCOL BASICS", text: "Understanding the Model Context Protocol." },
      { label: "TOOL USE", text: "Exposing functions and APIs to models." },
      { label: "SERVER ARCHITECTURE", text: "Building robust MCP servers." },
    ],
    topics: [
      {
        label: "Getting Started",
        notes: [
          { slug: "mcp-introduction", title: "Introduction to MCP", minutes: 4 },
          { slug: "building-mcp-server", title: "Building an MCP Server", minutes: 8 },
        ],
      },
    ],
  },
  {
    slug: "ci-cd",
    label: "CI/CD",
    description: "GitHub Actions, Jenkins, Docker builds, and deployment strategies.",
    icon: "CI/CD",
    color: "#2088ff",
    principles: [
      { label: "AUTOMATION", text: "Automating builds, tests, and deployments." },
      { label: "PIPELINES", text: "Designing efficient CI/CD pipelines." },
      { label: "DEPLOYMENT", text: "Blue/green, canary, and rolling updates." },
    ],
    topics: [
      {
        label: "Pipelines",
        notes: [
          { slug: "github-actions-guide", title: "GitHub Actions Guide", minutes: 6 },
          { slug: "deployment-strategies", title: "Deployment Strategies", minutes: 5 },
        ],
      },
    ],
  },
  {
    slug: "system-design",
    label: "System Design",
    description: "CAP theorem, caching, databases, and messaging.",
    icon: "System Design",
    color: "#ec4899",
    principles: [
      { label: "DEFINITION FIRST", text: "The first sentence answers 'what is it'." },
      { label: "TRADE-OFFS WITH REAL NUMBERS", text: "Every note has a trade-off table." },
      { label: "REVIEWED, NOT ABANDONED", text: "Every claim is checked against primary sources." },
    ],
    topics: [
      {
        label: "Fundamentals",
        notes: [
          { slug: "cap-theorem", title: "CAP Theorem", minutes: 6 },
          { slug: "latency-numbers", title: "Latency Numbers Every Dev Knows", minutes: 4 },
        ],
      },
      {
        label: "Caching & Load Distribution",
        notes: [
          { slug: "caching-fundamentals", title: "Caching Fundamentals", minutes: 10 },
          { slug: "consistent-hashing", title: "Consistent Hashing", minutes: 8 },
        ],
      },
    ],
  },
  {
    slug: "docker-k8s",
    label: "Docker/K8s",
    description: "Containerization, orchestration, Helm charts, and networking.",
    icon: "Docker/K8s",
    color: "#2496ed",
    principles: [
      { label: "CONTAINERIZATION", text: "Building and optimizing Docker images." },
      { label: "ORCHESTRATION", text: "Kubernetes architecture and resources." },
      { label: "OPERATIONS", text: "Networking, storage, and Helm charts." },
    ],
    topics: [
      {
        label: "Containers",
        notes: [
          { slug: "docker-best-practices", title: "Docker Best Practices", minutes: 5 },
          { slug: "k8s-architecture", title: "Kubernetes Architecture", minutes: 8 },
        ],
      },
    ],
  },
  {
    slug: "aws",
    label: "AWS",
    description: "Core services, IAM, Lambda, S3, EC2, and VPC.",
    icon: "AWS",
    color: "#ff9900",
    principles: [
      { label: "CLOUD NATIVE", text: "Designing for scale and resilience." },
      { label: "SECURITY", text: "IAM, VPCs, and least privilege." },
      { label: "SERVERLESS", text: "Lambda, API Gateway, and DynamoDB." },
    ],
    topics: [
      {
        label: "Compute",
        notes: [
          { slug: "ec2-vs-lambda", title: "EC2 vs Lambda", minutes: 4 },
          { slug: "vpc-fundamentals", title: "VPC Fundamentals", minutes: 7 },
        ],
      },
    ],
  },
];

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

export const ADMIN_TOPIC_OPTIONS = [
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "AI/ML", value: "ai-ml" },
  { label: "MCP", value: "mcp" },
  { label: "CI/CD", value: "ci-cd" },
  { label: "System Design", value: "system-design" },
  { label: "Docker/K8s", value: "docker-k8s" },
  { label: "AWS", value: "aws" },
];

export const ADMIN_SUBTOPIC_MAP: Record<string, { label: string; value: string }[]> = {
  "java": [
    { label: "JVM Internals", value: "JVM Internals" },
    { label: "Spring Boot", value: "Spring Boot" },
    { label: "Concurrency", value: "Concurrency" },
    { label: "Design Patterns", value: "Design Patterns" },
  ],
  "javascript": [
    { label: "Core Concepts", value: "Core Concepts" },
    { label: "Event Loop", value: "Event Loop" },
    { label: "Async Programming", value: "Async Programming" },
  ],
  "typescript": [
    { label: "Advanced Types", value: "Advanced Types" },
    { label: "Generics", value: "Generics" },
    { label: "Configuration", value: "Configuration" },
  ],
  "react": [
    { label: "Hooks", value: "Hooks" },
    { label: "Optimization", value: "Optimization" },
    { label: "Server Components", value: "Server Components" },
  ],
  "ai-ml": [
    { label: "LLM Fundamentals", value: "LLM Fundamentals" },
    { label: "Prompt Engineering", value: "Prompt Engineering" },
    { label: "RAG & Embeddings", value: "RAG & Embeddings" },
  ],
  "mcp": [
    { label: "Getting Started", value: "Getting Started" },
    { label: "Tool Use", value: "Tool Use" },
    { label: "Server Architecture", value: "Server Architecture" },
  ],
  "ci-cd": [
    { label: "Pipelines", value: "Pipelines" },
    { label: "GitHub Actions", value: "GitHub Actions" },
    { label: "Deployment Strategies", value: "Deployment Strategies" },
  ],
  "system-design": [
    { label: "Fundamentals", value: "Fundamentals" },
    { label: "Caching & Load Distribution", value: "Caching & Load Distribution" },
    { label: "Databases", value: "Databases" },
    { label: "Messaging & Event Streaming", value: "Messaging & Event Streaming" },
  ],
  "docker-k8s": [
    { label: "Containers", value: "Containers" },
    { label: "Kubernetes", value: "Kubernetes" },
    { label: "Helm", value: "Helm" },
  ],
  "aws": [
    { label: "Compute", value: "Compute" },
    { label: "Storage", value: "Storage" },
    { label: "Networking", value: "Networking" },
  ],
};

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
  React: SiReact,
  JavaScript: SiJavascript,
  Performance: LuTrendingUp,
  Java: FaJava,
  "Spring Boot": SiSpringboot,
  Kafka: SiApachekafka,
  Redis: SiRedis,
  PostgreSQL: SiPostgresql,
  TypeScript: SiTypescript,
  Storybook: SiStorybook,
  Vite: SiVite,
  "CSS Modules": SiCss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  "Next.js": SiNextdotjs,
  "GitHub API": SiGithub,
  "System Design": FaAws,
  Architecture: FaAws,
  Git: SiGit,
  "AWS CLI": FaAws,
  AWS: FaAws,
  "Shell / Bash": SiGnubash,
  Development: LuCode,
  Security: SiAuth0,
  Fundamentals: SiJavascript,
  "Caching & Load Distribution": SiRedis,
  Databases: SiPostgresql,
  "Messaging & Event Streaming": SiApachekafka,
  "AI/ML": LuBrain,
  MCP: LuNetwork,
  "CI/CD": LuWorkflow,
  "Docker/K8s": FaDocker,
};

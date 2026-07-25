import { Code2, Terminal, GitBranch, Cloud, Cpu, Globe, Key, Shield, Wrench } from "lucide-react";

export const posts = [
  {
    slug:     "react-performance-optimization",
    title:    "React Performance Optimization: From Good to Great",
    excerpt:  "Deep dive into memoization, lazy loading, and virtual DOM optimization techniques that cut render time by 60% in production.",
    date:     "Jul 10, 2026",
    readTime: "8 min read",
    tags:     ["React", "Performance", "JavaScript"],
    featured: true,
  },
  {
    slug:     "spring-boot-microservices",
    title:    "Building Resilient Microservices with Spring Boot & Resilience4j",
    excerpt:  "How circuit breakers, bulkheads, and retry patterns keep your financial services alive when dependencies fail.",
    date:     "Jun 28, 2026",
    readTime: "12 min read",
    tags:     ["Java", "Spring Boot", "Microservices"],
    featured: false,
  },
  {
    slug:     "system-design-api-gateway",
    title:    "Designing an API Gateway: Patterns and Anti-Patterns",
    excerpt:  "Rate limiting, auth aggregation, request routing — what a well-designed gateway buys you and where teams go wrong.",
    date:     "Jun 15, 2026",
    readTime: "10 min read",
    tags:     ["System Design", "Architecture"],
    featured: false,
  },
  {
    slug:     "typescript-advanced-types",
    title:    "Advanced TypeScript Patterns for Large Codebases",
    excerpt:  "Conditional types, mapped types, template literal types, and infer — practical patterns that make your types work harder.",
    date:     "Jun 5, 2026",
    readTime: "9 min read",
    tags:     ["TypeScript", "JavaScript"],
    featured: false,
  },
  {
    slug:     "kafka-consumer-groups",
    title:    "Kafka Consumer Groups: What Nobody Tells You",
    excerpt:  "Rebalancing, offset commits, partition assignment strategies — the gaps between the docs and production reality.",
    date:     "May 20, 2026",
    readTime: "11 min read",
    tags:     ["Kafka", "Distributed Systems"],
    featured: false,
  },
  {
    slug:     "postgres-indexing-guide",
    title:    "A Practical Guide to PostgreSQL Indexing",
    excerpt:  "B-Tree vs GIN vs BRIN — when to use each, how to spot missing indexes, and the queries that catch slow paths.",
    date:     "May 8, 2026",
    readTime: "7 min read",
    tags:     ["PostgreSQL", "Database"],
    featured: false,
  },
];

export const tools = [
  {
    slug:        "json-formatter",
    name:        "JSON Formatter",
    description: "Format, validate, and minify JSON. Detects errors and highlights the problematic line.",
    icon:        Code2,
    category:    "Development",
    link:        "https://jsonformatter.curiousconcept.com",
  },
  {
    slug:        "regex-tester",
    name:        "Regex Tester",
    description: "Test and debug regular expressions in real-time with match highlighting and explanations.",
    icon:        Key,
    category:    "Development",
    link:        "https://regex101.com",
  },
  {
    slug:        "jwt-decoder",
    name:        "JWT Decoder",
    description: "Decode and verify JWT tokens — inspect header, payload, and signature without sending data to a server.",
    icon:        Shield,
    category:    "Security",
    link:        "https://jwt.io",
  },
  {
    slug:        "cron-parser",
    name:        "Cron Expression Parser",
    description: "Human-readable descriptions for cron schedules. See exactly when your job will run next.",
    icon:        Wrench,
    category:    "Development",
    link:        "https://crontab.guru",
  },
  {
    slug:        "base64",
    name:        "Base64 Encoder / Decoder",
    description: "Encode or decode Base64 strings client-side — no data leaves your browser.",
    icon:        Key,
    category:    "Development",
    link:        "https://www.base64decode.org",
  },
  {
    slug:        "url-encoder",
    name:        "URL Encoder",
    description: "Encode and decode URL components quickly — useful when debugging query strings.",
    icon:        Globe,
    category:    "Development",
    link:        "https://www.urlencoder.org",
  },
  {
    slug:        "diff-checker",
    name:        "Diff Checker",
    description: "Compare two blocks of text side by side and see exactly what changed.",
    icon:        Code2,
    category:    "Development",
    link:        "https://www.diffchecker.com",
  },
  {
    slug:        "http-status",
    name:        "HTTP Status Reference",
    description: "Quick reference for all HTTP status codes — meanings, when to use them, and common mistakes.",
    icon:        Globe,
    category:    "Development",
    link:        "https://httpstatuses.io",
  },
  {
    slug:        "ssl-checker",
    name:        "SSL Certificate Checker",
    description: "Inspect SSL/TLS certificates, check expiry, and verify the chain for any hostname.",
    icon:        Shield,
    category:    "Security",
    link:        "https://www.ssllabs.com/ssltest",
  },
];

export const snippetCategories = [
  { slug: "react",        label: "React",        icon: Globe,     count: 12, description: "Hooks, patterns, optimization" },
  { slug: "java",         label: "Java",         icon: Cpu,       count: 8,  description: "Spring Boot, streams, patterns" },
  { slug: "typescript",   label: "TypeScript",   icon: Code2,     count: 10, description: "Types, generics, utilities" },
  { slug: "git",          label: "Git",          icon: GitBranch, count: 15, description: "Aliases, workflows, fixups" },
  { slug: "aws",          label: "AWS CLI",      icon: Cloud,     count: 9,  description: "S3, EC2, IAM, Lambda" },
  { slug: "shell",        label: "Shell / Bash", icon: Terminal,  count: 11, description: "One-liners, scripts, utils" },
];

export const snippets: Record<string, {
  label: string;
  items: { title: string; code: string; lang: string; description: string; faqs: { q: string; a: string }[] }[];
}> = {
  react: {
    label: "React",
    items: [
      {
        title:       "useLocalStorage Hook",
        lang:        "tsx",
        description: "A typed hook that syncs state to localStorage and handles SSR safely.",
        code: "",
        faqs: [],
      },
      {
        title:       "useDebounce Hook",
        lang:        "tsx",
        description: "Debounce any value — ideal for search inputs to avoid firing on every keystroke.",
        code: "",
        faqs: [],
      },
    ],
  },
  java: {
    label: "Java",
    items: [
      {
        title:       "Retry with Exponential Backoff",
        lang:        "java",
        description: "A generic retry utility using Resilience4j — configure max attempts and wait duration.",
        code: "",
        faqs: [],
      },
    ],
  },
};

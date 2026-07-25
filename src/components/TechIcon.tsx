"use client";

import { Icon } from "@iconify/react";
import { Code2 } from "lucide-react";

const iconMap: Record<string, string> = {
  "React": "logos:react",
  "Java": "logos:java",
  "Spring Boot": "logos:spring-icon",
  "Kafka": "logos:kafka",
  "Redis": "logos:redis",
  "PostgreSQL": "logos:postgresql",
  "TypeScript": "logos:typescript-icon",
  "Storybook": "logos:storybook-icon",
  "Vite": "logos:vitejs",
  "CSS Modules": "logos:css-3",
  "Node.js": "logos:nodejs-icon",
  "Express": "logos:express",
  "Next.js": "logos:nextjs-icon",
  "GitHub API": "logos:github-icon",
  "System Design": "logos:aws-architecture-center",
  "Architecture": "logos:aws-architecture-center",
  "Git": "logos:git-icon",
  "AWS CLI": "logos:aws",
  "Shell / Bash": "logos:bash-icon",
  "Development": "logos:visual-studio-code",
  "Security": "logos:auth0-icon",
  "Fundamentals": "logos:javascript",
  "Caching & Load Distribution": "logos:redis",
  "Databases": "logos:postgresql",
  "Messaging & Event Streaming": "logos:kafka"
};

export default function TechIcon({ tag, size = 12 }: { tag: string; size?: number }) {
  const iconName = iconMap[tag];

  if (iconName) {
    return <Icon icon={iconName} width={size} height={size} />;
  }

  return <Code2 size={size > 12 ? size - 2 : size - 2} />;
}

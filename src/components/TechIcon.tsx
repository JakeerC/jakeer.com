"use client";

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
import { FaJava, FaAws } from "react-icons/fa";
import { LuCode } from "react-icons/lu";
import { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  React: SiReact,
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
  "Shell / Bash": SiGnubash,
  Development: LuCode,
  Security: SiAuth0,
  Fundamentals: SiJavascript,
  "Caching & Load Distribution": SiRedis,
  Databases: SiPostgresql,
  "Messaging & Event Streaming": SiApachekafka,
};

export default function TechIcon({
  tag,
  size = 12,
}: {
  tag: string;
  size?: number;
}) {
  const IconComponent = iconMap[tag];

  if (IconComponent) {
    return <IconComponent size={size} />;
  }

  return <LuCode size={size > 12 ? size - 2 : size - 2} />;
}

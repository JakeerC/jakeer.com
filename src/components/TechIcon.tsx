"use client";

import { IconType } from "react-icons";
import { 
  SiReact, SiSpringboot, SiApachekafka, SiRedis, SiPostgresql, 
  SiTypescript, SiStorybook, SiVite, SiNodedotjs, 
  SiExpress, SiNextdotjs, SiGithub, SiGit, 
  SiAuth0, SiJavascript 
} from "react-icons/si";
import { FaJava, FaAws, FaCss3Alt } from "react-icons/fa";
import { SiGnubash } from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { LuCode, LuServer } from "react-icons/lu";

const iconMap: Record<string, IconType> = {
  "React": SiReact,
  "Java": FaJava,
  "Spring Boot": SiSpringboot,
  "Kafka": SiApachekafka,
  "Redis": SiRedis,
  "PostgreSQL": SiPostgresql,
  "TypeScript": SiTypescript,
  "Storybook": SiStorybook,
  "Vite": SiVite,
  "CSS Modules": FaCss3Alt,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "Next.js": SiNextdotjs,
  "GitHub API": SiGithub,
  "System Design": LuServer,
  "Architecture": LuServer,
  "Git": SiGit,
  "AWS CLI": FaAws,
  "Shell / Bash": SiGnubash,
  "Development": TbBrandVscode,
  "Security": SiAuth0,
  "Fundamentals": SiJavascript,
  "Caching & Load Distribution": SiRedis,
  "Databases": SiPostgresql,
  "Messaging & Event Streaming": SiApachekafka
};

export default function TechIcon({ tag, size = 12 }: { tag: string; size?: number }) {
  const IconComponent = iconMap[tag];

  if (IconComponent) {
    return <IconComponent size={size} />;
  }

  return <LuCode size={size > 12 ? size - 2 : size - 2} />;
}

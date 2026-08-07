"use client";

import { iconMap } from "@/lib/constants";

export default function TechIcon({
  tag,
  size = 12,
}: {
  tag: string;
  size?: number;
}) {
  const IconComponent = iconMap[tag];

  if (IconComponent) {
    return <IconComponent size={size} className="mr-2" />;
  }

  return null;
}

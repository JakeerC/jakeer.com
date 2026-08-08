"use client";

import { iconMap } from "@/lib/constants";
import { LuCode } from "react-icons/lu";

export default function TechIcon({
  tag,
  size = 16,
}: {
  tag: string;
  size?: number;
}) {
  const IconComponent = iconMap[tag];

  if (IconComponent) {
    return <IconComponent size={size} className="mx-2" />;
  }

  return <LuCode size={size} className="mx-2" />;
}

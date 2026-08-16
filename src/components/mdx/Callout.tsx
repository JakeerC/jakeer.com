import { ReactNode } from "react";
import {
  LuInfo,
  LuTriangleAlert,
  LuCircleCheck,
  LuCircleX,
} from "react-icons/lu";

type CalloutType = "info" | "warning" | "success" | "error";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: typeof LuInfo;
    defaultTitle: string;
    className: string;
  }
> = {
  info: {
    icon: LuInfo,
    defaultTitle: "Info",
    className: "callout--info",
  },
  warning: {
    icon: LuTriangleAlert,
    defaultTitle: "Warning",
    className: "callout--warning",
  },
  success: {
    icon: LuCircleCheck,
    defaultTitle: "Success",
    className: "callout--success",
  },
  error: {
    icon: LuCircleX,
    defaultTitle: "Error",
    className: "callout--error",
  },
};

export function Callout({
  type = "info",
  title,
  children,
}: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <aside className={`callout ${config.className}`}>
      <div className="callout__header">
        <Icon className="callout__icon" size={20} />
        <strong className="callout__title">{displayTitle}</strong>
      </div>
      <div className="callout__body">{children}</div>
    </aside>
  );
}

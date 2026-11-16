import { type ReactNode } from "react";
import { type IconName, Icon } from "@/components/common/Icon";

export function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

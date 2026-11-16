import { type ReactNode } from "react";
import { type IconName, Icon } from "@/components/common/Icon";

export function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  icon?: IconName;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`btn btn-${variant} ${className}`}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

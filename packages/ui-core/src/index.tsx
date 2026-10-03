import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly accessibleLabel: string;
  readonly children: ReactNode;
};

export function IconButton({
  accessibleLabel,
  children,
  type = "button",
  ...buttonProps
}: IconButtonProps) {
  return (
    <button aria-label={accessibleLabel} type={type} {...buttonProps}>
      {children}
    </button>
  );
}

export type StatusBadgeProps = {
  readonly children: ReactNode;
  readonly tone?: "critical" | "neutral" | "positive" | "warning";
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return <span data-tone={tone}>{children}</span>;
}

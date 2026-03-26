import type { ReactNode } from "react";

interface AuthedShellProps {
  children: ReactNode;
  className?: string;
}

export function AuthedShell({ children, className = "" }: AuthedShellProps) {
  const classes = [
    "authed-shell",
    "min-h-screen",
    "bg-[rgb(var(--color-background))]",
    "text-[rgb(var(--color-foreground))]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}

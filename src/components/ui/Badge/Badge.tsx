import React from "react";
import { StyledBadge, Dot, CounterBadge } from "./Badge.styles";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "purple" | "default";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ variant = "default", size = "md", dot = false, children }: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $size={size} $dot={dot}>
      {dot && <Dot />}
      {children}
    </StyledBadge>
  );
}

interface CounterProps {
  count: number;
  variant?: BadgeVariant;
  max?: number;
}

export function Counter({ count, variant = "red", max = 99 }: CounterProps) {
  const label = count > max ? `${max}+` : String(count);
  return <CounterBadge $variant={variant}>{label}</CounterBadge>;
}

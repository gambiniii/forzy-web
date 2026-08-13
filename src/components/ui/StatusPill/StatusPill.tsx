import React from "react";
import { PillWrapper, PillDot } from "./StatusPill.styles";

type PillVariant = "green" | "amber" | "red" | "blue" | "purple";

interface StatusPillProps {
  variant: PillVariant;
  children: React.ReactNode;
  animated?: boolean;
}

export function StatusPill({ variant, children, animated = false }: StatusPillProps) {
  return (
    <PillWrapper $variant={variant}>
      <PillDot $animated={animated} />
      {children}
    </PillWrapper>
  );
}

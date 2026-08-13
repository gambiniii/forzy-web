import React from "react";
import {
  CardRoot,
  ColorBar,
  CardLabel,
  CardValue,
  CardUnit,
  CardSub,
  GaugeTrack,
  GaugeFill,
} from "./MetricCard.styles";

type MetricVariant = "green" | "amber" | "red" | "blue" | "purple";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: string;
  variant: MetricVariant;
  gaugePercent?: number;
}

const variantColor: Record<MetricVariant, string> = {
  green:  "var(--green)",
  amber:  "var(--amber)",
  red:    "var(--red)",
  blue:   "var(--blue)",
  purple: "var(--purple)",
};

export function MetricCard({ label, value, unit, sub, variant, gaugePercent }: MetricCardProps) {
  const color = variantColor[variant];

  return (
    <CardRoot>
      <ColorBar $color={color} />
      <CardLabel>{label}</CardLabel>
      <CardValue $color={color}>
        {value}
        {unit && <CardUnit>{unit}</CardUnit>}
      </CardValue>
      {sub && <CardSub>{sub}</CardSub>}
      {gaugePercent !== undefined && (
        <GaugeTrack>
          <GaugeFill $percent={gaugePercent} $color={color} />
        </GaugeTrack>
      )}
    </CardRoot>
  );
}

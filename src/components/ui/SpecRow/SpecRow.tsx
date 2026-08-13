import React from "react";
import { RowRoot, RowLabel, RowValue } from "./SpecRow.styles";

interface SpecRowProps {
  label: string;
  value: React.ReactNode;
  valueStyle?: React.CSSProperties;
}

export function SpecRow({ label, value, valueStyle }: SpecRowProps) {
  return (
    <RowRoot>
      <RowLabel>{label}</RowLabel>
      <RowValue style={valueStyle}>{value}</RowValue>
    </RowRoot>
  );
}

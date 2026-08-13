import React from "react";
import { ItemRoot, SeverityBar, ItemBody, ItemTitle, ItemDetail, ItemTime } from "./AlertItem.styles";

type AlertSeverity = "crit" | "warn" | "info" | "ok";

interface AlertItemProps {
  severity: AlertSeverity;
  title: string;
  detail?: string;
  time: string;
  right?: React.ReactNode;
  onClick?: () => void;
}

const sevColor: Record<AlertSeverity, string> = {
  crit: "var(--red)",
  warn: "var(--amber)",
  info: "var(--blue)",
  ok:   "var(--green)",
};

export function AlertItem({ severity, title, detail, time, right, onClick }: AlertItemProps) {
  return (
    <ItemRoot $clickable={!!onClick} onClick={onClick}>
      <SeverityBar $color={sevColor[severity]} />
      <ItemBody>
        <ItemTitle>{title}</ItemTitle>
        {detail && <ItemDetail>{detail}</ItemDetail>}
      </ItemBody>
      {right || <ItemTime>{time}</ItemTime>}
    </ItemRoot>
  );
}

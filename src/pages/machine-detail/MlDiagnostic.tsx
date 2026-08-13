import React from "react";
import { SpecRow } from "../../components/ui/SpecRow";
import type { MlPrediction } from "../../hooks/useWsLeituras";

const IconCritical = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
    <path d="M8 1L15 14H1L8 1z" stroke="var(--red)" strokeWidth="1.3" strokeLinejoin="round" fill="var(--red-d)" />
    <path d="M8 6v3.5M8 11v1" stroke="var(--red)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconWarning = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
    <path d="M8 1L15 14H1L8 1z" stroke="var(--amber)" strokeWidth="1.3" strokeLinejoin="round" fill="var(--amber-d)" />
    <path d="M8 6v3.5M8 11v1" stroke="var(--amber)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconOk = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="6" stroke="var(--success)" strokeWidth="1.3" fill="var(--success-d)" />
    <path d="M5 8l2 2 4-4" stroke="var(--success)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function levelIcon(v: string) {
  if (v === "critical" || v === "high") return <IconCritical />;
  if (v === "medium") return <IconWarning />;
  return <IconOk />;
}

function levelColor(v: string) {
  if (v === "critical" || v === "high") return "var(--red)";
  if (v === "medium") return "var(--amber)";
  return "var(--success)";
}

function ValueWithIcon({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color, fontWeight: 600 }}>
      {icon}{text}
    </span>
  );
}

interface Props {
  prediction: MlPrediction;
}

export function MlDiagnostic({ prediction }: Props) {
  const isCritical = prediction.overall_status === "critical";
  const isWarning  = prediction.overall_status === "warning";
  const statusColor = isCritical ? "var(--red)" : isWarning ? "var(--amber)" : "var(--success)";
  const StatusIcon  = isCritical ? IconCritical : isWarning ? IconWarning : IconOk;
  const statusLabel = isCritical ? "Crítico" : isWarning ? "Atenção" : "Normal";

  return (
    <>
      <SpecRow
        label="Status"
        value={<ValueWithIcon icon={<StatusIcon />} text={statusLabel} color={statusColor} />}
      />
      <SpecRow
        label="Saúde"
        value={`${(prediction.health_score * 100).toFixed(1)}%`}
        valueStyle={{ color: statusColor, fontWeight: 600 }}
      />
      <SpecRow
        label="Severidade"
        value={
          <ValueWithIcon
            icon={levelIcon(prediction.lstm_severity)}
            text={prediction.lstm_severity}
            color={levelColor(prediction.lstm_severity)}
          />
        }
      />
      <SpecRow
        label="Risco"
        value={
          <ValueWithIcon
            icon={levelIcon(prediction.risk_level)}
            text={prediction.risk_level}
            color={levelColor(prediction.risk_level)}
          />
        }
      />
      <div style={{ marginTop: 12, padding: "8px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>
        {prediction.recommendation}
      </div>
    </>
  );
}

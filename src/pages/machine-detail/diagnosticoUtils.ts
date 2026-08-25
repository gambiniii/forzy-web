import type { Anomalia } from "../../services/anomalias.service";

export const ISO_ZONES = {
  A: { color: "var(--success)", label: "ISO Zona A · Normal" },
  B: { color: "#ffb833",       label: "ISO Zona B · Atenção" },
  C: { color: "#ff7a1a",       label: "ISO Zona C · Limitado" },
  D: { color: "var(--red)",    label: "ISO Zona D · Crítico" },
} as const;

export type IsoZone = keyof typeof ISO_ZONES;

export function getZone(p: Anomalia): IsoZone {
  if (p.overall_status === "critical") return "D";
  if (p.risk_level === "high" || p.lstm_severity === "high" || p.lstm_severity === "critical") return "C";
  if (p.overall_status === "warning" || p.risk_level === "medium" || p.lstm_severity === "medium") return "B";
  return "A";
}

export function gaugeColor(pct: number): string {
  if (pct >= 75) return "var(--success)";
  if (pct >= 50) return "#ffb833";
  return "var(--red)";
}

export function healthPct(score: number | null): number | null {
  if (score === null) return null;
  return score <= 1 ? score * 100 : score;
}

export function formatRul(hours: number | null): string {
  if (hours === null) return "—";
  if (hours > 720) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours)}h`;
}

export const STATUS_LABEL: Record<Anomalia["overall_status"], string> = {
  critical:        "Crítico",
  warning:         "Atenção",
  healthy:         "Normal",
  motor_desligado: "Desligado",
};

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
  retido:          "Retido",
};

/** Cor/label do estado do Metric Contract (threshold simples, independe do ML). */
export const THRESHOLD_LABEL: Record<NonNullable<Anomalia["threshold_status"]>, { label: string; color: string }> = {
  nominal:  { label: "NOMINAL",  color: "var(--success)" },
  atencao:  { label: "ATENÇÃO",  color: "#ffb833" },
  critico:  { label: "CRÍTICO",  color: "var(--red)" },
  retido:   { label: "RETIDO",   color: "var(--text3)" },
};

/* ── Highlight do modelo 3D por causa-raiz (Fase 1: Metric Contract) ──── */

/** Cores literais (não var() — Three.js não resolve custom properties CSS). */
export const SEVERITY_3D_COLOR: Record<"atencao" | "critico", { color: string; emissive: string }> = {
  atencao: { color: "#ffcc55", emissive: "#7a4a00" },
  critico: { color: "#ff4f6a", emissive: "#7a0010" },
};

export interface SegmentHighlight {
  color: string;
  emissive: string;
  message: string;
}

const METRIC_LABEL: Record<string, string> = {
  velocidade: "Velocidade (ISO 10816)",
  temperatura: "Temperatura",
  aceleracao: "Aceleração",
};

/** Resolve quais segmentos do modelo 3D destacar a partir de `breached_metrics`
 * (ex: "velocidade,temperatura") + o mapa físico segmento→métrica.
 * `segmentMap` vem de `src/config/motorSegmentMap.ts`. */
export function buildHighlightMap(
  prediction: Anomalia | null,
  segmentMap: Record<string, string[]>,
): Record<string, SegmentHighlight> {
  if (!prediction?.breached_metrics) return {};

  const severity: "atencao" | "critico" = prediction.threshold_status === "critico" ? "critico" : "atencao";
  const { color, emissive } = SEVERITY_3D_COLOR[severity];

  const map: Record<string, SegmentHighlight> = {};
  prediction.breached_metrics
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .forEach((metric) => {
      const label = METRIC_LABEL[metric] ?? metric;
      const message = `${label} fora do limite${prediction.threshold_message ? ` — ${prediction.threshold_message}` : ""}`;
      (segmentMap[metric] ?? []).forEach((segmentName) => {
        map[segmentName] = { color, emissive, message };
      });
    });

  return map;
}

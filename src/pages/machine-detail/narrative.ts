import type { Anomalia } from "../../services/anomalias.service";
import { healthPct } from "./diagnosticoUtils";

/** anomalias vem em ordem DESC (mais recente primeiro). */
export function describeTrend(anomalias: Anomalia[]): string | null {
  const current = healthPct(anomalias[0]?.health_score ?? null);
  const previous = healthPct(anomalias[1]?.health_score ?? null);
  if (current === null || previous === null) return null;

  const delta = Math.round(current - previous);
  if (Math.abs(delta) < 2) return "Saúde estável desde o diagnóstico anterior.";
  if (delta > 0) return `Saúde subiu ${delta} pontos desde o diagnóstico anterior.`;
  return `Saúde caiu ${Math.abs(delta)} pontos desde o diagnóstico anterior.`;
}

export function formatRelativeTime(iso: string | undefined): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "agora";

  const s = Math.floor(diffMs / 1000);
  if (s < 60) return `há ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

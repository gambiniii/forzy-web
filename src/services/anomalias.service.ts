import { api } from "./api";

export interface Anomalia {
  id: number;
  componente_id: number;
  timestamp: string;
  is_anomaly: boolean;
  overall_status: "healthy" | "warning" | "critical" | "motor_desligado";
  lstm_severity: string | null;
  risk_level: string | null;
  rul_hours: number | null;
  maintenance_window_days: number | null;
  health_score: number | null;
  health_index: number | null;
  recommendation: string | null;
}

// ── Tipo retornado por /analysis/{id}/report ──────────────────────────────────
interface AnalysisReport {
  motor_id: number;
  health_score: number;
  health_label: string;
  iso_zone: string;
  narrative: string;
  recent_alerts: unknown[];
  recent_maintenances: unknown[];
  last_reading?: {
    vibration_velocity_port1?: number;
    vibration_velocity_port2?: number;
    acceleration_port1?: number;
    temperature_port1?: number;
  };
}

function reportToAnomalia(r: AnalysisReport, componenteId: number): Anomalia {
  const status = r.health_label === "Crítico" ? "critical"
    : r.health_label === "Atenção" ? "warning"
    : "healthy";

  return {
    id: 0,
    componente_id: componenteId,
    timestamp: new Date().toISOString(),
    is_anomaly: status === "critical" || status === "warning",
    overall_status: status as Anomalia["overall_status"],
    lstm_severity: null,
    risk_level: r.iso_zone,
    rul_hours: null,
    maintenance_window_days: null,
    health_score: r.health_score / 100,
    health_index: r.health_score,
    recommendation: r.narrative,
  };
}

/**
 * Busca diagnóstico do motor pelo componente_id.
 * Internamente usa /analysis/{motor_id}/report; trata componenteId como motorId
 * (relação 1:1 no projeto Forzy).
 */
export async function listAnomalias(
  componenteId: number,
  _limit = 50,
): Promise<Anomalia[]> {
  try {
    const report = await api.get<AnalysisReport>(`/analysis/${componenteId}/report`);
    return [reportToAnomalia(report, componenteId)];
  } catch {
    return [];
  }
}

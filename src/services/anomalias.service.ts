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

/**
 * Busca histórico de diagnósticos do componente em /diagnosticos/componente/{id}.
 */
export async function listAnomalias(
  componenteId: number,
  limit = 50,
): Promise<Anomalia[]> {
  try {
    return await api.get<Anomalia[]>(`/diagnosticos/componente/${componenteId}?limit=${limit}`);
  } catch {
    return [];
  }
}

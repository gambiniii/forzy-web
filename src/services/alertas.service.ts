import { api } from "./api";

export type Severidade = "low" | "medium" | "high" | "critical";

export interface Alerta {
  id: number;
  machine_id: number;
  severity: Severidade;
  message: string;
  anomaly_score: number | null;
  rul_estimated: number | null;
  created_at: string;
  resolved_at: string | null;
}

// ── Tipo da API nova (motor_id) ───────────────────────────────────────────────
interface AlertApi {
  id: number;
  motor_id: number;
  severity: Severidade;
  message: string;
  anomaly_score: number | null;
  rul_estimated: number | null;
  created_at: string;
  resolved_at: string | null;
}

function toAlerta(a: AlertApi): Alerta {
  return { ...a, machine_id: a.motor_id };
}

export const alertasService = {
  list: async (params?: { machine_id?: number; resolved?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.machine_id !== undefined) qs.set("motor_id", String(params.machine_id));
    if (params?.resolved    !== undefined) qs.set("resolved", String(params.resolved));
    const query = qs.toString() ? `?${qs}` : "";
    return (await api.get<AlertApi[]>(`/alerts/${query}`)).map(toAlerta);
  },
  create: async (data: { machine_id: number; severity: Severidade; message: string; anomaly_score?: number; rul_estimated?: number }) =>
    toAlerta(await api.post<AlertApi>("/alerts/", {
      motor_id: data.machine_id,
      severity: data.severity,
      message: data.message,
      anomaly_score: data.anomaly_score,
      rul_estimated: data.rul_estimated,
    })),
  resolve: (id: number) =>
    api.patch<{ message: string }>(`/alerts/${id}/resolve`, {}),
};

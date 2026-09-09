import { api } from "./api";

export interface LeituraSensor {
  id: number;
  componente_id: number;
  timestamp: string;
  temperatura: number | null;
  umidade: number | null;
  corrente: number | null;
  voltagem: number | null;
  rpm: number | null;
  vibracao: number | null;
  inclinacao: number | null;
  origem?: "real" | "demo" | null;
  // Campos Forzy IO-Link (novos)
  vibration_velocity_port1?: number | null;
  vibration_velocity_port2?: number | null;
  acceleration_port1?: number | null;
  acceleration_port2?: number | null;
  temperature_port1?: number | null;
  temperature_port2?: number | null;
}

export interface LeituraCreate {
  componente_id: number;
  timestamp?: string;
  temperatura?: number;
  umidade?: number;
  corrente?: number;
  voltagem?: number;
  rpm?: number;
  vibracao?: number;
  inclinacao?: number;
}

export const leiturasService = {
  /**
   * Retorna histórico de leituras por componente_id.
   * params.inicio/fim são ignorados (backend usa `start` em formato InfluxDB: -1h, -24h, -7d).
   */
  list: async (componenteId: number, params?: { inicio?: string; fim?: string; limit?: number; start?: string }) => {
    const start = params?.start ?? (params?.inicio ? _isoToInflux(params.inicio) : "-1h");
    const limitQ = params?.limit ? `&limit=${params.limit}` : "";
    return api.get<LeituraSensor[]>(`/sensors/component/${componenteId}?start=${start}${limitQ}`);
  },

  ultima: (componenteId: number) =>
    api.get<LeituraSensor>(`/sensors/component/${componenteId}/latest`),

  /** Cria leitura legada — mapeada para o motor_id associado ao componente. */
  create: (data: LeituraCreate) =>
    api.post<LeituraSensor>("/sensors/", {
      motor_id: data.componente_id,
      component_id: data.componente_id,
      temperature: data.temperatura,
      vibration: data.vibracao,
      current: data.corrente,
      voltage: data.voltagem,
      rpm: data.rpm,
    }),
};

/** Converte ISO date string para período InfluxDB relativo (melhor esforço). */
function _isoToInflux(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.ceil(diff / 3_600_000);
    return `-${hours}h`;
  } catch {
    return "-1h";
  }
}

import { api } from "./api";

export type TipoManutencao = "preventive" | "corrective" | "predictive";

export interface Manutencao {
  id: number;
  machine_id: number;
  type: TipoManutencao;
  scheduled_at: string;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

interface ManutencaoApi {
  id: number;
  motor_id: number;
  type: TipoManutencao;
  scheduled_at: string;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

function toManutencao(m: ManutencaoApi): Manutencao {
  return { ...m, machine_id: m.motor_id };
}

export const manutencaoService = {
  list: async (machine_id?: number) => {
    const query = machine_id ? `?motor_id=${machine_id}` : "";
    return (await api.get<ManutencaoApi[]>(`/maintenance/${query}`)).map(toManutencao);
  },
  create: async (data: { machine_id: number; type: TipoManutencao; scheduled_at: string; notes?: string }) =>
    toManutencao(await api.post<ManutencaoApi>("/maintenance/", {
      motor_id: data.machine_id,
      type: data.type,
      scheduled_at: data.scheduled_at,
      notes: data.notes,
    })),
  update: async (id: number, data: { scheduled_at?: string; completed_at?: string; notes?: string }) =>
    toManutencao(await api.patch<ManutencaoApi>(`/maintenance/${id}`, data)),
};

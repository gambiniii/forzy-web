import { api } from "./api";

export interface Limites {
  componente_id: number;
  vib_atencao: number;
  vib_critico: number;
  temp_atencao: number;
  temp_critico: number;
}

export type LimitesUpdate = Partial<Omit<Limites, "componente_id">>;

export const limitesService = {
  get:    (componenteId: number)                    => api.get<Limites>(`/componentes/${componenteId}/limites`),
  update: (componenteId: number, data: LimitesUpdate) => api.put<Limites>(`/componentes/${componenteId}/limites`, data),
};

import { api } from "./api";

export interface Maquina {
  id: number;
  nome: string;
  tipo: string | null;
  fabricante: string | null;
  ano_instalacao: number | null;
  status: "active" | "inactive" | "maintenance";
  planta_id: number;
}

export type MaquinaCreate = Partial<Omit<Maquina, "id">> & { nome: string; planta_id: number };
export type MaquinaUpdate = Partial<Omit<Maquina, "id">>;

export const maquinasService = {
  list:   ()                                          => api.get<Maquina[]>("/maquinas/"),
  get:    (id: number)                                => api.get<Maquina>(`/maquinas/${id}`),
  create: (data: MaquinaCreate)                       => api.post<Maquina>("/maquinas/", data),
  update: (id: number, data: MaquinaUpdate)           => api.patch<Maquina>(`/maquinas/${id}`, data),
  delete: (id: number)                                => api.delete<void>(`/maquinas/${id}`),
};

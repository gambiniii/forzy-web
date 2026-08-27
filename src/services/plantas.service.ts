import { api } from "./api";

export interface Planta {
  id: number;
  nome: string;
  localizacao: string | null;
  cidade: string | null;
  estado: string | null;
  ativo: boolean;
  created_at: string;
}

export type PlantaCreate = Omit<Planta, "id" | "created_at">;
export type PlantaUpdate = Partial<PlantaCreate>;

export const plantasService = {
  list:   ()                                   => api.get<Planta[]>("/plantas/"),
  get:    (id: number)                         => api.get<Planta>(`/plantas/${id}`),
  create: (data: PlantaCreate)                 => api.post<Planta>("/plantas/", data),
  update: (id: number, data: PlantaUpdate)     => api.patch<Planta>(`/plantas/${id}`, data),
  delete: (id: number)                         => api.delete<void>(`/plantas/${id}`),
};

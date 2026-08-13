import { api } from "./api";

export interface Planta {
  id: number;
  nome: string;
  localizacao: string | null;
  cidade: string | null;
  estado: string | null;
  ativo: boolean;
  created_at: string;
  description?: string | null;
}

export type PlantaCreate = Omit<Planta, "id" | "created_at" | "cidade" | "estado">;
export type PlantaUpdate = Partial<PlantaCreate>;

// ── Tipos da API nova (/ativos/) ──────────────────────────────────────────────
interface AtivoApi {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

function toPlanta(a: AtivoApi): Planta {
  return {
    id: a.id,
    nome: a.name,
    localizacao: a.location,
    cidade: null,
    estado: null,
    ativo: a.status === "active",
    created_at: a.created_at,
    description: a.description,
  };
}

function fromPlanta(p: PlantaCreate): object {
  return {
    name: p.nome,
    location: p.localizacao ?? null,
    description: p.description ?? null,
    status: p.ativo ? "active" : "inactive",
  };
}

export const plantasService = {
  list:   async ()                              => (await api.get<AtivoApi[]>("/ativos/")).map(toPlanta),
  get:    async (id: number)                   => toPlanta(await api.get<AtivoApi>(`/ativos/${id}`)),
  create: async (data: PlantaCreate)           => toPlanta(await api.post<AtivoApi>("/ativos/", fromPlanta(data))),
  update: async (id: number, d: PlantaUpdate)  => toPlanta(await api.patch<AtivoApi>(`/ativos/${id}`, fromPlanta(d as PlantaCreate))),
  delete: (id: number)                         => api.delete<void>(`/ativos/${id}`),
};

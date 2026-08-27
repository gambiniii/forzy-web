import { api } from "./api";

export interface EspecificacaoMotor {
  componente_id: number;
  potencia_kw: number | null;
  tensao_nominal: number | null;
  corrente_nominal: number | null;
  rpm_nominal: number | null;
  frequencia_hz: number | null;
  numero_polos: number | null;
  rendimento: number | null;
}

export interface Componente {
  id: number;
  maquina_id: number;
  nome: string;
  tipo: string | null;
  fabricante: string | null;
  data_instalacao: string | null;
  status: "active" | "inactive" | "maintenance";
  especificacao_motor: EspecificacaoMotor | null;
}

export type ComponenteCreate = Omit<Componente, "id" | "especificacao_motor"> & {
  especificacao_motor?: Partial<EspecificacaoMotor>;
};

export const componentesService = {
  list: (maquinaId?: number) => {
    const qs = maquinaId ? `?maquina_id=${maquinaId}` : "";
    return api.get<Componente[]>(`/componentes/${qs}`);
  },
  get:    (id: number)                                      => api.get<Componente>(`/componentes/${id}`),
  create: (data: ComponenteCreate)                          => api.post<Componente>("/componentes/", data),
  update: (id: number, data: Partial<ComponenteCreate>)     => api.patch<Componente>(`/componentes/${id}`, data),
  delete: (id: number)                                      => api.delete<void>(`/componentes/${id}`),
  upsertEsp: (id: number, data: Partial<EspecificacaoMotor>) =>
    api.put<EspecificacaoMotor>(`/componentes/${id}/especificacao-motor`, data),
};

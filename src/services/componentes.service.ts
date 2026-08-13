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

// ── Tipos da API nova (/components/) ─────────────────────────────────────────
interface ComponentApi {
  id: number;
  motor_id: number;
  name: string;
  type: string | null;
  status: "active" | "inactive" | "maintenance";
  created_at?: string;
}

function toComponente(c: ComponentApi): Componente {
  return {
    id: c.id,
    maquina_id: c.motor_id,
    nome: c.name,
    tipo: c.type,
    fabricante: null,
    data_instalacao: null,
    status: c.status ?? "active",
    especificacao_motor: null,
  };
}

function fromComponente(c: Partial<ComponenteCreate>): object {
  return {
    motor_id: c.maquina_id,
    name: c.nome,
    type: c.tipo ?? null,
  };
}

export const componentesService = {
  list: async (maquinaId?: number) => {
    const qs = maquinaId ? `?motor_id=${maquinaId}` : "";
    return (await api.get<ComponentApi[]>(`/components/${qs}`)).map(toComponente);
  },
  get:    async (id: number)                                      => toComponente(await api.get<ComponentApi>(`/components/${id}`)),
  create: async (data: ComponenteCreate)                          => toComponente(await api.post<ComponentApi>("/components/", fromComponente(data))),
  update: async (id: number, data: Partial<ComponenteCreate>)     => toComponente(await api.patch<ComponentApi>(`/components/${id}`, fromComponente(data))),
  delete: (id: number)                                            => api.delete<void>(`/components/${id}`),
  // especificacao-motor não existe mais no schema novo (nameplate fields estão no motor)
  upsertEsp: (_id: number, _data: Partial<EspecificacaoMotor>)   => Promise.resolve({} as EspecificacaoMotor),
};

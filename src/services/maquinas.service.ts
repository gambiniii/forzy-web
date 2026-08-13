import { api } from "./api";

export interface Maquina {
  id: number;
  nome: string;
  tipo: string | null;
  fabricante: string | null;
  ano_instalacao: number | null;
  status: "active" | "inactive" | "maintenance";
  planta_id: number;
  // Campos extras do novo schema
  serial?: string | null;
  nameplate_voltage?: number | null;
  nameplate_current?: number | null;
  nameplate_rpm?: number | null;
  nameplate_power_kw?: number | null;
  nameplate_frequency?: number | null;
  nameplate_cos_phi?: number | null;
  sensor_port1_tag?: string | null;
  sensor_port2_tag?: string | null;
}

export type MaquinaCreate = Partial<Omit<Maquina, "id">> & { nome: string };
export type MaquinaUpdate = Partial<Omit<Maquina, "id">>;

// ── Tipos da API nova (/motors/) ──────────────────────────────────────────────
interface MotorApi {
  id: number;
  name: string;
  type: string | null;
  serial: string | null;
  status: "active" | "inactive" | "maintenance";
  ativo_id: number;
  nameplate_voltage?: number | null;
  nameplate_current?: number | null;
  nameplate_rpm?: number | null;
  nameplate_power_kw?: number | null;
  nameplate_frequency?: number | null;
  nameplate_cos_phi?: number | null;
  sensor_port1_tag?: string | null;
  sensor_port2_tag?: string | null;
  created_at?: string;
}

function toMaquina(m: MotorApi): Maquina {
  return {
    id: m.id,
    nome: m.name,
    tipo: m.type,
    fabricante: null,
    ano_instalacao: null,
    status: m.status,
    planta_id: m.ativo_id,
    serial: m.serial,
    nameplate_voltage: m.nameplate_voltage,
    nameplate_current: m.nameplate_current,
    nameplate_rpm: m.nameplate_rpm,
    nameplate_power_kw: m.nameplate_power_kw,
    nameplate_frequency: m.nameplate_frequency,
    nameplate_cos_phi: m.nameplate_cos_phi,
    sensor_port1_tag: m.sensor_port1_tag,
    sensor_port2_tag: m.sensor_port2_tag,
  };
}

function fromMaquina(m: MaquinaCreate | MaquinaUpdate): object {
  return {
    name: (m as MaquinaCreate).nome,
    type: m.tipo ?? null,
    status: m.status ?? "active",
    ativo_id: m.planta_id,
    serial: m.serial ?? null,
    nameplate_voltage: m.nameplate_voltage ?? null,
    nameplate_current: m.nameplate_current ?? null,
    nameplate_rpm: m.nameplate_rpm ?? null,
    nameplate_power_kw: m.nameplate_power_kw ?? null,
    nameplate_frequency: m.nameplate_frequency ?? null,
    nameplate_cos_phi: m.nameplate_cos_phi ?? null,
  };
}

export const maquinasService = {
  list:   async ()                                    => (await api.get<MotorApi[]>("/motors/")).map(toMaquina),
  get:    async (id: number)                          => toMaquina(await api.get<MotorApi>(`/motors/${id}`)),
  create: async (data: MaquinaCreate)                 => toMaquina(await api.post<MotorApi>("/motors/", fromMaquina(data))),
  update: async (id: number, data: MaquinaUpdate)     => toMaquina(await api.patch<MotorApi>(`/motors/${id}`, fromMaquina(data))),
  delete: (id: number)                                => api.delete<void>(`/motors/${id}`),
};

import { api } from "./api";

export interface AtributoValor {
  id: number;
  componente_id: number;
  atributo_id: number;
  valor_float: number | null;
  valor_int: number | null;
  valor_string: string | null;
  atributo: {
    id: number;
    nome: string;
    unidade: string | null;
    tipo_dado: string | null;
  };
}

export async function getValoresByComponente(componenteId: number): Promise<AtributoValor[]> {
  return api.get<AtributoValor[]>(`/atributos/valores?componente_id=${componenteId}`);
}

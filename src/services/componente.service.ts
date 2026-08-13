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

export async function getValoresByComponente(_componenteId: number): Promise<AtributoValor[]> {
  // Endpoint /atributos/ não existe no novo schema — retorna vazio.
  return [];
}

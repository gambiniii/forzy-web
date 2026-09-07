import { api } from "./api";

/**
 * Atribuição por componente vinda dos modelos de novidade Forzy.
 *
 * São 6 modelos (2 motores x 3 regimes), treinados só em dado saudável, porque o
 * histórico não tem um único rótulo de falha. O detector escolhido é um
 * autoencoder 16→8→4→8→16, validado contra uma bancada de injeção de falhas.
 *
 * IMPORTANTE: é consultivo. Não substitui `overall_status` do diagnóstico, que
 * continua vindo do pipeline existente. Serve para o modelo 3D e para o agente.
 */

export interface TopFeature {
  feature: string;
  z: number;
  grupo: string;
}

export interface AtribuicaoDetalhe {
  atribuido: boolean;
  motivo?: string;
  regime: string;
  score_normalizado: number;
  top_features: TopFeature[];
  /** Preenchidos só quando `atribuido` é true. */
  falha?: string;
  titulo?: string;
  pontuacao?: number;
  segmentos?: string[];
  componentes_candidatos?: string[];
  explicacao?: string;
  precocidade?: "precoce" | "tardio";
  alternativas?: Array<{ falha: string; pontuacao: number }>;
}

export interface Atribuicao {
  disponivel: boolean;
  motivo?: string;
  componente_id: number;
  n_leituras: number;
  regime?: string;
  modelo?: string;
  score_normalizado: number | null;
  /** NORMAL | ATENCAO | ALERTA | CRITICO */
  severidade: string | null;
  alarma?: boolean;
  atribuicao: AtribuicaoDetalhe | null;
  /** Segmentos do modelo 3D a destacar. Vazio quando não há atribuição. */
  segmentos: string[];
  /** O que enfraquece esta leitura. Sempre mostrar ao usuário. */
  limitacoes?: string[];
  heat_soak?: boolean;
  fp_esperado?: number | null;
}

export interface MetricasModelos {
  disponivel: boolean;
  motivo?: string;
  por_detector?: Record<string, {
    pr_auc_macro: number | null;
    roc_auc_macro: number | null;
    recall_macro_fp1: number | null;
    fp_controle: number | null;
  }>;
  celulas?: Array<{
    motor: string; modo: string; severidade: string;
    pr_auc: number; roc_auc: number; recall_fp1: number;
  }>;
}

export const atribuicaoService = {
  /** Atribuição da janela mais recente de um componente. */
  get: (componenteId: number, janelaMin = 15) =>
    api.get<Atribuicao>(`/diagnosticos/componente/${componenteId}/atribuicao?janela_min=${janelaMin}`),

  /** Métricas da bancada de injeção de falhas. */
  metricas: () => api.get<MetricasModelos>("/diagnosticos/modelos/metricas"),
};

import type { Anomalia } from "../../services/anomalias.service";
import { getPart, GRUPO_LABEL, type ModoDeFalha } from "../../config/motorParts";
import { GRUPOS_ATRIBUICAO } from "../../config/motorSegmentMap";

export const ISO_ZONES = {
  A: { color: "var(--success)", label: "ISO Zona A · Normal" },
  B: { color: "#ffb833",       label: "ISO Zona B · Atenção" },
  C: { color: "#ff7a1a",       label: "ISO Zona C · Limitado" },
  D: { color: "var(--red)",    label: "ISO Zona D · Crítico" },
} as const;

export type IsoZone = keyof typeof ISO_ZONES;

export function getZone(p: Anomalia): IsoZone {
  if (p.overall_status === "critical") return "D";
  if (p.risk_level === "high" || p.lstm_severity === "high" || p.lstm_severity === "critical") return "C";
  if (p.overall_status === "warning" || p.risk_level === "medium" || p.lstm_severity === "medium") return "B";
  return "A";
}

export function gaugeColor(pct: number): string {
  if (pct >= 75) return "var(--success)";
  if (pct >= 50) return "#ffb833";
  return "var(--red)";
}

export function healthPct(score: number | null): number | null {
  if (score === null) return null;
  return score <= 1 ? score * 100 : score;
}

export function formatRul(hours: number | null): string {
  if (hours === null) return "—";
  if (hours > 720) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours)}h`;
}

export const STATUS_LABEL: Record<Anomalia["overall_status"], string> = {
  critical:        "Crítico",
  warning:         "Atenção",
  healthy:         "Normal",
  motor_desligado: "Desligado",
  retido:          "Retido",
};

/** Cor/label do estado do Metric Contract (threshold simples, independe do ML). */
export const THRESHOLD_LABEL: Record<NonNullable<Anomalia["threshold_status"]>, { label: string; color: string }> = {
  nominal:  { label: "NOMINAL",  color: "var(--success)" },
  atencao:  { label: "ATENÇÃO",  color: "#ffb833" },
  critico:  { label: "CRÍTICO",  color: "var(--red)" },
  retido:   { label: "RETIDO",   color: "var(--text3)" },
};

/* ── Highlight do modelo 3D por causa-raiz (Fase 1: Metric Contract) ──── */

/** Cores literais (não var() — Three.js não resolve custom properties CSS). */
export const SEVERITY_3D_COLOR: Record<"atencao" | "critico", { color: string; emissive: string }> = {
  atencao: { color: "#ffcc55", emissive: "#7a4a00" },
  critico: { color: "#ff4f6a", emissive: "#7a0010" },
};

export interface SegmentHighlight {
  color: string;
  emissive: string;
  message: string;
  /** Rótulo curto do pin 3D. */
  pin: string;
  /** Métricas que causaram o destaque deste segmento. */
  metricas: string[];
}

export const METRIC_LABEL: Record<string, string> = {
  velocidade: "Velocidade de vibração",
  temperatura: "Temperatura",
  aceleracao: "Aceleração",
};

const METRIC_PIN: Record<string, string> = {
  velocidade: "Vibração",
  temperatura: "Temperatura",
  aceleracao: "Aceleração",
};

/** Resolve quais segmentos do modelo 3D destacar a partir de `breached_metrics`
 * (ex: "velocidade,temperatura") + o mapa físico métrica→segmentos.
 * `segmentMap` vem de `src/config/motorSegmentMap.ts`.
 *
 * NOTA: `breached_metrics` é NULL em todos os diagnósticos anteriores ao commit
 * que criou a coluna, inclusive em linhas com `threshold_status='critico'`.
 * NULL significa DESCONHECIDO, não "nada estourou" — por isso retornamos mapa
 * vazio (nenhuma peça acesa) em vez de inferir peça a partir do status. */
export function buildHighlightMap(
  prediction: Anomalia | null,
  segmentMap: Record<string, string[]>,
): Record<string, SegmentHighlight> {
  if (!prediction?.breached_metrics) return {};
  // Motor desligado ou diagnóstico retido não pinta peça: o valor de temperatura
  // continua alto por até 15 min depois de desligar (calor migrando do enrolamento
  // para a carcaça com o ventilador parado) e isso é comportamento normal.
  if (prediction.overall_status === "motor_desligado" || prediction.overall_status === "retido") return {};

  const severity: "atencao" | "critico" = prediction.threshold_status === "critico" ? "critico" : "atencao";
  const { color, emissive } = SEVERITY_3D_COLOR[severity];

  const map: Record<string, SegmentHighlight> = {};
  prediction.breached_metrics
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean)
    .forEach((metric) => {
      const label = METRIC_LABEL[metric] ?? metric;
      const message = `${label} fora do limite${prediction.threshold_message ? ` — ${prediction.threshold_message}` : ""}`;
      (segmentMap[metric] ?? []).forEach((segmentName) => {
        const anterior = map[segmentName];
        map[segmentName] = {
          color,
          emissive,
          message: anterior ? `${anterior.message} ${message}` : message,
          pin: anterior ? "Múltiplas" : (METRIC_PIN[metric] ?? "Anomalia"),
          metricas: anterior ? [...anterior.metricas, metric] : [metric],
        };
      });
    });

  return map;
}

/* ── Conteúdo do tooltip rico do modelo 3D ────────────────────────────────── */

export interface SegmentTooltipData {
  /** Nome oficial WEG da peça (ou o id cru se não catalogada). */
  titulo: string;
  /** Sistema funcional: "Sistema mecânico rotativo", etc. */
  grupo: string;
  descricao: string;
  /** Peças internas que este segmento representa por não terem malha própria. */
  componentesInternos: string[];
  /** Preenchido só quando a peça está destacada por diagnóstico. */
  anomalia: {
    severidade: "atencao" | "critico";
    mensagem: string;
    metricas: string[];
    /** Modos de falha desta peça compatíveis com as métricas que estouraram. */
    causasProvaveis: ModoDeFalha[];
    /** Grupo funcional de atribuição ao qual a peça pertence. */
    grupoAtribuicao: string | null;
  } | null;
  /** Pergunta pronta para enviar ao agente. */
  perguntaAgente: string;
}

/** Modos de falha da peça filtrados pelas métricas que de fato estouraram.
 * Sem esse filtro o card lista causas que os dados não sustentam. */
function causasCompativeis(falhas: ModoDeFalha[], metricas: string[]): ModoDeFalha[] {
  if (!metricas.length) return falhas;
  const quer = (m: string) => metricas.includes(m);
  return falhas.filter((f) => {
    const a = f.assinatura.toLowerCase();
    if (quer("temperatura") && a.includes("temperatura")) return true;
    if (quer("aceleracao") && a.includes("aceleração")) return true;
    if (quer("velocidade") && (a.includes("velocidade") || a.includes("vibração"))) return true;
    return false;
  });
}

/** Monta todo o conteúdo do card de hover de um segmento do modelo 3D. */
export function buildSegmentTooltip(
  segmentId: string,
  highlight: SegmentHighlight | undefined,
  prediction: Anomalia | null,
  nomeMaquina: string,
): SegmentTooltipData {
  const part = getPart(segmentId);
  const titulo = part?.label ?? segmentId;
  const grupo = part ? GRUPO_LABEL[part.grupo] : "Segmento não catalogado";

  let anomalia: SegmentTooltipData["anomalia"] = null;
  if (highlight && part) {
    const severidade = prediction?.threshold_status === "critico" ? "critico" : "atencao";
    const grupoAtr = GRUPOS_ATRIBUICAO.find((g) => g.segmentos.includes(segmentId));
    anomalia = {
      severidade,
      mensagem: highlight.message,
      metricas: highlight.metricas,
      causasProvaveis: causasCompativeis(part.falhas, highlight.metricas),
      grupoAtribuicao: grupoAtr?.titulo ?? null,
    };
  }

  const perguntaAgente = anomalia
    ? `No motor ${nomeMaquina}, o diagnóstico apontou ${anomalia.metricas
        .map((m) => (METRIC_LABEL[m] ?? m).toLowerCase())
        .join(" e ")} fora do limite, e o modelo 3D destacou a peça "${titulo}". ` +
      `Me explique em detalhe o que pode estar acontecendo nessa peça, quais componentes internos ` +
      `podem estar envolvidos, como confirmar o diagnóstico na prática e qual a urgência da intervenção.`
    : `Me explique em detalhe a peça "${titulo}" do motor ${nomeMaquina}: qual a função dela, ` +
      `quais modos de falha ela pode apresentar, e como esses modos aparecem nas leituras de ` +
      `velocidade de vibração, aceleração e temperatura que monitoramos.`;

  return {
    titulo,
    grupo,
    descricao: part?.descricao ?? "Segmento do modelo 3D ainda não catalogado.",
    componentesInternos: part?.componentesInternos ?? [],
    anomalia,
    perguntaAgente,
  };
}

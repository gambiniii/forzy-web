/**
 * Mapa métrica → segmentos do modelo 3D que devem acender quando aquela
 * métrica sai do limite. É o INVERSO de `motorParts.ts` (que vai de segmento
 * para descrição da peça); os dois são necessários e cumprem papéis distintos.
 *
 * ── CORREÇÃO DA FASE 1 ─────────────────────────────────────────────────────
 * A versão anterior mapeava `empty_6` como "carcaça/estator" e `empty_24` como
 * "ponta do eixo". A geometria do OBJ mostra que ambas estavam trocadas:
 *
 *   • `empty_6` é uma chapa de 29,8 mm de espessura no ponto mais externo em Z
 *     (z=185, máximo do modelo 190,95), empilhada sobre `empty_5` (junta) e
 *     `empty_4` (caixa oca). É a TAMPA DA CAIXA DE LIGAÇÃO — e o logo WEG que
 *     levou à confusão fica justamente nela. A carcaça é `empty_2`, o maior
 *     volume do modelo, com 18010 faces e casca oca de raio interno 84,5.
 *
 *   • `empty_24` tem 45×8×7 mm e apenas 12 faces, assentado no rasgo do eixo.
 *     8×7 mm é a chaveta DIN 6885 normalizada para eixo Ø28–30. É a CHAVETA.
 *     O eixo é `empty_23`: cilindro escalonado Ø30→Ø28 com 90 mm livres.
 *
 * ── POR QUE CADA MÉTRICA ACENDE ESSES SEGMENTOS ────────────────────────────
 * velocidade  → desbalanceamento e desalinhamento se manifestam como velocidade
 *               de vibração em 1× a rotação, medida no mancal. Acende eixo
 *               (proxy do rotor), tampa dianteira (onde a norma manda medir) e
 *               carcaça (fixação/ressonância).
 * aceleracao  → impacto de alta frequência é assinatura de rolamento. Os dois
 *               rolamentos ficam alojados nas tampas, então são elas que acendem.
 * temperatura → a fonte de calor é o estator, dentro da carcaça; a causa número
 *               um de sobretemperatura segundo o manual WEG é ventilação
 *               obstruída, que é a tampa defletora.
 *
 * NOTA DE PROJETO: `empty_23` sozinho ocupa menos de 1% da área projetada nas
 * vistas 3/4, então o destaque sumiria visualmente. Por isso a velocidade
 * acende eixo e tampa dianteira juntos.
 */
export const MOTOR_SEGMENT_MAP: Record<string, string[]> = {
  velocidade:  ["empty_23", "empty_7", "empty_2"],
  aceleracao:  ["empty_7", "empty_13"],
  temperatura: ["empty_2", "empty_19"],
};

/**
 * Grupos funcionais de atribuição. O teto honesto do que estes dados permitem
 * afirmar são cerca de 5 grupos — não uma peça específica entre 23. Um único
 * sensor por motor, sem espectro de frequência e sem nenhum rótulo de falha no
 * histórico não sustentam precisão maior que essa.
 */
export interface GrupoAtribuicao {
  id: string;
  titulo: string;
  segmentos: string[];
  /** O que precisa acontecer nos sinais para este grupo ser apontado. */
  evidencia: string;
}

export const GRUPOS_ATRIBUICAO: GrupoAtribuicao[] = [
  {
    id: "G1",
    titulo: "Rolamentos e eixo",
    segmentos: ["empty_7", "empty_13", "empty_23", "empty_24"],
    evidencia:
      "Aceleração sobe em janela curta com a velocidade média ainda normal, " +
      "e a energia migra para alta frequência.",
  },
  {
    id: "G2",
    titulo: "Rotor e balanceamento",
    segmentos: ["empty_23", "empty_2"],
    evidencia:
      "Velocidade de vibração sobe de forma sustentada em janela longa, " +
      "com a energia concentrando em 1× a rotação.",
  },
  {
    id: "G3",
    titulo: "Fixação e carcaça",
    segmentos: ["empty_2"],
    evidencia:
      "Picos e variações bruscas aumentam enquanto o nível médio permanece normal — " +
      "padrão impulsivo e intermitente.",
  },
  {
    id: "G4",
    titulo: "Térmico e enrolamento",
    segmentos: ["empty_2", "empty_19", "empty_4"],
    evidencia:
      "Temperatura acima do limite contratual, descartado o resfriamento normal " +
      "que ocorre nos 15 minutos seguintes ao desligamento.",
  },
];

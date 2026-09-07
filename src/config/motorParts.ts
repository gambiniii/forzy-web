/**
 * Catálogo das 23 peças do modelo 3D (`public/3d/Engine1.obj`, segmentos
 * `empty_2`…`empty_24`) do motor WEG W22 3cv monofásico, carcaça 100L, 2 polos,
 * IP55, IC411/TFVE, B3D.
 *
 * ── COMO OS SEGMENTOS FORAM IDENTIFICADOS ──────────────────────────────────
 * Por geometria, não por inspeção visual. O modelo está em MILÍMETROS e em
 * escala 1:1 — prova: os pés ficam em Y=−100 e a linha de centro do eixo em
 * Y=0, logo a altura de eixo é 100 mm, que é exatamente a carcaça 100L.
 * O eixo do motor corre em X, com a ponta (lado acionado) em +X. A caixa de
 * ligação fica em +Z, o que confirma "Caixa de ligação: posição esquerda" do
 * datasheet WEG do produto 13887610.
 *
 * ── O INTERIOR DO MODELO É VAZIO ───────────────────────────────────────────
 * Todos os vértices no vão X∈(−89,+89) têm raio ≥ 84,6: não existe malha para
 * rotor, estator bobinado, rolamentos, ventilador, capacitor, centrífugo,
 * platinado, placa de bornes, vedações V-Ring, arruela ondulada nem
 * aterramento. Cada uma dessas peças internas é representada aqui pelo proxy
 * externo que fisicamente a contém — o rolamento do lado acionado está
 * literalmente dentro de `empty_7`, o ventilador dentro de `empty_19`, e assim
 * por diante. É por isso que `componentesInternos` existe.
 *
 * Fontes: manual WEG 50033244 (cap. 8 MANUTENÇÃO e cap. 10 PROBLEMAS X
 * SOLUÇÕES) e a vista explodida oficial 50106446.
 */

/** Sistema funcional ao qual a peça pertence. */
export type GrupoFuncional =
  | "mecanico"      // rotativo: eixo, rotor, rolamentos, chaveta
  | "eletrico"      // estator, capacitor, bornes, aterramento
  | "termico"       // ventilação, dissipação, carcaça
  | "estrutural"    // fixação, tampas, parafusos, olhal
  | "vedacao";      // V-rings, juntas, drenos (garantem o IP55)

export const GRUPO_LABEL: Record<GrupoFuncional, string> = {
  mecanico:   "Sistema mecânico rotativo",
  eletrico:   "Sistema elétrico",
  termico:    "Sistema térmico",
  estrutural: "Sistema estrutural",
  vedacao:    "Vedação e proteção IP55",
};

/** Força da relação entre a peça e cada sinal medido. */
export type Forca = "forte" | "media" | "fraca" | "nenhuma";

export interface ModoDeFalha {
  /** Nome curto do modo de falha. */
  nome: string;
  /** Como ele aparece nos sinais que medimos. Linguagem de operador. */
  assinatura: string;
  /** Se aparece antes ou depois do dano se instalar. */
  precocidade: "precoce" | "tardio";
}

export interface MotorPart {
  /** Nome do objeto no OBJ. */
  id: string;
  /** Nome oficial WEG da peça. */
  label: string;
  grupo: GrupoFuncional;
  /** O que a peça faz, em uma ou duas frases. */
  descricao: string;
  /** Relação da peça com cada sinal medido. */
  sinais: { velocidade: Forca; aceleracao: Forca; temperatura: Forca };
  /** Peças internas que esta peça representa por não terem malha própria. */
  componentesInternos: string[];
  /** Modos de falha desta peça detectáveis com os 3 sinais que temos. */
  falhas: ModoDeFalha[];
  /**
   * Se a peça pode ser destacada em vermelho pelo diagnóstico. Parafusos,
   * drenos e juntas são detalhe visual: nunca acendem sozinhos, porque não há
   * evidência nos sinais que isole um parafuso específico.
   */
  destacavel: boolean;
  /** O que o manual WEG manda inspecionar nesta peça (§8.1 Inspeção Geral). */
  inspecao?: string;
}

/* ────────────────────────────────────────────────────────────────────────── */

export const MOTOR_PARTS: Record<string, MotorPart> = {
  /* ── As 6 peças que podem acender ─────────────────────────────────────── */

  empty_2: {
    id: "empty_2",
    label: "Carcaça",
    grupo: "termico",
    descricao:
      "Corpo do motor, com as aletas de refrigeração e os pés de fixação B3D. " +
      "Aloja o estator bobinado e é a principal superfície de troca de calor com o ambiente.",
    sinais: { velocidade: "media", aceleracao: "fraca", temperatura: "forte" },
    componentesInternos: [
      "Estator bobinado",
      "Núcleo do estator",
      "Isolamento classe F",
      "Pés de fixação",
      "Placa de identificação",
    ],
    falhas: [
      {
        nome: "Sobreaquecimento do enrolamento",
        assinatura: "Temperatura sobe de forma sustentada com a vibração praticamente inalterada.",
        precocidade: "tardio",
      },
      {
        nome: "Dissipação prejudicada por sujeira",
        assinatura: "Temperatura sobe gradualmente ao longo de dias, sem mudança no padrão de vibração.",
        precocidade: "precoce",
      },
      {
        nome: "Fixação frouxa / ressonância da base",
        assinatura: "Vibração aumenta em picos intermitentes, com o nível médio ainda normal.",
        precocidade: "precoce",
      },
    ],
    destacavel: true,
    inspecao:
      "Manter a carcaça limpa: acúmulo de óleo ou pó na parte externa prejudica a troca de calor. " +
      "Verificar o aperto dos parafusos de sustentação e fixação.",
  },

  empty_7: {
    id: "empty_7",
    label: "Tampa dianteira (lado acionado)",
    grupo: "mecanico",
    descricao:
      "Fecha o motor do lado da ponta do eixo e aloja o rolamento dianteiro. " +
      "Mantém o alinhamento entre rotor e estator, e é onde a norma manda medir vibração.",
    sinais: { velocidade: "forte", aceleracao: "forte", temperatura: "media" },
    componentesInternos: [
      "Rolamento dianteiro 6206",
      "Vedação V-Ring dianteira",
      "Arruela ondulada",
      "Alojamento do mancal",
    ],
    falhas: [
      {
        nome: "Rolamento desgastado",
        assinatura:
          "Aceleração sobe com picos curtos de alta energia, elevando o fator de crest antes " +
          "do valor eficaz. Temperatura do mancal acompanha depois.",
        precocidade: "precoce",
      },
      {
        nome: "Lubrificação inadequada",
        assinatura: "Temperatura do mancal sobe junto com a aceleração; ruído aumenta.",
        precocidade: "tardio",
      },
      {
        nome: "Desalinhamento do acoplamento",
        assinatura: "Velocidade de vibração sobe de forma sustentada, concentrada em 1× a rotação.",
        precocidade: "tardio",
      },
    ],
    destacavel: true,
    inspecao:
      "Verificar o estado dos mancais observando ruídos e níveis de vibração não habituais, " +
      "a temperatura do mancal e a condição do lubrificante. Relubrificação a cada 25.000 h (5 g).",
  },

  empty_13: {
    id: "empty_13",
    label: "Tampa traseira (lado não acionado)",
    grupo: "mecanico",
    descricao:
      "Fecha o motor do lado do ventilador e aloja o rolamento traseiro. " +
      "É também a peça externa que cobre o mecanismo de partida do motor monofásico.",
    sinais: { velocidade: "media", aceleracao: "forte", temperatura: "media" },
    componentesInternos: [
      "Rolamento traseiro 6206",
      "Vedação V-Ring traseira",
      "Centrífugo (mecanismo de partida)",
      "Platinado",
    ],
    falhas: [
      {
        nome: "Rolamento traseiro desgastado",
        assinatura: "Aceleração sobe com fator de crest crescente; velocidade quase inalterada no início.",
        precocidade: "precoce",
      },
      {
        nome: "Falha do mecanismo centrífugo de partida",
        assinatura:
          "Comportamento anormal só durante a partida: o motor demora a atingir a rotação " +
          "e aquece mais que o normal nos primeiros minutos.",
        precocidade: "precoce",
      },
    ],
    destacavel: true,
    inspecao:
      "Mesmo procedimento do mancal dianteiro. Em motor monofásico, verificar também se o " +
      "mecanismo de partida desarma corretamente ao atingir a rotação.",
  },

  empty_19: {
    id: "empty_19",
    label: "Tampa defletora",
    grupo: "termico",
    descricao:
      "Capa que protege o ventilador e direciona o ar sobre as aletas da carcaça. " +
      "Na refrigeração IC411 o ventilador é acoplado ao próprio eixo, então parado o motor, para a ventilação.",
    sinais: { velocidade: "fraca", aceleracao: "fraca", temperatura: "forte" },
    componentesInternos: ["Ventilador", "Grelha de entrada de ar", "Fluxo de ar IC411"],
    falhas: [
      {
        nome: "Ventilação obstruída",
        assinatura:
          "Temperatura sobe de forma sustentada com velocidade e aceleração normais. " +
          "É a causa número um de sobretemperatura segundo o manual WEG.",
        precocidade: "precoce",
      },
      {
        nome: "Ventilador danificado ou desbalanceado",
        assinatura: "Aceleração sobe moderadamente e a temperatura acompanha, por perda de refrigeração.",
        precocidade: "tardio",
      },
    ],
    destacavel: true,
    inspecao:
      "Verificar a condição do ventilador e das entradas e saídas de ar, assegurando livre fluxo. " +
      "Respeitar as distâncias mínimas entre a entrada da defletora e paredes próximas.",
  },

  empty_23: {
    id: "empty_23",
    label: "Eixo",
    grupo: "mecanico",
    descricao:
      "Transmite o torque do rotor para a máquina acionada. Diâmetro escalonado Ø30 no assento " +
      "do rolamento e Ø28 na ponta livre. É o proxy visível do rotor, que não tem malha própria.",
    sinais: { velocidade: "forte", aceleracao: "media", temperatura: "fraca" },
    componentesInternos: ["Rotor (gaiola)", "Núcleo do rotor", "Assento do rolamento"],
    falhas: [
      {
        nome: "Desbalanceamento do rotor",
        assinatura:
          "Velocidade de vibração sobe de forma sustentada e proporcional à rotação, " +
          "com a aceleração subindo menos que a velocidade.",
        precocidade: "tardio",
      },
      {
        nome: "Eixo empenado ou desalinhado",
        assinatura: "Vibração oscila periodicamente acompanhando a rotação; temperatura sobe por consequência.",
        precocidade: "tardio",
      },
    ],
    destacavel: true,
    inspecao:
      "Inspeção visual do acoplamento observando alinhamento, sinais de desgaste e peças danificadas.",
  },

  empty_4: {
    id: "empty_4",
    label: "Caixa de ligação",
    grupo: "eletrico",
    descricao:
      "Aloja a placa de bornes, o aterramento e os capacitores. Em motor monofásico ela é " +
      "grande justamente porque precisa acomodar os capacitores de partida e permanente.",
    sinais: { velocidade: "fraca", aceleracao: "fraca", temperatura: "media" },
    componentesInternos: [
      "Capacitor de partida",
      "Capacitor permanente",
      "Placa de bornes",
      "Aterramento",
      "Prensa-cabos",
    ],
    falhas: [
      {
        nome: "Capacitor degradado",
        assinatura:
          "O motor demora a atingir a rotação nominal e aquece mais que o normal, " +
          "com a vibração pouco alterada.",
        precocidade: "tardio",
      },
      {
        nome: "Conexão frouxa ou mau contato",
        assinatura: "Temperatura sobe sem causa mecânica aparente; vibração permanece normal.",
        precocidade: "tardio",
      },
    ],
    destacavel: true,
    inspecao:
      "Verificar a conexão dos cabos de alimentação, o aperto dos parafusos de conexão, " +
      "o estado da passagem dos cabos e as vedações dos prensa-cabos.",
  },

  /* ── Detalhes visuais: nunca acendem sozinhos ─────────────────────────── */

  empty_6: {
    id: "empty_6",
    label: "Tampa da caixa de ligação",
    grupo: "eletrico",
    descricao:
      "Chapa externa com o logo WEG em relevo, que fecha a caixa de ligação e garante o IP55. " +
      "É a peça mais externa do modelo.",
    sinais: { velocidade: "nenhuma", aceleracao: "nenhuma", temperatura: "fraca" },
    componentesInternos: [],
    falhas: [],
    destacavel: false,
    inspecao: "Verificar as vedações da caixa de ligação e efetuar a troca se necessário.",
  },

  empty_5: {
    id: "empty_5",
    label: "Junta da tampa da caixa de ligação",
    grupo: "vedacao",
    descricao: "Lâmina de vedação entre a caixa de ligação e sua tampa. Garante o grau de proteção IP55.",
    sinais: { velocidade: "nenhuma", aceleracao: "nenhuma", temperatura: "nenhuma" },
    componentesInternos: [],
    falhas: [],
    destacavel: false,
    inspecao: "Verificar o estado das vedações e efetuar a troca se necessário.",
  },

  empty_3: {
    id: "empty_3",
    label: "Olhal de içamento",
    grupo: "estrutural",
    descricao: "Ponto de suspensão para transporte e instalação do motor. Não participa da operação.",
    sinais: { velocidade: "nenhuma", aceleracao: "nenhuma", temperatura: "nenhuma" },
    componentesInternos: [],
    falhas: [],
    destacavel: false,
  },

  empty_24: {
    id: "empty_24",
    label: "Chaveta",
    grupo: "mecanico",
    descricao:
      "Peça de 8×7 mm alojada no rasgo do eixo, que transmite o torque para o elemento acoplado. " +
      "Dimensão normalizada DIN 6885 para eixo Ø28–30.",
    sinais: { velocidade: "fraca", aceleracao: "media", temperatura: "nenhuma" },
    componentesInternos: [],
    falhas: [
      {
        nome: "Folga ou desgaste da chaveta",
        assinatura: "Aceleração sobe em impactos intermitentes; velocidade média permanece normal.",
        precocidade: "precoce",
      },
    ],
    destacavel: false,
    inspecao:
      "O manual alerta que balanceamento diferente entre motor e acoplamento (meia chaveta " +
      "vs. chaveta inteira) causa ruído e vibração — exige refazer o balanceamento.",
  },

  empty_9: {
    id: "empty_9",
    label: "Dreno (tampa dianteira)",
    grupo: "vedacao",
    descricao: "Permite escoar condensado acumulado no interior do motor, preservando o IP55.",
    sinais: { velocidade: "nenhuma", aceleracao: "nenhuma", temperatura: "nenhuma" },
    componentesInternos: [],
    falhas: [],
    destacavel: false,
    inspecao:
      "Drenar o motor e recolocar os drenos para garantir o grau de proteção. " +
      "Devem ficar posicionados de forma que a drenagem seja facilitada.",
  },

  empty_18: {
    id: "empty_18",
    label: "Dreno (tampa traseira)",
    grupo: "vedacao",
    descricao: "Dreno do lado não acionado. Mesma função do dreno dianteiro.",
    sinais: { velocidade: "nenhuma", aceleracao: "nenhuma", temperatura: "nenhuma" },
    componentesInternos: [],
    falhas: [],
    destacavel: false,
    inspecao: "Drenar e recolocar para garantir o IP55.",
  },
};

/* ── Parafusos: gerados em bloco, pois só têm significado como grupo ────── */

const PARAFUSOS: Array<{ ids: string[]; onde: string }> = [
  { ids: ["empty_8", "empty_10", "empty_11", "empty_12"], onde: "tampa dianteira" },
  { ids: ["empty_14", "empty_15", "empty_16", "empty_17"], onde: "tampa traseira" },
  { ids: ["empty_20", "empty_21", "empty_22"], onde: "tampa defletora" },
];

for (const { ids, onde } of PARAFUSOS) {
  for (const id of ids) {
    MOTOR_PARTS[id] = {
      id,
      label: `Parafuso de fixação (${onde})`,
      grupo: "estrutural",
      descricao:
        `Prende a ${onde} à carcaça. Soltura dos parafusos é causa reconhecida de ruído e ` +
        `vibração elevada, mas nenhum sinal que medimos isola um parafuso específico.`,
      sinais: { velocidade: "fraca", aceleracao: "fraca", temperatura: "nenhuma" },
      componentesInternos: [],
      falhas: [],
      destacavel: false,
      inspecao:
        "Verificar se o aperto dos parafusos de conexão, sustentação e fixação está conforme " +
        "a Tabela 8.16 do manual WEG.",
    };
  }
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Nome legível de um segmento, com fallback para o id cru se não catalogado. */
export function partLabel(segmentId: string): string {
  return MOTOR_PARTS[segmentId]?.label ?? segmentId;
}

/** Peça catalogada, ou `null` se o segmento não existe no catálogo. */
export function getPart(segmentId: string): MotorPart | null {
  return MOTOR_PARTS[segmentId] ?? null;
}

/** Segmentos que o diagnóstico tem permissão de destacar em vermelho. */
export const SEGMENTOS_DESTACAVEIS = Object.values(MOTOR_PARTS)
  .filter((p) => p.destacavel)
  .map((p) => p.id);

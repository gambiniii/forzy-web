/**
 * Mapa físico do modelo 3D (public/3d/Engine1.obj) — associa cada métrica do
 * Metric Contract ao(s) segmento(s) OBJ (`empty_2`...`empty_24`) que a
 * representam fisicamente, seguindo a convenção de análise de vibração
 * ISO 10816: velocidade → desbalanceamento/desalinhamento no rotor/eixo;
 * temperatura → estator/enrolamento (fonte de calor).
 *
 * Preenchido por inspeção visual (hover automatizado via Playwright headless
 * contra o dev server, lendo o nome do segmento no tooltip de hover já
 * existente em `LoadModel`/`ModelViewer`, index.tsx):
 *   - empty_6  → carcaça/estator (a caixa frontal grande com o logo WEG —
 *     maior superfície externa, fonte de calor do motor).
 *   - empty_24 → ponta do eixo (drive end) — proxy visível do rotor;
 *     desbalanceamento/desalinhamento do rotor aparece como velocidade ISO
 *     medida próxima ao eixo/rolamento.
 *   - empty_19 → tampa/capa do ventilador (non-drive end) — candidato a
 *     "aceleracao" (rolamento) na Fase 2, não usado ainda.
 *   - empty_2  → base/pés de fixação (não usado).
 *
 * `aceleracao` (rolamento, via atribuição de causa por ML/LSTM) é Fase 2 —
 * fica vazio aqui de propósito.
 */
export const MOTOR_SEGMENT_MAP: Record<string, string[]> = {
  velocidade: ["empty_24"],
  temperatura: ["empty_6"],
  aceleracao: [],
};

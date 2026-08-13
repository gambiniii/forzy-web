export interface Message {
  role: "ai" | "user";
  text: string;
}

export const initialMessages: Message[] = [
  {
    role: "ai",
    text: "Olá! Sou o assistente de monitoramento PRISM. Estou monitorando o Motor M-07 e identifiquei um alerta crítico de vibração. Como posso ajudar?",
  },
  { role: "user", text: "Qual é o diagnóstico do M-07?" },
  {
    role: "ai",
    text: "O M-07 apresenta desgaste no rolamento dianteiro DE (6205 2Z C3). A vibração está em 8.4 mm/s (limite: 7.0 mm/s), com pico espectral BPFO em 142 Hz. Confiança: 87%. Recomendo troca em até 48 horas.",
  },
  { role: "user", text: "Como realizar a inspeção do rolamento?" },
  {
    role: "ai",
    text: "Para inspecionar o rolamento dianteiro do M-07:\n\n1. LOTO — Desligar, bloquear e tagear\n2. Escuta — Estetoscópio no mancal DE\n3. Temperatura — Termômetro infravermelho\n4. Folga — Verificar axial e radial\n5. Visual — Desmontagem se necessário\n\nSons de batida rítmica = dano em pista. Folga radial visível = substitua imediatamente.",
  },
];

export const AI_FALLBACK = "Analisando dados do M-07... Para mais detalhes sobre esse ponto, consulte o diagnóstico IA ou os dados em tempo real do equipamento.";

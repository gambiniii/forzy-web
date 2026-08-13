export const timelineItems = [
  { color: "var(--red)",   title: "BPFO confirmado — Crítico",    sub: "Pico 142Hz · 8.4mm/s · Troca urgente",      time: "Hoje 08:51" },
  { color: "var(--amber)", title: "Vibração elevada detectada",   sub: "Início da degradação — 7.1 mm/s",           time: "25/03 14:00" },
  { color: "var(--blue)",  title: "Anomalia espectral leve",      sub: "Pico incipiente em 141Hz",                  time: "18/03 09:00" },
  { color: "var(--green)", title: "Status normal",                sub: "Sem anomalias",                             time: "01/03" },
];

export const actionPlan = [
  { priority: "red",   action: "Inspeção física do rolamento DE",          deadline: "Hoje",    responsible: "Mecânico Sênior", btnLabel: "Abrir OS"      },
  { priority: "red",   action: "Troca do rolamento 6205 2Z C3",            deadline: "Em 48h",  responsible: "Manutenção",      btnLabel: "Solicitar peça" },
  { priority: "amber", action: "Verificar alinhamento do acoplamento",     deadline: "Em 5 dias", responsible: "Técnico",       btnLabel: "Agendar"       },
];

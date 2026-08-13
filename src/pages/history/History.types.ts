export interface LogEvent {
  date: string;
  type: string;
  param: string;
  val: string;
  valColor: string;
  status: "red" | "green" | "blue" | "amber";
  statusLabel: string;
}

export const logEvents: LogEvent[] = [
  { date: "2025-04-08 08:47", type: "ALERTA",  param: "Vibração Y",   val: "8.4 mm/s", valColor: "var(--red)",   status: "red",   statusLabel: "Aberto"    },
  { date: "2025-04-07 14:22", type: "WARN",    param: "Temperatura",  val: "87.1°C",   valColor: "var(--amber)", status: "green", statusLabel: "Resolvido" },
  { date: "2025-04-06 09:15", type: "INFO",    param: "Corrente",     val: "38.5A",    valColor: "var(--text1)", status: "green", statusLabel: "Resolvido" },
  { date: "2025-04-05 11:30", type: "OK",      param: "Revisão",      val: "—",        valColor: "var(--text1)", status: "blue",  statusLabel: "Concluído" },
  { date: "2025-04-03 16:00", type: "WARN",    param: "Vibração Y",   val: "7.3 mm/s", valColor: "var(--amber)", status: "green", statusLabel: "Resolvido" },
];

import React from "react";

export type CompStatus = "green" | "amber" | "red";

export interface ComponentData {
  name: string;
  type: string;
  status: CompStatus;
  statusLabel: string;
  metrics: { val: string; label: string; color?: string }[];
  icon: React.ReactNode;
}

export const borderByStatus: Record<CompStatus, string> = {
  green: "1px solid var(--border)",
  amber: "1px solid rgba(255,184,48,.3)",
  red:   "1px solid rgba(255,79,106,.3)",
};

export const components: ComponentData[] = [
  {
    name: "Rolamento Dianteiro (DE)", type: "6205 2Z C3 · Drive End",
    status: "red", statusLabel: "Crítico",
    metrics: [
      { val: "8.4",  label: "mm/s vib", color: "var(--red)"   },
      { val: "142Hz",label: "pico BPFO", color: "var(--amber)" },
      { val: "35%",  label: "saúde",    color: "var(--red)"   },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
  {
    name: "Rolamento Traseiro (NDE)", type: "6205 2Z C3 · Non-Drive End",
    status: "green", statusLabel: "Normal",
    metrics: [
      { val: "2.1", label: "mm/s vib", color: "var(--green)" },
      { val: "—",   label: "anomalia" },
      { val: "94%", label: "saúde",   color: "var(--green)" },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" /><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" /></svg>,
  },
  {
    name: "Estator / Bobinagem", type: "Classe H · 180°C máx.",
    status: "green", statusLabel: "Normal",
    metrics: [
      { val: "74.3", label: "°C temp",  color: "var(--green)" },
      { val: "42.1A",label: "corrente", color: "var(--green)" },
      { val: "91%",  label: "saúde",   color: "var(--green)" },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  },
  {
    name: "Caixa de Ligação", type: "IP55 · Terminais Y/Δ",
    status: "green", statusLabel: "Normal",
    metrics: [
      { val: "0,81", label: "cos φ",  color: "var(--green)" },
      { val: "400V", label: "tensão" },
      { val: "97%",  label: "saúde", color: "var(--green)" },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><rect x="2" y="6" width="12" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" /><path d="M5 6V4M11 6V4M5 10v2M11 10v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  },
  {
    name: "Eixo / Rotor", type: "Aço inox · Balanceado G2.5",
    status: "green", statusLabel: "Normal",
    metrics: [
      { val: "1.760", label: "RPM",      color: "var(--green)" },
      { val: "0.8mm", label: "folga ax." },
      { val: "93%",   label: "saúde",   color: "var(--green)" },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  },
  {
    name: "Ventilador de Resfriamento", type: "Eixo externo · IP55",
    status: "amber", statusLabel: "Atenção",
    metrics: [
      { val: "74.3", label: "°C saída", color: "var(--amber)" },
      { val: "1.760",label: "RPM" },
      { val: "74%",  label: "saúde",   color: "var(--amber)" },
    ],
    icon: <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d="M8 2v12M2 8l6-6 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
];

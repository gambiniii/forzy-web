export type MachineStatus = "green" | "amber" | "red";

export interface Machine {
  id: string;
  name: string;
  meta: string;
  temp: { val: string; color: string };
  vib:  { val: string; color: string };
  curr: { val: string; color: string };
  status: MachineStatus;
  statusLabel: string;
}

export const machines: Machine[] = [
  {
    id: "M-07", name: "M-07 — Motor Siemens 1LE0022", meta: "Linha 3 · S/N 4892-A · 1.5kW · IP55",
    temp: { val: "74.3°C", color: "var(--green)" }, vib: { val: "8.4mm/s", color: "var(--red)" }, curr: { val: "42.1A", color: "var(--blue)" },
    status: "red", statusLabel: "Alerta",
  },
  {
    id: "M-03", name: "M-03 — Motor Dutchi DMA100L4", meta: "Linha 1 · S/N 7734-B · 2.2kW · IP55",
    temp: { val: "85.1°C", color: "var(--amber)" }, vib: { val: "3.2mm/s", color: "var(--green)" }, curr: { val: "44.8A", color: "var(--blue)" },
    status: "amber", statusLabel: "Atenção",
  },
  {
    id: "M-12", name: "M-12 — Compressor Atlas Copco GA15", meta: "Linha 2 · S/N 1120-C · 15kW",
    temp: { val: "62.0°C", color: "var(--green)" }, vib: { val: "2.1mm/s", color: "var(--green)" }, curr: { val: "28.5A", color: "var(--green)" },
    status: "green", statusLabel: "Normal",
  },
  {
    id: "M-15", name: "M-15 — Bomba Grundfos CM5-4", meta: "Linha 3 · S/N 3310-D · 0.75kW",
    temp: { val: "48.2°C", color: "var(--green)" }, vib: { val: "1.8mm/s", color: "var(--green)" }, curr: { val: "38.2A", color: "var(--amber)" },
    status: "amber", statusLabel: "Atenção",
  },
  {
    id: "M-21", name: "M-21 — Motor WEG W22 75CV", meta: "Linha 1 · S/N 9921-A · 75kW",
    temp: { val: "71.0°C", color: "var(--green)" }, vib: { val: "4.1mm/s", color: "var(--green)" }, curr: { val: "68.0A", color: "var(--green)" },
    status: "green", statusLabel: "Normal",
  },
];

export const FILTERS = ["Todos", "Linha 1", "Linha 2", "Linha 3"];

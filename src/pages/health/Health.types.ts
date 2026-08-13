import { CO, randomData, lineDataset } from "../../components/charts/chartHelpers";

export interface MachineHealth {
  name: string;
  status: "red" | "amber" | "green";
  statusLabel: string;
  health: number;
  color: string;
  probas: { label: string; percent: number; color: string }[];
}

export const machines: MachineHealth[] = [
  {
    name: "M-07 — Siemens 1LE0022", status: "red", statusLabel: "Crítico", health: 78, color: "var(--red)",
    probas: [
      { label: "Rolamento DE",    percent: 35, color: "var(--red)"   },
      { label: "Temperatura",     percent: 82, color: "var(--green)" },
      { label: "Sistema Elétrico",percent: 91, color: "var(--green)" },
    ],
  },
  {
    name: "M-03 — Dutchi DMA100L4", status: "amber", statusLabel: "Atenção", health: 89, color: "var(--amber)",
    probas: [
      { label: "Rolamento",       percent: 88, color: "var(--purple)" },
      { label: "Temperatura",     percent: 72, color: "var(--amber)"  },
      { label: "Sistema Elétrico",percent: 95, color: "var(--green)"  },
    ],
  },
  {
    name: "M-12 — Atlas Copco GA15", status: "green", statusLabel: "Normal", health: 96, color: "var(--green)",
    probas: [
      { label: "Rolamento",       percent: 96, color: "var(--purple)" },
      { label: "Temperatura",     percent: 94, color: "var(--purple)" },
      { label: "Sistema Elétrico",percent: 98, color: "var(--purple)" },
    ],
  },
];

const days = Array.from({ length: 14 }, (_, i) => `${i + 1}/04`);
export const healthData = { labels: days, datasets: [lineDataset(randomData(14, 82, 8), CO.green, "%")] };

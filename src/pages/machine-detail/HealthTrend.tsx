import { Line } from "react-chartjs-2";
import { baseOptions, lineDataset, CO } from "../../components/charts/chartHelpers";
import { healthPct } from "./diagnosticoUtils";
import type { Anomalia } from "../../services/anomalias.service";

function toLabel(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

interface Props {
  anomalias: Anomalia[];
}

/**
 * A trajetória de saúde do motor ao longo dos diagnósticos — o "enredo"
 * por trás do número isolado que aparece no gauge.
 */
export function HealthTrend({ anomalias }: Props) {
  const points = [...anomalias]
    .reverse() // veio DESC do backend, gráfico precisa de ordem cronológica
    .filter((a) => a.health_score !== null);

  if (points.length < 2) {
    return (
      <div style={{ padding: "10px 16px", fontSize: 11, color: "var(--text3)" }}>
        Ainda não há diagnósticos suficientes para traçar uma tendência.
      </div>
    );
  }

  const labels = points.map((a) => toLabel(a.timestamp));
  const values = points.map((a) => healthPct(a.health_score) as number);

  return (
    <div style={{ padding: "8px 16px 4px", height: 96 }}>
      <Line
        data={{ labels, datasets: [lineDataset(values, CO.purple, "Saúde")] }}
        options={baseOptions(0, 100) as any}
      />
    </div>
  );
}

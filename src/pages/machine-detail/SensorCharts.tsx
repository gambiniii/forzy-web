import { Line } from "react-chartjs-2";
import { baseOptions, lineDataset, CO } from "../../components/charts/chartHelpers";
import { ChartBox } from "./MachineDetail.styles";
import type { LeituraSensor } from "../../services/leituras.service";

const CHARTS = [
  { label: "Vibração (mm/s)", key: "vibracao" as const, color: CO.amber },
  { label: "RPM",             key: "rpm"      as const, color: CO.blue },
  { label: "Temperatura (°C)", key: "temperatura" as const, color: CO.purple },
  { label: "Corrente (A)",    key: "corrente" as const, color: CO.green },
] as const;

interface Props {
  leituras: LeituraSensor[];
}

export function SensorCharts({ leituras }: Props) {
  if (leituras.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text3)", fontSize: 13 }}>Sem leituras disponíveis.</p>
      </div>
    );
  }

  const labels = leituras.map((l) => {
    if (!l.timestamp) return "";
    const s = l.timestamp.toString().replace(/(\.\d{3})\d+/, "$1").replace(/([+-]\d{2}:\d{2}|Z)?$/, (m) => m || "Z");
    const d = new Date(s);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, flex: 1 }}>
      {CHARTS.map(({ label, key, color }) => {
        const data = leituras.map((l) => l[key] ?? null);
        const hasData = data.some((v) => v !== null);
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <span style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4, display: "block" }}>
              {label}
            </span>
            {hasData ? (
              <ChartBox style={{ flex: 1 }}>
                <Line
                  data={{ labels, datasets: [lineDataset(data as number[], color, label)] }}
                  options={baseOptions() as any}
                />
              </ChartBox>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>Sem dados</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { Line } from "react-chartjs-2";
import { baseOptions, lineDataset, CO } from "../../components/charts/chartHelpers";
import { useLeituras } from "../../hooks/useLeituras";
import { ChartBox, RangeBar, RangeBtn } from "./MachineDetail.styles";
import type { LeituraSensor } from "../../services/leituras.service";

const CHARTS = [
  { label: "Vibração (mm/s)",  key: "vibracao"    as const, color: CO.amber  },
  { label: "RPM",              key: "rpm"          as const, color: CO.blue   },
  { label: "Temperatura (°C)", key: "temperatura"  as const, color: CO.purple },
  { label: "Corrente (A)",     key: "corrente"     as const, color: CO.green  },
] as const;

const RANGES = [
  { label: "Ao vivo", value: "live" },
  { label: "1h",      value: "-1h"  },
  { label: "6h",      value: "-6h"  },
  { label: "24h",     value: "-24h" },
  { label: "7d",      value: "-7d"  },
] as const;
type Range = typeof RANGES[number]["value"];

function toLabel(ts: string): string {
  const s = ts.replace(/(\.\d{3})\d+/, "$1").replace(/([+-]\d{2}:\d{2}|Z)?$/, (m) => m || "Z");
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

interface Props {
  leituras: LeituraSensor[];
  componenteId: number;
}

export function SensorCharts({ leituras: liveLeituras, componenteId }: Props) {
  const [range, setRange] = useState<Range>("live");

  const { leituras: histLeituras, loading } = useLeituras(
    range !== "live" ? componenteId : 0,
    { start: range !== "live" ? range : "-1h" }
  );

  const data = range === "live" ? liveLeituras : histLeituras;

  const empty = data.length === 0;

  const labels = data.map((l) => toLabel(l.timestamp ?? ""));

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <RangeBar>
        {RANGES.map((r) => (
          <RangeBtn key={r.value} $active={range === r.value} onClick={() => setRange(r.value)}>
            {r.label}
          </RangeBtn>
        ))}
      </RangeBar>

      {loading && range !== "live" ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Carregando...</span>
        </div>
      ) : empty ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--text3)", fontSize: 13 }}>Sem leituras no período.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, flex: 1, padding: "4px 16px 12px", minHeight: 0 }}>
          {CHARTS.map(({ label, key, color }) => {
            const values = data.map((l) => l[key] ?? null);
            const hasData = values.some((v) => v !== null);
            return (
              <div key={key} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
                <span style={{ fontSize: 11, color: "var(--text2)", marginBottom: 4, display: "block" }}>
                  {label}
                </span>
                {hasData ? (
                  <ChartBox style={{ flex: 1 }}>
                    <Line
                      data={{ labels, datasets: [lineDataset(values as number[], color, label)] }}
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
      )}
    </div>
  );
}

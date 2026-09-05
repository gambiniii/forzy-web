import { SummaryBar, SummarySegment, SummaryLegend, SummaryLegendItem, SummaryDot, SummaryMeta } from "./MachineDetail.styles";
import { STATUS_LABEL } from "./diagnosticoUtils";
import { formatRelativeTime } from "./narrative";
import type { Anomalia } from "../../services/anomalias.service";

const SEGMENT_COLOR: Record<Anomalia["overall_status"], string> = {
  healthy:         "var(--success)",
  warning:         "#ffb833",
  critical:        "var(--red)",
  motor_desligado: "var(--text3)",
  retido:          "var(--text3)",
};

const ORDER: Anomalia["overall_status"][] = ["healthy", "warning", "critical", "motor_desligado", "retido"];

interface Props {
  anomalias: Anomalia[];
}

/** Composição do período visível (% por status) + última anomalia registrada. */
export function DiagnosticoSummary({ anomalias }: Props) {
  const total = anomalias.length;
  const counts: Record<Anomalia["overall_status"], number> = {
    healthy: 0, warning: 0, critical: 0, motor_desligado: 0, retido: 0,
  };
  anomalias.forEach((a) => { counts[a.overall_status]++; });

  const lastAnomaly = anomalias.find((a) => a.is_anomaly);

  return (
    <div style={{ padding: "0 16px 12px" }}>
      <SummaryBar>
        {ORDER.filter((s) => counts[s] > 0).map((s) => (
          <SummarySegment key={s} $color={SEGMENT_COLOR[s]} style={{ flexGrow: counts[s] }} />
        ))}
      </SummaryBar>

      <SummaryLegend>
        {ORDER.filter((s) => counts[s] > 0).map((s) => (
          <SummaryLegendItem key={s}>
            <SummaryDot $color={SEGMENT_COLOR[s]} />
            {STATUS_LABEL[s]} {Math.round((counts[s] / total) * 100)}%
          </SummaryLegendItem>
        ))}
      </SummaryLegend>

      <SummaryMeta>
        {lastAnomaly
          ? `Última anomalia ${formatRelativeTime(lastAnomaly.timestamp)} (${STATUS_LABEL[lastAnomaly.overall_status]})`
          : `Nenhuma anomalia nos últimos ${total} diagnóstico${total === 1 ? "" : "s"}`}
      </SummaryMeta>
    </div>
  );
}

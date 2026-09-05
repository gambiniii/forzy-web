import {
  AnomaliaTable, AnomaliaRow, AnomaliaRowMain,
  AnomaliaRowLabel, AnomaliaRowMeta, AnomaliaRowTime,
  EmptyAnomalias,
} from "./MachineDetail.styles";
import type { Anomalia } from "../../services/anomalias.service";

const FMT: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" };

function formatTs(ts: string) {
  return new Date(ts).toLocaleString("pt-BR", FMT);
}

interface Props {
  anomalias: Anomalia[];
}

const STATUS_LABEL: Record<string, string> = {
  critical:        "Crítico",
  warning:         "Atenção",
  healthy:         "Normal",
  motor_desligado: "Desligado",
  retido:          "Retido",
};

export function AnomaliaHistorico({ anomalias }: Props) {
  if (anomalias.length === 0) {
    return (
      <EmptyAnomalias>
        <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor" />
        </svg>
        Nenhum diagnóstico registrado
      </EmptyAnomalias>
    );
  }

  return (
    <AnomaliaTable>
      {anomalias.map((a) => (
        <AnomaliaRow key={a.id} $status={a.overall_status}>
          <AnomaliaRowMain>
            <AnomaliaRowLabel $status={a.overall_status}>
              {STATUS_LABEL[a.overall_status] ?? a.overall_status}
              {a.lstm_severity && a.lstm_severity !== "n/a" ? ` · ${a.lstm_severity}` : ""}
            </AnomaliaRowLabel>
            <AnomaliaRowMeta>
              {a.health_index != null ? `Health ${a.health_index}%` : ""}
              {a.rul_hours != null ? ` · RUL ${a.rul_hours}h` : ""}
              {a.risk_level && a.risk_level !== "unknown" ? ` · ${a.risk_level}` : ""}
            </AnomaliaRowMeta>
          </AnomaliaRowMain>
          <AnomaliaRowTime>{formatTs(a.timestamp)}</AnomaliaRowTime>
        </AnomaliaRow>
      ))}
    </AnomaliaTable>
  );
}

import type { MlPrediction } from "../../hooks/useWsLeituras";
import {
  GaugeWrap, IsoZoneBadge, KpiRow, KpiTile, KpiValue, KpiLabel, RecommendationBox,
} from "./MachineDetail.styles";

/* ── Gauge semicircular ─────────────────────────────────────────────── */

function Gauge({ value, color }: { value: number; color: string }) {
  const pct = Math.min(1, Math.max(0, value / 100));
  const cx = 70, cy = 68, r = 54;
  const angle = Math.PI * (1 - pct);
  const ex = cx + r * Math.cos(angle);
  const ey = cy - r * Math.sin(angle);
  const large = pct > 0.5 ? 1 : 0;

  const bgD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  let fgD = "";
  if (pct > 0.01) {
    fgD = pct > 0.995
      ? bgD
      : `M ${cx - r} ${cy} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  }

  return (
    <svg viewBox="0 0 140 76" width="140" style={{ maxWidth: "100%" }}>
      {/* Ticks de zona ISO */}
      {[0, 0.33, 0.66, 1].map((t) => {
        const a = Math.PI * (1 - t);
        const x1 = cx + (r - 8) * Math.cos(a), y1 = cy - (r - 8) * Math.sin(a);
        const x2 = cx + (r + 2) * Math.cos(a), y2 = cy - (r + 2) * Math.sin(a);
        return <line key={t} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="var(--border-md)" strokeWidth="1.5" />;
      })}
      {/* Arco fundo */}
      <path d={bgD} fill="none" stroke="var(--bg2)" strokeWidth="10" strokeLinecap="round" />
      {/* Arco valor */}
      {fgD && (
        <path d={fgD} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      )}
      {/* Porcentagem */}
      <text x={cx} y={cy - 14} textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="inherit">
        {value.toFixed(0)}%
      </text>
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="7.5" fill="var(--text3)" fontFamily="inherit" letterSpacing="0.06em">
        SAÚDE DO MOTOR
      </text>
    </svg>
  );
}

/* ── ISO zone ───────────────────────────────────────────────────────── */

const ISO_ZONES = {
  A: { color: "var(--success)", label: "ISO Zona A · Normal" },
  B: { color: "#ffb833",       label: "ISO Zona B · Atenção" },
  C: { color: "#ff7a1a",       label: "ISO Zona C · Limitado" },
  D: { color: "var(--red)",    label: "ISO Zona D · Crítico" },
} as const;

function getZone(p: MlPrediction): "A" | "B" | "C" | "D" {
  if (p.overall_status === "critical") return "D";
  if (p.risk_level === "high" || p.lstm_severity === "high" || p.lstm_severity === "critical") return "C";
  if (p.overall_status === "warning" || p.risk_level === "medium" || p.lstm_severity === "medium") return "B";
  return "A";
}

function gaugeColor(pct: number): string {
  if (pct >= 75) return "var(--success)";
  if (pct >= 50) return "#ffb833";
  return "var(--red)";
}

/* ── RUL formatting ─────────────────────────────────────────────────── */

function formatRul(hours: number): string {
  if (hours > 720) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours)}h`;
}

/* ── Component ─────────────────────────────────────────────────────── */

interface Props {
  prediction: MlPrediction;
}

export function MlDiagnostic({ prediction }: Props) {
  const healthPct = prediction.health_score <= 1
    ? prediction.health_score * 100
    : prediction.health_score;
  const color = gaugeColor(healthPct);
  const zone = getZone(prediction);
  const { color: zoneColor, label: zoneLabel } = ISO_ZONES[zone];

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "auto" }}>
      <GaugeWrap>
        <Gauge value={healthPct} color={color} />
        <IsoZoneBadge $color={zoneColor}>{zoneLabel}</IsoZoneBadge>
      </GaugeWrap>

      <KpiRow>
        <KpiTile>
          <KpiValue $color={prediction.rul_hours < 200 ? "var(--red)" : prediction.rul_hours < 500 ? "#ffb833" : "var(--success)"}>
            {formatRul(prediction.rul_hours)}
          </KpiValue>
          <KpiLabel>RUL Est.</KpiLabel>
        </KpiTile>
        <KpiTile>
          <KpiValue>{prediction.maintenance_window_days}d</KpiValue>
          <KpiLabel>Próx. Manutenção</KpiLabel>
        </KpiTile>
        <KpiTile>
          <KpiValue $color={prediction.is_anomaly ? "var(--red)" : "var(--success)"}>
            {prediction.is_anomaly ? "Sim" : "Não"}
          </KpiValue>
          <KpiLabel>Anomalia</KpiLabel>
        </KpiTile>
      </KpiRow>

      {prediction.recommendation && (
        <RecommendationBox>{prediction.recommendation}</RecommendationBox>
      )}
    </div>
  );
}

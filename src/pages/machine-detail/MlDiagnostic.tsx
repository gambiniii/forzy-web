import type { Anomalia } from "../../services/anomalias.service";
import {
  GaugeWrap, IsoZoneBadge, KpiRow, KpiTile, KpiValue, KpiLabel, RecommendationBox,
} from "./MachineDetail.styles";
import { ISO_ZONES, getZone, gaugeColor, healthPct, formatRul } from "./diagnosticoUtils";

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

/* ── Component ─────────────────────────────────────────────────────── */

interface Props {
  prediction: Anomalia;
}

export function MlDiagnostic({ prediction }: Props) {
  if (prediction.overall_status === "motor_desligado" || prediction.health_score === null) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", padding: "8px 16px", textAlign: "center" }}>
          Motor desligado — sem leitura de saúde no momento.
        </p>
      </div>
    );
  }

  const pct = healthPct(prediction.health_score) ?? 0;
  const color = gaugeColor(pct);
  const zone = getZone(prediction);
  const { color: zoneColor, label: zoneLabel } = ISO_ZONES[zone];
  const rulColor = prediction.rul_hours === null
    ? "var(--text3)"
    : prediction.rul_hours < 200 ? "var(--red)" : prediction.rul_hours < 500 ? "#ffb833" : "var(--success)";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "auto" }}>
      <GaugeWrap>
        <Gauge value={pct} color={color} />
        <IsoZoneBadge $color={zoneColor}>{zoneLabel}</IsoZoneBadge>
      </GaugeWrap>

      <KpiRow>
        <KpiTile>
          <KpiValue $color={rulColor}>
            {formatRul(prediction.rul_hours)}
          </KpiValue>
          <KpiLabel>RUL Est.</KpiLabel>
        </KpiTile>
        <KpiTile>
          <KpiValue>{prediction.maintenance_window_days !== null ? `${prediction.maintenance_window_days}d` : "—"}</KpiValue>
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

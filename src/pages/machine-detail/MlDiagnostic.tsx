import { useState } from "react";
import type { Anomalia } from "../../services/anomalias.service";
import {
  GaugeWrap, IsoZoneBadge, KpiRow, KpiTile, KpiValue, KpiLabel, RecommendationBox,
} from "./MachineDetail.styles";
import { ISO_ZONES, getZone, gaugeColor, healthPct, formatRul, THRESHOLD_LABEL } from "./diagnosticoUtils";
import { HandoffModal } from "./HandoffModal";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { canApproveAction } from "../../utils/roles";

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

/* ── Registrar decisão (handoff humano, CS3 §9.4) ─────────────────────── */

function HandoffSection({ prediction }: { prediction: Anomalia }) {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [registeredAt, setRegisteredAt] = useState<string | null>(null);

  if (!canApproveAction(user?.role)) return null;

  return (
    <div style={{ padding: "0 12px 12px" }}>
      {registeredAt ? (
        <p style={{ fontSize: 11, color: "var(--success)" }}>
          Decisão registrada por {user?.name} às {new Date(registeredAt).toLocaleTimeString("pt-BR")}.
        </p>
      ) : (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: "var(--radius)",
            border: "1px solid var(--purple)", background: "var(--purple-d)", color: "var(--purple)",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          Registrar decisão / Aprovar ação
        </button>
      )}
      <HandoffModal
        target={`componente:${prediction.componente_id}`}
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => setRegisteredAt(new Date().toISOString())}
      />
    </div>
  );
}

/* ── Component ─────────────────────────────────────────────────────── */

interface Props {
  prediction: Anomalia;
}

export function MlDiagnostic({ prediction }: Props) {
  const thresholdBadge = prediction.threshold_status ? THRESHOLD_LABEL[prediction.threshold_status] : null;
  const needsHandoff =
    prediction.overall_status === "critical" ||
    prediction.overall_status === "retido" ||
    prediction.threshold_status === "critico";

  if (prediction.overall_status === "motor_desligado") {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", padding: "8px 16px", textAlign: "center" }}>
          Motor desligado — sem leitura de saúde no momento.
        </p>
      </div>
    );
  }

  if (prediction.overall_status === "retido") {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "auto" }}>
        <div style={{ padding: "24px 16px 8px", textAlign: "center" }}>
          <IsoZoneBadge $color="var(--text3)">CIRCUIT BREAKER · RETIDO</IsoZoneBadge>
          <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 12, lineHeight: 1.5 }}>
            {prediction.recommendation ?? "Diagnóstico retido — aguardando dado confiável."}
          </p>
          {prediction.confidence !== null && (
            <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
              Confiança do modelo: {prediction.confidence.toFixed(1)}%
            </p>
          )}
        </div>
        <HandoffSection prediction={prediction} />
      </div>
    );
  }

  if (prediction.health_score === null) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", padding: "8px 16px", textAlign: "center" }}>
          Sem leitura de saúde no momento.
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
        {thresholdBadge && (
          <div style={{ marginTop: 6, fontSize: 10, fontWeight: 600, color: thresholdBadge.color }}>
            LIMITE: {thresholdBadge.label}
          </div>
        )}
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
        <KpiTile>
          <KpiValue>{prediction.confidence !== null ? `${prediction.confidence.toFixed(0)}%` : "—"}</KpiValue>
          <KpiLabel>Confiança</KpiLabel>
        </KpiTile>
      </KpiRow>

      {prediction.threshold_message && (
        <p style={{ fontSize: 11, color: "var(--text3)", padding: "0 12px 8px", lineHeight: 1.4 }}>
          {prediction.threshold_message}
        </p>
      )}

      {prediction.recommendation && (
        <RecommendationBox>{prediction.recommendation}</RecommendationBox>
      )}

      {needsHandoff && <HandoffSection prediction={prediction} />}
    </div>
  );
}

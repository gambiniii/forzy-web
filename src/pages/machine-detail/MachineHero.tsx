import { useState, type ReactNode } from "react";
import { BackButton } from "../../components/ui/BackButton";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Counter } from "../../components/ui/Badge/Badge";
import { BellButton, BellCounterWrap } from "../../components/ui/Toast/Toast.styles";
import {
  HeroBar, HeroTopRow, HeroTitle, HeroSub, HeroDivider, HeroBody,
  HeroLeft, HeroStatusLine, HeroNarrative, HeroChips,
  KpiTile, KpiValue, KpiLabel,
  AlertBanner, AlertIcon, AlertBody, AlertTitle, AlertText, AlertMeta,
} from "./MachineDetail.styles";
import { ISO_ZONES, getZone, healthPct, formatRul, STATUS_LABEL, THRESHOLD_LABEL } from "./diagnosticoUtils";
import { describeTrend, formatRelativeTime } from "./narrative";
import { LimitesModal } from "./LimitesModal";
import { DiagnosticoHistoricoModal } from "./DiagnosticoHistoricoModal";
import { useAnomalyToasts } from "./useAnomalyToasts";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { canEditLimits } from "../../utils/roles";
import type { Anomalia } from "../../services/anomalias.service";

interface Props {
  title: string;
  sub?: string;
  action?: ReactNode;
  secondaryActions?: ReactNode;
  online: boolean;
  lastLeituraTimestamp?: string;
  prediction: Anomalia | null;
  anomalias: Anomalia[];
  componenteId: number;
  motorId: number;
}

export function MachineHero({ title, sub, action, secondaryActions, online, lastLeituraTimestamp, prediction, anomalias, componenteId, motorId }: Props) {
  const trend = prediction ? describeTrend(anomalias) : null;
  const { user } = useCurrentUser();
  const [limitesOpen, setLimitesOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const thresholdBadge = prediction?.threshold_status ? THRESHOLD_LABEL[prediction.threshold_status] : null;
  const { unread, clearUnread } = useAnomalyToasts(anomalias);

  return (
    <HeroBar>
      <HeroTopRow>
        <div>
          <BackButton style={{ marginBottom: 4 }} />
          <HeroTitle>{title}</HeroTitle>
          {sub && <HeroSub>{sub}</HeroSub>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          {secondaryActions}
          <Button onClick={() => setLimitesOpen(true)}>Limites</Button>
          <BellButton
            type="button"
            aria-label="Diagnóstico e histórico de alertas"
            onClick={() => { setHistoricoOpen(true); clearUnread(); }}
          >
            🔔
            {unread > 0 && (
              <BellCounterWrap>
                <Counter count={unread} />
              </BellCounterWrap>
            )}
          </BellButton>
          {action}
        </div>
      </HeroTopRow>

      {limitesOpen && (
        <LimitesModal
          componenteId={componenteId}
          open={limitesOpen}
          onClose={() => setLimitesOpen(false)}
          canEdit={canEditLimits(user?.role)}
        />
      )}

      {historicoOpen && (
        <DiagnosticoHistoricoModal
          open={historicoOpen}
          onClose={() => setHistoricoOpen(false)}
          prediction={prediction}
          anomalias={anomalias}
          motorId={motorId}
        />
      )}

      <HeroDivider />

      <HeroBody>
      <HeroLeft>
        <HeroStatusLine>
          <StatusPill variant={online ? "green" : "red"} animated={online}>
            {online ? "ONLINE" : "OFFLINE"}
          </StatusPill>
          <span>última leitura {formatRelativeTime(lastLeituraTimestamp)}</span>
        </HeroStatusLine>

        {!prediction && (
          <HeroNarrative>Aguardando o primeiro diagnóstico deste motor.</HeroNarrative>
        )}

        {prediction && prediction.overall_status === "motor_desligado" && (
          <HeroNarrative>Motor desligado no momento — sem leitura de vibração ativa.</HeroNarrative>
        )}

        {prediction && prediction.overall_status === "retido" && (
          <HeroNarrative>
            {prediction.recommendation ?? "Diagnóstico retido pelo circuit breaker — aguardando dado confiável."}
          </HeroNarrative>
        )}

        {prediction && prediction.overall_status !== "motor_desligado" && prediction.overall_status !== "retido" && (
          prediction.is_anomaly ? (
            <AlertBanner $status={prediction.overall_status === "critical" ? "critical" : "warning"}>
              <AlertIcon $status={prediction.overall_status === "critical" ? "critical" : "warning"}>⚠</AlertIcon>
              <AlertBody>
                <AlertTitle $status={prediction.overall_status === "critical" ? "critical" : "warning"}>
                  {STATUS_LABEL[prediction.overall_status]}
                </AlertTitle>
                <AlertText>{prediction.recommendation ?? "Anomalia detectada na análise de vibração."}</AlertText>
                {trend && <AlertMeta>{trend}</AlertMeta>}
              </AlertBody>
            </AlertBanner>
          ) : (
            <HeroNarrative>
              {prediction.recommendation ?? "Motor operando normalmente."}
              {trend && <> {trend}</>}
            </HeroNarrative>
          )
        )}
      </HeroLeft>

      {prediction && (thresholdBadge || prediction.overall_status !== "motor_desligado") && (
        <HeroChips>
          {thresholdBadge && (
            <KpiTile>
              <KpiValue $color={thresholdBadge.color}>{thresholdBadge.label}</KpiValue>
              <KpiLabel>Limite (Metric Contract)</KpiLabel>
            </KpiTile>
          )}
          {prediction.overall_status !== "motor_desligado" && prediction.overall_status !== "retido" && (
            <>
              <KpiTile>
                <KpiValue>{healthPct(prediction.health_score)?.toFixed(0) ?? "—"}%</KpiValue>
                <KpiLabel>Saúde</KpiLabel>
              </KpiTile>
              <KpiTile>
                <KpiValue>{formatRul(prediction.rul_hours)}</KpiValue>
                <KpiLabel>RUL Est.</KpiLabel>
              </KpiTile>
              <KpiTile>
                <KpiValue>{prediction.maintenance_window_days !== null ? `${prediction.maintenance_window_days}d` : "—"}</KpiValue>
                <KpiLabel>Manutenção</KpiLabel>
              </KpiTile>
              <KpiTile>
                <KpiValue $color={ISO_ZONES[getZone(prediction)].color}>{getZone(prediction)}</KpiValue>
                <KpiLabel>Zona ISO</KpiLabel>
              </KpiTile>
            </>
          )}
        </HeroChips>
      )}
      </HeroBody>
    </HeroBar>
  );
}

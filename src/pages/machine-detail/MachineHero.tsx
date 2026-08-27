import type { ReactNode } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { BackButton } from "../../components/ui/BackButton";
import { StatusPill } from "../../components/ui/StatusPill";
import {
  HeroBar, HeroTopRow, HeroTitle, HeroSub, HeroDivider, HeroBody,
  HeroLeft, HeroStatusLine, HeroNarrative, HeroChips,
  KpiTile, KpiValue, KpiLabel,
  AlertBanner, AlertIcon, AlertBody, AlertTitle, AlertText, AlertMeta,
} from "./MachineDetail.styles";
import { ISO_ZONES, getZone, healthPct, formatRul, STATUS_LABEL } from "./diagnosticoUtils";
import { describeTrend, formatRelativeTime } from "./narrative";
import type { Anomalia } from "../../services/anomalias.service";

interface Props {
  title: string;
  sub?: string;
  action?: ReactNode;
  online: boolean;
  lastLeituraTimestamp?: string;
  prediction: Anomalia | null;
  anomalias: Anomalia[];
}

export function MachineHero({ title, sub, action, online, lastLeituraTimestamp, prediction, anomalias }: Props) {
  const trend = prediction ? describeTrend(anomalias) : null;

  return (
    <HeroBar>
      <HeroTopRow>
        <div>
          <BackButton style={{ marginBottom: 4 }} />
          <HeroTitle>{title}</HeroTitle>
          {sub && <HeroSub>{sub}</HeroSub>}
        </div>
        {action}
      </HeroTopRow>

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

        {prediction && prediction.overall_status !== "motor_desligado" && (
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

      {prediction && prediction.overall_status !== "motor_desligado" && (
        <HeroChips>
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
        </HeroChips>
      )}
      </HeroBody>
    </HeroBar>
  );
}

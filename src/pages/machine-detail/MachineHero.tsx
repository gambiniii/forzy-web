import { useState, type ReactNode } from "react";
import { BackButton } from "../../components/ui/BackButton";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Badge, Counter } from "../../components/ui/Badge/Badge";
import { BellButton, BellCounterWrap } from "../../components/ui/Toast/Toast.styles";
import { HeartPulseIcon } from "../../components/ui/icons/HeartPulseIcon";
import {
  HeroBar, HeroTopRow, HeroTitle, HeroSub, HeroDivider, HeroBody,
  HeroLeft, HeroStatusLine, HeroChips,
  KpiTile, KpiValue, KpiLabel,
} from "./MachineDetail.styles";
import { ISO_ZONES, getZone, THRESHOLD_LABEL } from "./diagnosticoUtils";
import { formatRelativeTime } from "./narrative";
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
  lastLeituraOrigem?: string | null;
  prediction: Anomalia | null;
  anomalias: Anomalia[];
  componenteId: number;
  motorId: number;
}

export function MachineHero({ title, sub, action, secondaryActions, online, lastLeituraTimestamp, lastLeituraOrigem, prediction, anomalias, componenteId, motorId }: Props) {
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
            <HeartPulseIcon />
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
          {/* {lastLeituraOrigem === "demo" && (
            <Badge variant="purple">DADOS DE DEMONSTRAÇÃO</Badge>
          )} */}
        </HeroStatusLine>
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
            <KpiTile>
              <KpiValue $color={ISO_ZONES[getZone(prediction)].color}>{getZone(prediction)}</KpiValue>
              <KpiLabel>Zona ISO</KpiLabel>
            </KpiTile>
          )}
        </HeroChips>
      )}
      </HeroBody>
    </HeroBar>
  );
}

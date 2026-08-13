import { useNavigation } from "../../context/NavigationContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { AlertItem } from "../../components/ui/AlertItem";
import { SelectField } from "../../components/ui/InputField";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PageWrapper,
  MetricsGrid,
  ContentStack,
  HeaderActions,
  AlertRightSlot,
  AlertTime,
} from "./AlertsScreen.styles";

export function AlertsScreen() {
  const { goTo } = useNavigation();

  return (
    <PageWrapper>
      <PageHeader
        title="Alertas e Falhas"
        sub="3 ativos · 1 crítico · 2 em atenção"
        right={
          <HeaderActions>
            <SelectField style={{ width: 140, fontSize: 12, padding: "6px 10px" }}>
              <option>Todos</option>
              <option>Crítico</option>
              <option>Atenção</option>
              <option>Info</option>
            </SelectField>
            <Button>Reconhecer todos</Button>
          </HeaderActions>
        }
      />

      <ContentStack>
        <MetricsGrid>
          <MetricCard label="Críticos" value="1" variant="red" />
          <MetricCard label="Atenção" value="2" variant="amber" />
          <MetricCard label="Informativos" value="4" variant="blue" />
          <MetricCard label="Resolvidos Hoje" value="6" variant="green" />
        </MetricsGrid>

        <Card>
          <CardHeader title="Alertas Ativos" />
          <AlertItem
            severity="crit"
            title="Vibração crítica — M-07 · Rolamento DE"
            detail="Eixo Y: 8.4 mm/s · Limite: 7.0 mm/s · Duração: 52 min · BPFO 142Hz confirmado"
            time="08:47"
            onClick={() => goTo("diagnosis")}
            right={
              <AlertRightSlot>
                <AlertTime>08:47</AlertTime>
                <StatusPill variant="red">CRÍTICO</StatusPill>
              </AlertRightSlot>
            }
          />
          <AlertItem
            severity="warn"
            title="Temperatura elevada — M-03"
            detail="85.1°C · Atenção: >80°C · Ventilação verificar"
            time="07:12"
            right={
              <AlertRightSlot>
                <AlertTime>07:12</AlertTime>
                <StatusPill variant="amber">ATENÇÃO</StatusPill>
              </AlertRightSlot>
            }
          />
          <AlertItem
            severity="warn"
            title="Corrente abaixo do nominal — M-15"
            detail="38.2A · Nominal: 45A · Queda de 15%"
            time="06:30"
            right={
              <AlertRightSlot>
                <AlertTime>06:30</AlertTime>
                <StatusPill variant="amber">ATENÇÃO</StatusPill>
              </AlertRightSlot>
            }
          />
        </Card>

        <Card>
          <CardHeader title="Histórico Recente" />
          <AlertItem severity="ok" title="Temperatura normalizada — M-03" detail="Temperatura voltou a 72°C após ajuste de ventilação" time="06:12 ontem" />
          <AlertItem severity="info" title="Manutenção preventiva concluída — M-21" detail="Lubrificação geral e inspeção elétrica" time="22:00 ontem" />
          <AlertItem severity="ok" title="M-09 retornou a operação normal" detail="Após troca de correia" time="15:30 ontem" />
        </Card>
      </ContentStack>
    </PageWrapper>
  );
}

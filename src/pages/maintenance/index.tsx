import { useNavigation } from "../../context/NavigationContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { MaintItem } from "../../components/ui/MaintItem";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useManutencao } from "../../hooks/useManutencao";
import { TIPO_LABEL } from "../../utils/constants/maintenance";
import { diasRestantes, progressoEstimado } from "../../utils/formatters";
import { PageWrapper, Stack, KpiGrid, TwoCol, OsHeader, OsTitle, OsSub, OsActions } from "./Maintenance.styles";

export function MaintenanceScreen() {
  const { goTo } = useNavigation();
  const { manutencoes, loading, error, urgentes, programadas, concluidas } = useManutencao();

  const abertas   = manutencoes.filter(m => !m.completed_at);
  const urgente   = abertas.find(m => new Date(m.scheduled_at) <= new Date());

  return (
    <PageWrapper>
      <PageHeader
        title="Manutenção Preditiva"
        sub="Plano baseado em dados reais"
        right={<Button variant="primary">+ Nova OS</Button>}
      />

      <Stack>
        <KpiGrid>
          <MetricCard label="OS Urgentes"       value={String(urgentes)}   sub="Ação imediata"    variant="red"   />
          <MetricCard label="Programadas"        value={String(programadas)} sub="Próximos 15 dias" variant="amber" />
          <MetricCard label="Concluídas (mês)"  value={String(concluidas)}                         variant="green" />
          <MetricCard label="Total"              value={String(manutencoes.length)}                 variant="blue"  />
        </KpiGrid>

        {loading && <Spinner />}
        {error   && <p style={{ color: "var(--red)" }}>{error}</p>}

        <TwoCol>
          {urgente && (
            <Card>
              <CardHeader
                title="Ordem de Serviço — Urgente"
                right={<StatusPill variant="red" animated>Aberta</StatusPill>}
              />
              <CardBody>
                <OsHeader>
                  <div>
                    <OsTitle>OS #{String(urgente.id).padStart(7, "0")}</OsTitle>
                    <OsSub>Máquina #{urgente.machine_id} · {TIPO_LABEL[urgente.type]}</OsSub>
                  </div>
                  <StatusPill variant="red">Urgente</StatusPill>
                </OsHeader>
                {urgente.notes && (
                  <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 8 }}>{urgente.notes}</p>
                )}
                <OsActions>
                  <Button variant="primary">Aceitar OS</Button>
                  <Button variant="purple" onClick={() => goTo("diagnosis")}>Ver diagnóstico</Button>
                </OsActions>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Plano de Manutenção" />
            {abertas.slice(0, 8).map(m => (
              <MaintItem
                key={m.id}
                name={`Máquina #${m.machine_id} — ${TIPO_LABEL[m.type]}`}
                detail={m.notes ?? TIPO_LABEL[m.type]}
                due={diasRestantes(m.scheduled_at)}
                progress={progressoEstimado(m.scheduled_at)}
                color={
                  new Date(m.scheduled_at) <= new Date() ? "var(--red)"
                  : progressoEstimado(m.scheduled_at) > 60 ? "var(--amber)"
                  : "var(--green)"
                }
              />
            ))}
            {!loading && abertas.length === 0 && (
              <p style={{ color: "var(--text3)", padding: 16 }}>Nenhuma manutenção agendada.</p>
            )}
          </Card>
        </TwoCol>
      </Stack>
    </PageWrapper>
  );
}

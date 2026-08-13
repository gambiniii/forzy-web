import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { useNavigation } from "../../context/NavigationContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { AlertItem } from "../../components/ui/AlertItem";
import { MaintItem } from "../../components/ui/MaintItem";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions } from "../../components/charts/chartHelpers";
import { useMaquinas } from "../../hooks/useMaquinas";
import { useAlertas } from "../../hooks/useAlertas";
import { useManutencao } from "../../hooks/useManutencao";
import { SEV_ITEM } from "../../utils/constants/severity";
import { TIPO_LABEL } from "../../utils/constants/maintenance";
import { fmtTime, diasRestantes } from "../../utils/formatters";
import { PageWrapper, Stack, KpiGrid, ChartsGrid, BottomGrid, ChartPad, ChartBox } from "./Dashboard.styles";
import { tempData, vibData } from "./Dashboard.types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export function DashboardScreen() {
  const { goTo } = useNavigation();
  const { maquinas } = useMaquinas();
  const { alertas, criticos, atencao } = useAlertas();
  const { manutencoes, urgentes } = useManutencao();

  const online   = maquinas.filter(m => m.status === "active").length;
  const ativos   = alertas.filter(a => !a.resolved_at).slice(0, 3);
  const proximas = manutencoes.filter(m => !m.completed_at).slice(0, 3);

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" sub="Visão geral · Atualizado agora" />

      <Stack>
        <KpiGrid>
          <MetricCard
            label="Máquinas Online"
            value={String(online)}
            unit={`/ ${maquinas.length}`}
            sub={`${maquinas.length - online} inativas`}
            variant="amber"
            gaugePercent={maquinas.length ? Math.round(online / maquinas.length * 100) : 0}
          />
          <MetricCard label="Em Alerta"      value={String(atencao)}  unit="máquinas" variant="amber" gaugePercent={33} />
          <MetricCard label="Falhas Críticas" value={String(criticos)} unit="crítica"  variant="red"   gaugePercent={criticos > 0 ? 15 : 0} />
          <MetricCard label="OS Urgentes"    value={String(urgentes)}               variant="blue"  gaugePercent={50} />
        </KpiGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="Temperatura — Linha 3" right={<StatusPill variant="purple" animated>LIVE</StatusPill>} />
            <ChartPad>
              <ChartBox><Line data={tempData} options={baseOptions(60, 95) as any} /></ChartBox>
            </ChartPad>
          </Card>
          <Card>
            <CardHeader title="Vibração — Monitoramento" right={<StatusPill variant="purple">ALERTA</StatusPill>} />
            <ChartPad>
              <ChartBox><Line data={vibData} options={baseOptions(0, 12) as any} /></ChartBox>
            </ChartPad>
          </Card>
        </ChartsGrid>

        <BottomGrid>
          <Card>
            <CardHeader
              title="Últimos Alertas"
              right={<Button onClick={() => goTo("alerts")} style={{ fontSize: 10, padding: "4px 10px" }}>Ver todos</Button>}
            />
            {ativos.length === 0 && (
              <p style={{ color: "var(--text3)", padding: 16, fontSize: 13 }}>Nenhum alerta ativo.</p>
            )}
            {ativos.map(a => (
              <AlertItem
                key={a.id}
                severity={SEV_ITEM[a.severity] ?? "info"}
                title={a.message}
                detail={a.anomaly_score != null ? `Score: ${a.anomaly_score.toFixed(2)}` : ""}
                time={fmtTime(a.created_at)}
                onClick={() => goTo("alerts")}
              />
            ))}
          </Card>

          <Card>
            <CardHeader
              title="Manutenção Prevista"
              right={<Button onClick={() => goTo("maintenance")} style={{ fontSize: 10, padding: "4px 10px" }}>Ver plano</Button>}
            />
            {proximas.length === 0 && (
              <p style={{ color: "var(--text3)", padding: 16, fontSize: 13 }}>Nenhuma manutenção agendada.</p>
            )}
            {proximas.map(m => (
              <MaintItem
                key={m.id}
                name={`Máquina #${m.machine_id} — ${TIPO_LABEL[m.type]}`}
                detail={m.notes ?? ""}
                due={diasRestantes(m.scheduled_at)}
                progress={50}
                color="var(--amber)"
              />
            ))}
          </Card>
        </BottomGrid>
      </Stack>
    </PageWrapper>
  );
}

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { HealthRing } from "../../components/ui/HealthRing";
import { ProbaRow } from "../../components/ui/ProbaRow";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions } from "../../components/charts/chartHelpers";
import { PageWrapper, Stack, MachinesGrid, ProbaList, ChartPad } from "./Health.styles";
import { machines, healthData } from "./Health.types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export function HealthScreen() {
  return (
    <PageWrapper>
      <PageHeader title="Status / Saúde do Maquinário" sub="Visão consolidada — Planta A" />

      <Stack>
        <MachinesGrid>
          {machines.map((m) => (
            <Card key={m.name}>
              <CardHeader title={m.name} right={<StatusPill variant={m.status}>{m.statusLabel}</StatusPill>} />
              <HealthRing percent={m.health} color={m.color} />
              <ProbaList>
                {m.probas.map((p) => (
                  <ProbaRow key={p.label} label={p.label} percent={p.percent} color={p.color} />
                ))}
              </ProbaList>
            </Card>
          ))}
        </MachinesGrid>

        <Card>
          <CardHeader title="Linha do Tempo de Saúde — M-07" />
          <ChartPad>
            <Line data={healthData} options={baseOptions(50, 100) as any} />
          </ChartPad>
        </Card>
      </Stack>
    </PageWrapper>
  );
}

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions, CO } from "../../components/charts/chartHelpers";
import {
  PageWrapper, Stack, HeaderActions, KpiGrid, KpiCard, KpiValue, KpiLabel, KpiTrend,
  ChartsGrid, ChartPad, DoughnutWrapper, DoughnutInner,
  RankTable, RankTh, RankTd,
} from "./Reports.styles";
import { kpis, oeeByLine, pieData, oeeHist, failureRanking } from "./Reports.types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

export function ReportsScreen() {
  return (
    <PageWrapper>
      <PageHeader
        title="Relatórios / Indicadores"
        sub="Planta A · Abril 2025"
        right={
          <HeaderActions>
            <Select style={{ width: 140, fontSize: 12, padding: "6px 10px" }}>
              <option>Abril 2025</option>
              <option>Março 2025</option>
            </Select>
            <Button variant="primary">Exportar PDF</Button>
          </HeaderActions>
        }
      />

      <Stack>
        <KpiGrid>
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label}>
              <KpiValue $color={kpi.color}>{kpi.num}</KpiValue>
              <KpiLabel>{kpi.label}</KpiLabel>
              <KpiTrend $color={kpi.trendColor}>{kpi.trend}</KpiTrend>
            </KpiCard>
          ))}
        </KpiGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="OEE por Linha — Abril" />
            <ChartPad $height={150}>
              <Bar data={oeeByLine} options={{ ...baseOptions(60, 100) as any, indexAxis: "y" } as any} />
            </ChartPad>
          </Card>
          <Card>
            <CardHeader title="Alertas por Categoria" />
            <DoughnutWrapper>
              <DoughnutInner>
                <Doughnut data={pieData} options={{
                  responsive: true, maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right", labels: { color: CO.text, font: { size: 10 }, boxWidth: 10 } },
                    tooltip: { backgroundColor: "#171b26", bodyColor: "#e2e4ee", padding: 8 },
                  },
                }} />
              </DoughnutInner>
            </DoughnutWrapper>
          </Card>
        </ChartsGrid>

        <Card>
          <CardHeader title="Histórico de OEE — 12 meses" />
          <ChartPad $height={140}><Bar data={oeeHist} options={baseOptions(60, 100) as any} /></ChartPad>
        </Card>

        <Card>
          <CardHeader title="Ranking de Falhas — Top Equipamentos" />
          <RankTable>
            <thead>
              <tr>{["Equipamento","Falhas","Horas Parado","Custo Est.","OEE"].map((h) => <RankTh key={h}>{h}</RankTh>)}</tr>
            </thead>
            <tbody>
              {failureRanking.map((row) => (
                <tr key={row.id}>
                  <RankTd><strong style={{ color: "var(--text1)", fontWeight: 500 }}>{row.id}</strong></RankTd>
                  <RankTd $mono $color={row.failures > 2 ? CO.red : row.failures > 0 ? CO.amber : "var(--text2)"}>{row.failures}</RankTd>
                  <RankTd $mono>{row.hours}</RankTd>
                  <RankTd $mono>{row.cost}</RankTd>
                  <RankTd><StatusPill variant={row.oee}>{row.oeePct}</StatusPill></RankTd>
                </tr>
              ))}
            </tbody>
          </RankTable>
        </Card>
      </Stack>
    </PageWrapper>
  );
}

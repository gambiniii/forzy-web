import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useNavigation } from "../../context/NavigationContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { AiBubble, AiHighlight } from "../../components/ui/AiBubble";
import { SpecRow } from "../../components/ui/SpecRow";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions, CO, randomData, lineDataset } from "../../components/charts/chartHelpers";
import { PageWrapper, Stack, KpiGrid, ChartsGrid, ChartPad, ActionRow } from "./ComponentAnalysis.styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const freqs      = Array.from({ length: 20 }, (_, i) => `${(i + 1) * 10}Hz`);
const fftValues  = randomData(20, 0.5, 0.8).map((v, i) => i === 13 ? 8.4 : v);
const fftData    = {
  labels: freqs,
  datasets: [{ label: "mm/s", data: fftValues, backgroundColor: fftValues.map((v) => v > 5 ? CO.red + "cc" : CO.blue + "88"), borderRadius: 2 }],
};
const days = Array.from({ length: 14 }, (_, i) => `${i + 1}/04`);
const degradationData = {
  labels: days,
  datasets: [lineDataset(Array.from({ length: 14 }, (_, i) => +(3 + i * 0.4 + Math.random() * 0.3).toFixed(1)), CO.red, "mm/s")],
};

export function ComponentAnalysisScreen() {
  const { goTo } = useNavigation();

  return (
    <PageWrapper>
      <PageHeader title="Análise por Componente" sub="M-07 · Rolamento Dianteiro DE · 6205 2Z C3" />

      <Stack>
        <KpiGrid>
          <MetricCard label="Saúde"          value="35"   unit="%"    variant="red"   gaugePercent={35}  />
          <MetricCard label="Vibração"        value="8,4"  unit="mm/s" variant="red"   gaugePercent={100} />
          <MetricCard label="Pico Espectral"  value="142"  unit="Hz"   sub="BPFO detectado" variant="amber" />
          <MetricCard label="Vida Estimada"   value="48"   unit="h"    sub="Troca urgente"  variant="blue"  />
        </KpiGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="Espectro de Vibração (FFT)" />
            <ChartPad>
              <Bar data={fftData} options={{ ...baseOptions(0, 10) as any, plugins: { ...(baseOptions() as any).plugins, legend: { display: false } } }} />
            </ChartPad>
          </Card>
          <Card>
            <CardHeader title="Tendência de Degradação" />
            <ChartPad>
              <Line data={degradationData} options={baseOptions(0, 12) as any} />
            </ChartPad>
          </Card>
        </ChartsGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="Parâmetros de Referência" />
            <CardBody>
              <SpecRow label="Modelo"               value="6205 2Z C3" />
              <SpecRow label="Diâmetro interno"     value="25 mm" />
              <SpecRow label="Diâmetro externo"     value="52 mm" />
              <SpecRow label="Largura"              value="15 mm" />
              <SpecRow label="Vib limite ISO 10816" value="7.0 mm/s" />
              <SpecRow label="BPFO calculado"       value="141.8 Hz @ 1760 RPM" />
              <SpecRow label="Última lubrificação"  value="2024-11-10" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Recomendações" />
            <CardBody style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AiBubble title="IA — Alta prioridade" style={{ margin: 0 }}>
                Substituir rolamento DE em até <AiHighlight>48 horas</AiHighlight>. Risco de falha
                catastrófica detectado pela assinatura BPFO em <AiHighlight>142 Hz</AiHighlight>.
              </AiBubble>
              <ActionRow>
                <Button variant="danger" onClick={() => goTo("maintenance")}>Abrir OS Urgente</Button>
                <Button variant="purple" onClick={() => goTo("diagnosis")}>Ver Diagnóstico</Button>
                <Button>Exportar Relatório</Button>
              </ActionRow>
            </CardBody>
          </Card>
        </ChartsGrid>
      </Stack>
    </PageWrapper>
  );
}

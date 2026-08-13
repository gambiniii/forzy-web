import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions, CO, makeLabels, randomData, lineDataset } from "../../components/charts/chartHelpers";
import { PageWrapper, Stack, KpiGrid, ChartsGrid, ChartPad, FilterRow, FilterBtn } from "./Realtime.styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const TIME_FILTERS = ["1h", "6h", "24h"];

function TimeFilters() {
  const [active, setActive] = useState("6h");
  return (
    <FilterRow>
      {TIME_FILTERS.map((t) => (
        <FilterBtn key={t} $active={active === t} onClick={() => setActive(t)}>{t}</FilterBtn>
      ))}
    </FilterRow>
  );
}

export function RealtimeScreen() {
  const labels    = makeLabels(20);
  const tempData  = { labels, datasets: [lineDataset(randomData(20, 74, 6),  CO.green,  "°C")]   };
  const vibData   = { labels, datasets: [lineDataset(randomData(20, 8.2, 1), CO.amber,  "mm/s")] };
  const currData  = { labels, datasets: [lineDataset(randomData(20, 42, 3),  CO.blue,   "A")]    };
  const powData   = { labels, datasets: [lineDataset(randomData(20, 1.3, 0.2), CO.purple, "kW")] };

  return (
    <PageWrapper>
      <PageHeader
        title="Monitoramento em Tempo Real"
        sub="M-07 · Motor Siemens 1LE0022 · Linha 3"
        right={<StatusPill variant="green" animated>Transmitindo</StatusPill>}
      />

      <Stack>
        <KpiGrid>
          <MetricCard label="Temperatura" value="74,3" unit="°C"    sub="↓ Limite: 90°C"        variant="green" gaugePercent={82}  />
          <MetricCard label="Vibração"    value="8,4"  unit="mm/s"  sub="↑ Limite: 7.0 mm/s"    variant="amber" gaugePercent={100} />
          <MetricCard label="Corrente"    value="42,1" unit="A"     sub="— Nominal: 45A"         variant="blue"  gaugePercent={63}  />
          <MetricCard label="Rotação"     value="1.760" unit="rpm"  sub="— Setpoint: 1.800"      variant="green" gaugePercent={97}  />
        </KpiGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="Temperatura" right={<TimeFilters />} />
            <ChartPad $height={150}><Line data={tempData} options={baseOptions(60, 95) as any} /></ChartPad>
          </Card>
          <Card>
            <CardHeader title="Vibração" right={<TimeFilters />} />
            <ChartPad $height={150}><Line data={vibData} options={baseOptions(0, 12) as any} /></ChartPad>
          </Card>
        </ChartsGrid>

        <ChartsGrid>
          <Card>
            <CardHeader title="Corrente" />
            <ChartPad $height={120}><Line data={currData} options={baseOptions(30, 60) as any} /></ChartPad>
          </Card>
          <Card>
            <CardHeader title="Potência" />
            <ChartPad $height={120}><Line data={powData} options={baseOptions(0.8, 1.8) as any} /></ChartPad>
          </Card>
        </ChartsGrid>
      </Stack>
    </PageWrapper>
  );
}

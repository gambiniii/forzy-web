import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { baseOptions, CO, randomData, lineDataset } from "../../components/charts/chartHelpers";
import { PageWrapper, Stack, HeaderActions, ChartPad, LogTable, TableHead, TableCell } from "./History.styles";
import { logEvents } from "./History.types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const days = Array.from({ length: 30 }, (_, i) => `${i + 1}/03`);
const tempHist = { labels: days, datasets: [lineDataset(randomData(30, 72, 10), CO.green, "°C")]   };
const vibHist  = { labels: days, datasets: [lineDataset(randomData(30, 5.5, 3), CO.amber, "mm/s")] };

export function HistoryScreen() {
  return (
    <PageWrapper>
      <PageHeader
        title="Histórico / Dados Retroativos"
        sub="M-07 · Últimos 30 dias"
        right={
          <HeaderActions>
            <Input type="date" style={{ width: 150 }} />
            <Input type="date" style={{ width: 150 }} />
            <Button variant="primary">Exportar CSV</Button>
          </HeaderActions>
        }
      />

      <Stack>
        <Card>
          <CardHeader title="Temperatura histórica — 30 dias" />
          <ChartPad><Line data={tempHist} options={baseOptions(50, 100) as any} /></ChartPad>
        </Card>

        <Card>
          <CardHeader title="Vibração histórica — 30 dias" />
          <ChartPad><Line data={vibHist} options={baseOptions(0, 12) as any} /></ChartPad>
        </Card>

        <Card>
          <CardHeader title="Log de Eventos" />
          <LogTable>
            <thead>
              <tr>
                {["Data/Hora", "Tipo", "Parâmetro", "Valor", "Status"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {logEvents.map((ev, i) => (
                <tr key={i}>
                  <TableCell $mono>{ev.date}</TableCell>
                  <TableCell><strong style={{ color: "var(--text1)", fontWeight: 500 }}>{ev.type}</strong></TableCell>
                  <TableCell>{ev.param}</TableCell>
                  <TableCell $mono $color={ev.valColor}>{ev.val}</TableCell>
                  <TableCell><StatusPill variant={ev.status}>{ev.statusLabel}</StatusPill></TableCell>
                </tr>
              ))}
            </tbody>
          </LogTable>
        </Card>
      </Stack>
    </PageWrapper>
  );
}

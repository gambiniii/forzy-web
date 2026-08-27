import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input/Input";
import { Card, CardHeader } from "../../components/ui/Card";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useMaquinas } from "../../hooks/useMaquinas";
import { usePlanta } from "../../hooks/usePlantas";
import {
  PageWrapper,
  HeaderActions,
  FilterBar,
  FilterButton,
  MachineRow,
  MachineIcon,
  MachineInfo,
  MachineName,
  MachineMeta,
  MetricsGroup,
  MetricCell,
  MetricValue,
  MetricLabel,
} from "./Machinery.styles";

const GearIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" width="18" height="18">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9 3v2M9 13v2M3 9h2M13 9h2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const STATUS_VARIANT: Record<string, "green" | "amber" | "red"> = {
  active: "green",
  maintenance: "amber",
  inactive: "red",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Online",
  maintenance: "Manutenção",
  inactive: "Inativo",
};

export function MachineryScreen() {
  const { goTo } = useNavigation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plantaIdParam = searchParams.get("planta_id");
  const plantaId = plantaIdParam ? Number(plantaIdParam) : null;

  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const { maquinas, loading } = useMaquinas();
  const { planta } = usePlanta(plantaId ?? 0);

  const maquinasDaPlanta = plantaId
    ? maquinas.filter((m) => m.planta_id === plantaId)
    : maquinas;

  const filtered = maquinasDaPlanta.filter((m) => {
    const matchSearch =
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      (m.tipo ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const online = maquinasDaPlanta.filter((m) => m.status === "active").length;
  const alerta = maquinasDaPlanta.filter(
    (m) => m.status === "maintenance",
  ).length;

  const title = planta ? planta.nome : "Maquinário";
  const sub = loading
    ? "Carregando..."
    : `${maquinasDaPlanta.length} equipamento${maquinasDaPlanta.length !== 1 ? "s" : ""} · ${online} online · ${alerta} em atenção`;

  return (
    <PageWrapper>
      <PageHeader
        title={title}
        sub={sub}
        right={
          <HeaderActions>
            <Input
              placeholder="Buscar equipamento..."
              style={{ width: 200 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="primary" onClick={() => navigate(`/machinery/equipment-form${plantaId ? `?planta_id=${plantaId}` : ""}`)}>
              + Cadastrar
            </Button>
          </HeaderActions>
        }
      />

      <Card>
        <CardHeader
          title=""
          right={
            <div style={{ display: "flex", gap: 6 }}>
              <StatusPill variant="green" animated>
                {online} online
              </StatusPill>
              <StatusPill variant="amber">{alerta} atenção</StatusPill>
            </div>
          }
        />

        <FilterBar>
          {["Todos", "active", "maintenance", "inactive"].map((f) => (
            <FilterButton
              key={f}
              $active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f === "Todos" ? "Todos" : STATUS_LABEL[f]}
            </FilterButton>
          ))}
        </FilterBar>

        {loading && <Spinner />}

        {filtered.map((m) => (
          <MachineRow key={m.id} onClick={() => goTo("machine-detail", m.id)}>
            <MachineIcon>
              <GearIcon />
            </MachineIcon>
            <MachineInfo>
              <MachineName>{m.nome}</MachineName>
              <MachineMeta>
                {[m.tipo, m.fabricante].filter(Boolean).join(" · ")}
                {m.ano_instalacao ? ` · ${m.ano_instalacao}` : ""}
              </MachineMeta>
            </MachineInfo>
            <MetricsGroup>
              <MetricCell>
                <MetricValue $color="var(--text2)">—</MetricValue>
                <MetricLabel>Temp</MetricLabel>
              </MetricCell>
              <MetricCell>
                <MetricValue $color="var(--text2)">—</MetricValue>
                <MetricLabel>Vib</MetricLabel>
              </MetricCell>
              <MetricCell>
                <MetricValue $color="var(--text2)">—</MetricValue>
                <MetricLabel>Corr</MetricLabel>
              </MetricCell>
            </MetricsGroup>
            <StatusPill
              variant={STATUS_VARIANT[m.status] ?? "green"}
              animated={m.status === "active"}
            >
              {STATUS_LABEL[m.status] ?? m.status}
            </StatusPill>
          </MachineRow>
        ))}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "var(--text3)",
            }}
          >
            <svg
              viewBox="0 0 48 48"
              fill="none"
              width="48"
              height="48"
              style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}
            >
              <circle
                cx="24"
                cy="24"
                r="16"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M24 8v4M24 36v4M8 24h4M36 24h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p style={{ fontSize: 14, margin: 0 }}>
              Nenhuma máquina encontrada
            </p>
            <p style={{ fontSize: 12, marginTop: 4 }}>
              {plantaId
                ? "Esta planta ainda não tem máquinas cadastradas"
                : 'Clique em "+ Cadastrar" para adicionar'}
            </p>
          </div>
        )}
      </Card>
    </PageWrapper>
  );
}

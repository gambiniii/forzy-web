import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { usePlantas } from "../../hooks/usePlantas";
import { usePlantStats } from "../../hooks/usePlantStats";
import type { MotorSummary } from "../../hooks/usePlantStats";
import { PlantaModal } from "../../components/plantas/PlantaModal";
import type { Planta } from "../../services/plantas.service";
import {
  PageWrapper, PlantsGrid, PlantCard, PlantCardHeader, GridOverlay,
  PlantName, HeaderBadge, PlantBody, PlantLocation,
  PlantKpiRow, PlantKpi, PlantKpiValue, PlantKpiLabel,
  PlantInfoStrip, PlantIsoBadge, PlantLastReading,
  MotorsToggle, MotorsToggleChevron,
  MotorsList, MotorRow, MotorDot, MotorName, MotorHealthBar, MotorHealthPct,
} from "./Plants.styles";

/* ── Helpers ────────────────────────────────────────────────────────── */

const ISO_META: Record<string, { color: string; label: string }> = {
  A:    { color: "var(--success)", label: "ISO Zona A" },
  B:    { color: "#ffb833",        label: "ISO Zona B" },
  C:    { color: "#ff7a1a",        label: "ISO Zona C" },
  D:    { color: "var(--red)",     label: "ISO Zona D" },
  low:  { color: "var(--success)", label: "Risco Baixo" },
  medium: { color: "#ffb833",      label: "Risco Médio" },
  high:   { color: "var(--red)",   label: "Risco Alto" },
};

function isoMeta(zone: string | null) {
  if (!zone) return null;
  return ISO_META[zone] ?? { color: "var(--text3)", label: zone };
}

function healthColor(pct: number): string {
  if (pct >= 75) return "var(--success)";
  if (pct >= 50) return "#ffb833";
  return "var(--red)";
}

function timeAgo(ts: string): string {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "agora";
    if (min < 60) return `${min}min atrás`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h atrás`;
    return `${Math.floor(h / 24)}d atrás`;
  } catch { return "—"; }
}

function machinesColor(motors: MotorSummary[]): string {
  if (motors.some((m) => m.status === "inactive")) return "var(--red)";
  if (motors.some((m) => m.status === "maintenance")) return "#ffb833";
  return "var(--success)";
}

/* ── Enriched card ──────────────────────────────────────────────────── */

function PlantCardContent({ planta, onClick }: { planta: Planta; onClick: () => void }) {
  const { stats, loading } = usePlantStats(planta.id);
  const [motorsOpen, setMotorsOpen] = useState(false);

  const location = [planta.cidade, planta.estado].filter(Boolean).join(", ")
    || planta.localizacao || "—";

  const iso = isoMeta(stats?.isoZone ?? null);
  const activeMotors = stats?.motors.filter((m) => m.status === "active").length ?? 0;
  const totalMotors  = stats?.motors.length ?? 0;
  const alertCount   = stats?.totalAlerts ?? 0;
  const avgHealth    = stats?.avgHealth ?? null;

  return (
    <PlantCard onClick={onClick}>
      <PlantCardHeader>
        <GridOverlay />
        <PlantName>{planta.nome}</PlantName>
        <HeaderBadge $active={planta.ativo}>
          {planta.ativo ? "Ativa" : "Inativa"}
        </HeaderBadge>
      </PlantCardHeader>

      <PlantBody>
        {/* Location */}
        <PlantLocation>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </PlantLocation>

        {/* KPI tiles */}
        <PlantKpiRow>
          <PlantKpi>
            <PlantKpiValue $color={loading ? "var(--text3)" : machinesColor(stats?.motors ?? [])}>
              {loading ? "—" : totalMotors === 0 ? "0" : `${activeMotors}/${totalMotors}`}
            </PlantKpiValue>
            <PlantKpiLabel>Máquinas</PlantKpiLabel>
          </PlantKpi>

          <PlantKpi $alert={alertCount > 0}>
            <PlantKpiValue $color={
              loading ? "var(--text3)" :
              alertCount === 0 ? "var(--success)" :
              alertCount <= 2 ? "#ffb833" : "var(--red)"
            }>
              {loading ? "—" : alertCount}
            </PlantKpiValue>
            <PlantKpiLabel>Alertas</PlantKpiLabel>
          </PlantKpi>

          <PlantKpi>
            <PlantKpiValue $color={
              loading || avgHealth === null ? "var(--text3)" : healthColor(avgHealth)
            }>
              {loading ? "—" : avgHealth !== null ? `${avgHealth.toFixed(0)}%` : "—"}
            </PlantKpiValue>
            <PlantKpiLabel>Saúde</PlantKpiLabel>
          </PlantKpi>
        </PlantKpiRow>

        {/* ISO zone + last reading */}
        {!loading && (iso || stats?.lastReadingAt) && (
          <PlantInfoStrip>
            {iso
              ? <PlantIsoBadge $color={iso.color}>{iso.label}</PlantIsoBadge>
              : <span />
            }
            {stats?.lastReadingAt
              ? <PlantLastReading>Última leitura: {timeAgo(stats.lastReadingAt)}</PlantLastReading>
              : null
            }
          </PlantInfoStrip>
        )}

        {/* Motors list — accordion, fechado por padrão pra não poluir o card */}
        {!loading && (stats?.motors.length ?? 0) > 0 && (
          <>
            <MotorsToggle
              type="button"
              onClick={(e) => { e.stopPropagation(); setMotorsOpen((v) => !v); }}
            >
              <span>Máquinas ({stats!.motors.length})</span>
              <MotorsToggleChevron $open={motorsOpen} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </MotorsToggleChevron>
            </MotorsToggle>
            {motorsOpen && (
              <MotorsList>
                {stats!.motors.map((m) => (
                  <MotorRow key={m.id}>
                    <MotorDot $status={m.status} />
                    <MotorName title={m.nome}>{m.nome}{m.tipo ? ` · ${m.tipo}` : ""}</MotorName>
                    {m.health !== null && (
                      <>
                        <MotorHealthBar $pct={m.health} $color={healthColor(m.health)} />
                        <MotorHealthPct $color={healthColor(m.health)}>
                          {m.health.toFixed(0)}%
                        </MotorHealthPct>
                      </>
                    )}
                  </MotorRow>
                ))}
              </MotorsList>
            )}
          </>
        )}
      </PlantBody>
    </PlantCard>
  );
}

/* ── Screen ─────────────────────────────────────────────────────────── */

export function PlantsScreen() {
  const navigate = useNavigate();
  const { plantas, loading, error, reload } = usePlantas();
  const [modalOpen, setModalOpen] = useState(false);

  function handlePlantaClick(plantaId: number) {
    navigate(`/machinery?planta_id=${plantaId}`);
  }

  if (loading) return (
    <PageWrapper>
      <PageHeader title="Gestão de Plantas" sub="Carregando..." right={null} />
      <Spinner />
    </PageWrapper>
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Gestão de Plantas"
        sub={`${plantas.length} planta${plantas.length !== 1 ? "s" : ""} cadastrada${plantas.length !== 1 ? "s" : ""}`}
        right={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Nova Planta</Button>}
      />

      {error && <p style={{ color: "var(--red)", padding: "16px 0" }}>{error}</p>}

      <PlantaModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={reload} />

      {plantas.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 64, gap: 12, color: "var(--text3)" }}>
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <rect x="6" y="18" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 18V12a8 8 0 0 1 16 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="31" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: 13 }}>Nenhuma planta cadastrada</span>
          <Button variant="primary" onClick={() => setModalOpen(true)}>+ Nova Planta</Button>
        </div>
      ) : (
        <PlantsGrid>
          {plantas.map((planta) => (
            <PlantCardContent
              key={planta.id}
              planta={planta}
              onClick={() => handlePlantaClick(planta.id)}
            />
          ))}
        </PlantsGrid>
      )}
    </PageWrapper>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { usePlantas } from "../../hooks/usePlantas";
import { PlantaModal } from "../../components/plantas/PlantaModal";
import {
  PageWrapper, PlantsGrid, PlantCard, PlantCardHeader, GridOverlay,
  PlantName, PlantBody, PlantLocation, StatsRow, Stat, StatValue, StatLabel, PillRow,
} from "./Plants.styles";

export function PlantsScreen() {
  const navigate = useNavigate();
  const { plantas, loading, error, reload } = usePlantas();
  const [modalOpen, setModalOpen] = useState(false);

  function handlePlantaClick(plantaId: number) {
    navigate(`/machinery?planta_id=${plantaId}`);
  }


  return (
    <PageWrapper>
      <PageHeader
        title="Gestão de Plantas"
        sub={loading ? "Carregando..." : `${plantas.length} planta${plantas.length !== 1 ? "s" : ""} cadastrada${plantas.length !== 1 ? "s" : ""}`}
        right={<Button variant="primary" onClick={() => setModalOpen(true)}>+ Nova Planta</Button>}
      />

      {loading && <Spinner />}
      {error && <p style={{ color: "var(--red)", padding: 16 }}>{error}</p>}

      <PlantaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />

      {!loading && !error && plantas.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48" style={{ margin: "0 auto 12px", display: "block", opacity: 0.4 }}>
            <path d="M8 40V18L24 8l16 10v22" stroke="currentColor" strokeWidth="2" />
            <path d="M17 40V28h14v12" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p style={{ fontSize: 14, margin: 0 }}>Nenhuma planta cadastrada</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Clique em "+ Nova Planta" para começar</p>
        </div>
      )}

      <PlantsGrid>
        {plantas.map((planta) => {
          const location = [planta.cidade, planta.estado].filter(Boolean).join(", ") || planta.localizacao || "—";

          return (
            <PlantCard key={planta.id} onClick={() => handlePlantaClick(planta.id)}>
              <PlantCardHeader>
                <GridOverlay />
                <PlantName>{planta.nome}</PlantName>
              </PlantCardHeader>

              <PlantBody>
                <PlantLocation>📍 {location}</PlantLocation>
                <StatsRow>
                  <Stat>
                    <StatValue $color="var(--blue)">—</StatValue>
                    <StatLabel>Máquinas</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue $color="var(--text3)">—</StatValue>
                    <StatLabel>Alertas</StatLabel>
                  </Stat>
                  <Stat>
                    <StatValue $color="var(--text3)">—</StatValue>
                    <StatLabel>OEE</StatLabel>
                  </Stat>
                </StatsRow>
                <PillRow>
                  {planta.ativo
                    ? <StatusPill variant="green" animated>Ativa</StatusPill>
                    : <StatusPill variant="red">Inativa</StatusPill>
                  }
                </PillRow>
              </PlantBody>
            </PlantCard>
          );
        })}
      </PlantsGrid>
    </PageWrapper>
  );
}

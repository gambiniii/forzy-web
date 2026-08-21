import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from "chart.js";
import { useNavigation } from "../../context/NavigationContext";
import { Spinner } from "../../components/ui/Spinner";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { SpecRow } from "../../components/ui/SpecRow";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusPill } from "../../components/ui/StatusPill";
import { LoadModel } from "../../func/load-model.func";
import { useMachineDetail } from "./useMachineDetail";
import { SensorCharts } from "./SensorCharts";
import { MlDiagnostic } from "./MlDiagnostic";
import { AnomaliaHistorico } from "./AnomaliaHistorico";
import {
  PageWrapper, HeaderActions, ContentGrid,
  ModelCard, ModelCardRight, ModelViewerWrapper, GridOverlay,
  ModelFallbackWrapper, ModelFallbackLabel, ModelHints, HintText, ModelTag,
  SpecsCard, KpiGrid, ChartsArea,
  AnomaliaStatusCard, AnomaliaHistoricoCard,
} from "./MachineDetail.styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const STATUS_LABEL: Record<string, string> = {
  active: "Online",
  maintenance: "Manutenção",
  inactive: "Inativo",
};

// ── Modelo 3D ────────────────────────────────────────────────────────────────

type Tooltip3D = { name: string; x: number; y: number } | null;

function ModelViewer() {
  const [tooltip, setTooltip] = useState<Tooltip3D>(null);

  const handleHover = (name: string | null, x: number, y: number) => {
    setTooltip(name ? { name, x, y } : null);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#38b6ff" />
        <pointLight position={[0, -2, 0]} intensity={0.3} color="#ffa300" />
        <Suspense fallback={null}>
          <LoadModel position={[0, 0, 0]} onHover={handleHover} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom autoRotateSpeed={1.2} />
      </Canvas>
      {tooltip && (
        <div style={{
          position: "fixed", top: tooltip.y + 14, left: tooltip.x + 14,
          background: "rgba(15,23,42,0.92)", border: "1px solid #22c55e",
          color: "#22c55e", fontSize: 12, fontFamily: "var(--mono,monospace)",
          padding: "4px 10px", borderRadius: 4, pointerEvents: "none",
          zIndex: 9999, whiteSpace: "nowrap",
        }}>
          {tooltip.name}
        </div>
      )}
    </div>
  );
}

function ModelFallback() {
  return (
    <ModelFallbackWrapper>
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="7"  stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M24 6v5M24 37v5M6 24h5M37 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M10.5 37.5l3.5-3.5M34 14l3.5-3.5"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        />
      </svg>
      <ModelFallbackLabel>Carregando modelo 3D...</ModelFallbackLabel>
    </ModelFallbackWrapper>
  );
}

// ── Especificações por componente ─────────────────────────────────────────────

function ComponenteSpecs({ componentes, valoresPorComponente }: {
  componentes: ReturnType<typeof useMachineDetail>["componentes"];
  valoresPorComponente: ReturnType<typeof useMachineDetail>["valoresPorComponente"];
}) {
  if (componentes.length === 0) {
    return <p style={{ color: "var(--text3)", padding: 16, fontSize: 13 }}>Sem componentes cadastrados.</p>;
  }

  return (
    <>
      {componentes.map((comp) => {
        const valores = valoresPorComponente[comp.id] ?? [];
        return (
          <div key={comp.id}>
            <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text3)", textTransform: "uppercase" }}>
              {comp.nome}
              {comp.tipo && <span style={{ fontWeight: 400, marginLeft: 6 }}>· {comp.tipo}</span>}
            </div>
            {valores.map((v) => {
              const val = v.valor_string ?? (v.valor_float !== null ? String(v.valor_float) : null) ?? (v.valor_int !== null ? String(v.valor_int) : "—");
              const label = v.atributo?.nome ?? `Atributo ${v.atributo_id}`;
              const unit  = v.atributo?.unidade ?? "";
              return <SpecRow key={v.id} label={label} value={unit ? `${val} ${unit}` : val} />;
            })}
          </div>
        );
      })}
    </>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────

const CARD_STYLE = { flex: 1, display: "flex", flexDirection: "column" as const, minHeight: 0 };

export function MachineDetailScreen() {
  const { goTo } = useNavigation();
  const { id }   = useParams<{ id: string }>();

  const {
    maquina, componentes, valoresPorComponente,
    anomalias, loading, error,
    leituras, online, prediction,
  } = useMachineDetail(id);

  if (loading) return <Spinner />;
  if (error)   return <p style={{ color: "var(--red)", padding: 24 }}>{error}</p>;
  if (!maquina) return null;

  return (
    <PageWrapper>
      <PageHeader
        title={maquina.nome}
        sub={maquina.fabricante ?? ""}
        right={
          <HeaderActions>
            <Button onClick={() => goTo("equipment-form", maquina.id)}>Editar</Button>
          </HeaderActions>
        }
      />

      <ContentGrid>

        {/* Col 1 — Identificação */}
        <ModelCard>
          <Card style={CARD_STYLE}>
            <CardHeader title="Identificação" />
            <CardBody>
              <SpecRow label="ID"          value={String(maquina.id)} />
              <SpecRow label="Nome"        value={maquina.nome} />
              <SpecRow label="Tipo"        value={maquina.tipo ?? "—"} />
              <SpecRow label="Fabricante"  value={maquina.fabricante ?? "—"} />
              <SpecRow label="Instalação"  value={maquina.ano_instalacao ? String(maquina.ano_instalacao) : "—"} />
              <SpecRow label="Status"      value={STATUS_LABEL[maquina.status] ?? maquina.status} />
            </CardBody>
          </Card>
        </ModelCard>

        {/* Col 2 — Modelo 3D */}
        <ModelCardRight>
          <Card style={CARD_STYLE}>
            <CardHeader title="Modelo 3D" />
            <ModelViewerWrapper>
              <GridOverlay />
              <Suspense fallback={<ModelFallback />}>
                <ModelViewer />
              </Suspense>
            </ModelViewerWrapper>
            <ModelHints>
              <HintText>↻ Arrastar para girar</HintText>
              <HintText>⊕ Scroll para zoom</HintText>
              <ModelTag>{maquina.tipo ?? "modelo"}</ModelTag>
            </ModelHints>
          </Card>
        </ModelCardRight>

        {/* Col 1 — Especificações técnicas */}
        <SpecsCard>
          <Card style={CARD_STYLE}>
            <CardHeader title="Especificações Técnicas" />
            <div style={{ overflowY: "auto", flex: 1 }}>
              <ComponenteSpecs componentes={componentes} valoresPorComponente={valoresPorComponente} />
            </div>
          </Card>
        </SpecsCard>

        {/* Col 2 — Gráficos de sensor */}
        <KpiGrid>
          <Card style={CARD_STYLE}>
            <CardHeader
              title="Medições"
              right={
                online
                  ? <StatusPill variant="green" animated>ONLINE</StatusPill>
                  : <StatusPill variant="red">OFFLINE</StatusPill>
              }
            />
            <ChartsArea>
              <SensorCharts leituras={leituras} />
            </ChartsArea>
          </Card>
        </KpiGrid>

        {/* Col 3 — Diagnóstico ML */}
        <AnomaliaStatusCard>
          <Card style={CARD_STYLE}>
            <CardHeader title="Diagnóstico ML" />
            <CardBody>
              {prediction
                ? <MlDiagnostic prediction={prediction} />
                : <p style={{ fontSize: 12, color: "var(--text3)", padding: "8px 0" }}>Aguardando inferência ML...</p>
              }
            </CardBody>
          </Card>
        </AnomaliaStatusCard>

        {/* Col 3 — Histórico de diagnósticos */}
        <AnomaliaHistoricoCard>
          <Card style={CARD_STYLE}>
            <CardHeader title="Histórico de Diagnósticos" />
            <AnomaliaHistorico anomalias={anomalias} />
          </Card>
        </AnomaliaHistoricoCard>

      </ContentGrid>

    </PageWrapper>
  );
}

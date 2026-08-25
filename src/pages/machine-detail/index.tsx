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
import { LoadModel } from "../../func/load-model.func";
import { useMachineDetail } from "./useMachineDetail";
import { SensorCharts } from "./SensorCharts";
import { MlDiagnostic } from "./MlDiagnostic";
import { HealthTrend } from "./HealthTrend";
import { DiagnosticoSummary } from "./DiagnosticoSummary";
import { AnomaliaHistorico } from "./AnomaliaHistorico";
import { EventTimeline } from "./EventTimeline";
import { MachineHero } from "./MachineHero";
import {
  PageWrapper, DashboardGrid, SidebarCol, MainCol, HistoryCol, SidebarModelBox,
  ModelViewerWrapper, GridOverlay,
  ModelFallbackWrapper, ModelFallbackLabel, ModelHints, HintText, ModelTag,
  TabBar, TabBtn,
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

const CARD_FILL  = { flex: 1, display: "flex", flexDirection: "column" as const, minHeight: 0 };
const CARD_AUTO  = { display: "flex", flexDirection: "column" as const, flexShrink: 0 };

type HistTab = "diagnosticos" | "eventos";

export function MachineDetailScreen() {
  const { goTo } = useNavigation();
  const { id }   = useParams<{ id: string }>();
  const [histTab, setHistTab] = useState<HistTab>("diagnosticos");

  const {
    maquina, componentes, valoresPorComponente,
    anomalias, loading, error,
    leituras, online, prediction,
    componenteId, motorId,
  } = useMachineDetail(id);

  if (loading) return <Spinner />;
  if (error)   return <p style={{ color: "var(--red)", padding: 24 }}>{error}</p>;
  if (!maquina) return null;

  const lastLeituraTimestamp = leituras[leituras.length - 1]?.timestamp;

  return (
    <PageWrapper>
      <MachineHero
        title={maquina.nome}
        sub={maquina.fabricante ?? ""}
        action={<Button onClick={() => goTo("equipment-form", maquina.id)}>Editar</Button>}
        online={online}
        lastLeituraTimestamp={lastLeituraTimestamp}
        prediction={prediction}
        anomalias={anomalias}
      />

      <DashboardGrid>

        {/* Sidebar — identidade fixa do motor */}
        <SidebarCol>
          <Card style={CARD_AUTO}>
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

          <Card style={{ ...CARD_AUTO }}>
            <CardHeader title="Modelo 3D" />
            <SidebarModelBox>
              <ModelViewerWrapper>
                <GridOverlay />
                <Suspense fallback={<ModelFallback />}>
                  <ModelViewer />
                </Suspense>
              </ModelViewerWrapper>
              <ModelHints>
                <HintText>↻ Girar</HintText>
                <ModelTag>{maquina.tipo ?? "modelo"}</ModelTag>
              </ModelHints>
            </SidebarModelBox>
          </Card>

          <Card style={CARD_AUTO}>
            <CardHeader title="Especificações Técnicas" />
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              <ComponenteSpecs componentes={componentes} valoresPorComponente={valoresPorComponente} />
            </div>
          </Card>
        </SidebarCol>

        {/* Coluna central — medições ao vivo */}
        <MainCol>
          <Card style={CARD_FILL}>
            <CardHeader title="Medições" />
            <SensorCharts leituras={leituras} componenteId={componenteId} />
          </Card>
        </MainCol>

        {/* Coluna direita — diagnóstico, tendência e histórico */}
        <HistoryCol>
          <Card style={CARD_AUTO}>
            <CardHeader title="Diagnóstico ML" />
            {prediction
              ? <MlDiagnostic prediction={prediction} />
              : (
                <div style={{ padding: "24px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "var(--text3)" }}>Aguardando inferência ML...</p>
                </div>
              )
            }
          </Card>

          {anomalias.length > 0 && (
            <Card style={CARD_AUTO}>
              <CardHeader title="Tendência de Saúde" />
              <HealthTrend anomalias={anomalias} />
              <DiagnosticoSummary anomalias={anomalias} />
            </Card>
          )}

          <Card style={CARD_FILL}>
            <TabBar>
              <TabBtn $active={histTab === "diagnosticos"} onClick={() => setHistTab("diagnosticos")}>
                Diagnósticos
              </TabBtn>
              <TabBtn $active={histTab === "eventos"} onClick={() => setHistTab("eventos")}>
                Timeline de Eventos
              </TabBtn>
            </TabBar>
            {histTab === "diagnosticos"
              ? <AnomaliaHistorico anomalias={anomalias} />
              : <EventTimeline motorId={motorId} anomalias={anomalias} />
            }
          </Card>
        </HistoryCol>

      </DashboardGrid>

    </PageWrapper>
  );
}

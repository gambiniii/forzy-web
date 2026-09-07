import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip,
} from "chart.js";
import { useNavigation } from "../../context/NavigationContext";
import { Spinner } from "../../components/ui/Spinner";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LoadModel, type HighlightInfo } from "../../func/load-model.func";
import { useMachineDetail } from "./useMachineDetail";
import { SensorCharts } from "./SensorCharts";
import { MachineHero } from "./MachineHero";
import { IdentificacaoModal } from "./IdentificacaoModal";
import { EspecificacoesModal } from "./EspecificacoesModal";
import { buildHighlightMap, buildSegmentTooltip, combinarHighlight } from "./diagnosticoUtils";
import { SegmentTooltip } from "./SegmentTooltip";
import { useAtribuicao } from "./useAtribuicao";
import { MOTOR_SEGMENT_MAP } from "../../config/motorSegmentMap";
import type { Anomalia } from "../../services/anomalias.service";
import type { Atribuicao } from "../../services/atribuicao.service";
import {
  PageWrapper, StageGrid, ModelStageBox, MeasurementsBox,
  ModelViewerWrapper, GridOverlay,
  ModelFallbackWrapper, ModelFallbackLabel, ModelHints, HintText, ModelTag,
} from "./MachineDetail.styles";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const CARD_FILL = { flex: 1, display: "flex", flexDirection: "column" as const, minHeight: 0 };

// ── Modelo 3D ────────────────────────────────────────────────────────────────

type Tooltip3D = { segment: string; x: number; y: number } | null;

interface ModelViewerProps {
  highlightMap: Record<string, HighlightInfo>;
  prediction: Anomalia | null;
  nomeMaquina: string;
  onExplicar: (pergunta: string) => void;
  atribuicao: Atribuicao | null;
}

function ModelViewer({ highlightMap, prediction, nomeMaquina, onExplicar, atribuicao }: ModelViewerProps) {
  const [tooltip, setTooltip] = useState<Tooltip3D>(null);
  // O card precisa sobreviver ao trajeto do mouse entre a peça e o botão dentro
  // dele. Sem esse atraso, sair do mesh fecharia o card antes de alcançá-lo.
  const fecharTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelarFechamento = () => {
    if (fecharTimer.current) {
      clearTimeout(fecharTimer.current);
      fecharTimer.current = null;
    }
  };

  const handleHover = (name: string | null, x: number, y: number) => {
    if (name) {
      cancelarFechamento();
      setTooltip({ segment: name, x, y });
    } else {
      cancelarFechamento();
      fecharTimer.current = setTimeout(() => setTooltip(null), 260);
    }
  };

  useEffect(() => cancelarFechamento, []);

  const tooltipData = useMemo(
    () => (tooltip
      ? buildSegmentTooltip(tooltip.segment, highlightMap[tooltip.segment], prediction, nomeMaquina, atribuicao)
      : null),
    [tooltip, highlightMap, prediction, nomeMaquina, atribuicao]
  );

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
          <LoadModel position={[0, 0, 0]} onHover={handleHover} highlightMap={highlightMap} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom autoRotateSpeed={1.2} />
      </Canvas>
      {tooltip && tooltipData && (
        <SegmentTooltip
          data={tooltipData}
          x={tooltip.x}
          y={tooltip.y}
          onExplicar={onExplicar}
          onMouseEnter={cancelarFechamento}
          onMouseLeave={() => setTooltip(null)}
        />
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

// ── Tela principal ────────────────────────────────────────────────────────────

export function MachineDetailScreen() {
  const { goTo } = useNavigation();
  const navigate = useNavigate();
  const { id }   = useParams<{ id: string }>();
  const [identificacaoOpen, setIdentificacaoOpen] = useState(false);
  const [especificacoesOpen, setEspecificacoesOpen] = useState(false);

  const {
    maquina, componentes, valoresPorComponente,
    anomalias, loading, error,
    leituras, online, prediction,
    componenteId, motorId,
  } = useMachineDetail(id);

  const { atribuicao } = useAtribuicao(componenteId ?? null);

  const highlightMap = useMemo(
    () => combinarHighlight(buildHighlightMap(prediction, MOTOR_SEGMENT_MAP), atribuicao),
    [prediction, atribuicao]
  );

  /* Leva a pergunta pronta ao assistente. `goTo` do NavigationContext não
   * repassa `state`, então navegamos direto aqui. O assistente lê o prefill de
   * `location.state` e já dispara a mensagem. */
  const explicarComAgente = (pergunta: string) => {
    navigate("/machinery/assistant", {
      state: { prefill: pergunta, machineId: componenteId ? String(componenteId) : undefined },
    });
  };

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
        secondaryActions={
          <>
            <Button onClick={() => setIdentificacaoOpen(true)}>Identificação</Button>
            <Button onClick={() => setEspecificacoesOpen(true)}>Especificações</Button>
          </>
        }
        online={online}
        lastLeituraTimestamp={lastLeituraTimestamp}
        prediction={prediction}
        anomalias={anomalias}
        componenteId={componenteId}
        motorId={motorId}
      />

      {identificacaoOpen && (
        <IdentificacaoModal
          maquina={maquina}
          open={identificacaoOpen}
          onClose={() => setIdentificacaoOpen(false)}
        />
      )}

      {especificacoesOpen && (
        <EspecificacoesModal
          componentes={componentes}
          valoresPorComponente={valoresPorComponente}
          open={especificacoesOpen}
          onClose={() => setEspecificacoesOpen(false)}
        />
      )}

      <StageGrid>
        <Card style={CARD_FILL}>
          <CardHeader title="Modelo 3D" right={<ModelTag>{maquina.tipo ?? "modelo"}</ModelTag>} />
          <ModelStageBox style={{ flex: 1 }}>
            <ModelViewerWrapper>
              <GridOverlay />
              <Suspense fallback={<ModelFallback />}>
                <ModelViewer
                  highlightMap={highlightMap}
                  prediction={prediction}
                  nomeMaquina={maquina.nome}
                  onExplicar={explicarComAgente}
                  atribuicao={atribuicao}
                />
              </Suspense>
            </ModelViewerWrapper>
            <ModelHints>
              <HintText>↻ Girar · passe o mouse sobre uma peça para identificá-la</HintText>
            </ModelHints>
          </ModelStageBox>
        </Card>

        <Card style={CARD_FILL}>
          <CardHeader title="Medições" />
          <MeasurementsBox style={{ flex: 1 }}>
            <SensorCharts leituras={leituras} componenteId={componenteId} />
          </MeasurementsBox>
        </Card>
      </StageGrid>
    </PageWrapper>
  );
}

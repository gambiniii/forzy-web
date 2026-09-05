import { useState } from "react";
import { Modal } from "../../components/ui/Modal/Modal";
import { MlDiagnostic } from "./MlDiagnostic";
import { HealthTrend } from "./HealthTrend";
import { DiagnosticoSummary } from "./DiagnosticoSummary";
import { AnomaliaHistorico } from "./AnomaliaHistorico";
import { EventTimeline } from "./EventTimeline";
import { TabBar, TabBtn } from "./MachineDetail.styles";
import type { Anomalia } from "../../services/anomalias.service";

type HistTab = "diagnosticos" | "eventos";

interface Props {
  open: boolean;
  onClose: () => void;
  prediction: Anomalia | null;
  anomalias: Anomalia[];
  motorId: number;
}

/** Consolida diagnóstico ML, tendência de saúde e histórico (diagnósticos +
 * timeline de eventos) — antes espalhados em 3 cards fixos na coluna direita,
 * agora acessíveis sob demanda pelo sino de alertas no Hero. */
export function DiagnosticoHistoricoModal({ open, onClose, prediction, anomalias, motorId }: Props) {
  const [histTab, setHistTab] = useState<HistTab>("diagnosticos");

  return (
    <Modal open={open} onClose={onClose} title="Diagnóstico & Histórico" size="xl" padded={false}>
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "72vh" }}>
        <div style={{ borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          {prediction ? (
            <MlDiagnostic prediction={prediction} />
          ) : (
            <div style={{ padding: "24px 16px", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text3)" }}>Aguardando inferência ML...</p>
            </div>
          )}
        </div>

        {anomalias.length > 0 && (
          <div style={{ borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ padding: "10px 16px 0", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text3)", textTransform: "uppercase" }}>
              Tendência de Saúde
            </div>
            <HealthTrend anomalias={anomalias} />
            <DiagnosticoSummary anomalias={anomalias} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 320 }}>
          <TabBar>
            <TabBtn $active={histTab === "diagnosticos"} onClick={() => setHistTab("diagnosticos")}>
              Diagnósticos
            </TabBtn>
            <TabBtn $active={histTab === "eventos"} onClick={() => setHistTab("eventos")}>
              Timeline de Eventos
            </TabBtn>
          </TabBar>
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {histTab === "diagnosticos"
              ? <AnomaliaHistorico anomalias={anomalias} />
              : <EventTimeline motorId={motorId} anomalias={anomalias} />
            }
          </div>
        </div>
      </div>
    </Modal>
  );
}

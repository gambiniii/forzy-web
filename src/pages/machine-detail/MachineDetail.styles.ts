import styled, { css } from "styled-components";

export const PageWrapper = styled.div`
  padding: 16px 20px;
  height: calc(100vh - var(--topbar-h));
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  flex: 1;
  min-height: 0;
`;

/* Identificação — linha 1, coluna 1 */
export const ModelCard = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/* Modelo 3D — linha 1, coluna 2 */
export const ModelCardRight = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/* Coluna 3, linha 1 — Status ML / Anomalia atual */
export const AnomaliaStatusCard = styled.div`
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/* Coluna 3, linha 2 — Histórico de anomalias */
export const AnomaliaHistoricoCard = styled.div`
  grid-column: 3;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;

  &:hover {
    background: var(--bg3);
  }
`;

export const AccordionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text3);
`;

export const AccordionBody = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "400px" : "0")};
  transition: max-height 0.25s ease;
  border-bottom: ${({ $open }) => ($open ? "1px solid var(--border)" : "none")};
`;

export const ChartsArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 16px;
  overflow-y: auto;
  min-height: 0;
`;

export const ChartBox = styled.div`
  height: 130px;
  position: relative;
`;

export const ModelViewerWrapper = styled.div`
  flex: 1;
  position: relative;
  background: radial-gradient(ellipse at center, #1a1f30 0%, #0a0c10 100%);
  min-height: 0;

  [data-theme="light"] & {
    background: radial-gradient(ellipse at center, #dde3ee 0%, #eaedf1 100%);
  }
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 163, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 163, 0, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 1;

  [data-theme="light"] & {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px);
  }
`;

export const ModelFallbackWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text3);
`;

export const ModelFallbackLabel = styled.span`
  font-size: 11px;
  letter-spacing: 0.05em;
`;

export const ModelHints = styled.div`
  padding: 6px 14px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
`;

export const HintText = styled.span`
  font-size: 10px;
  color: var(--text3);
`;

export const ModelTag = styled.span`
  margin-left: auto;
  font-family: var(--mono);
  font-size: 9px;
  color: var(--green);
  background: var(--green-d);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 229, 160, 0.2);
`;

/* Especificações — linha 2, coluna 1 */
export const SpecsCard = styled.div`
  grid-column: 1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

export const AlertBanner = styled.div<{ $status: "warning" | "critical" }>`
  padding: 10px 16px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  ${({ $status }) => $status === "critical" ? css`
    border: 1px solid #ff4f6a;
    background: #3a1520;
    [data-theme="light"] & {
      background: #fff0f2;
      border-color: #e0284a;
    }
  ` : css`
    border: 1px solid #ffb833;
    background: #2e2000;
    [data-theme="light"] & {
      background: #fff8e6;
      border-color: #c87800;
    }
  `}
`;

export const AlertIcon = styled.span<{ $status: "warning" | "critical" }>`
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 1px;
  ${({ $status }) => $status === "critical" ? css`
    color: #ff4f6a;
    [data-theme="light"] & { color: #e0284a; }
  ` : css`
    color: #ffb833;
    [data-theme="light"] & { color: #c87800; }
  `}
`;

export const AlertBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AlertTitle = styled.div<{ $status: "warning" | "critical" }>`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
  ${({ $status }) => $status === "critical" ? css`
    color: #ff4f6a;
    [data-theme="light"] & { color: #e0284a; }
  ` : css`
    color: #ffb833;
    [data-theme="light"] & { color: #c87800; }
  `}
`;

export const AlertText = styled.div`
  font-size: 11px;
  color: var(--text1);
  line-height: 1.4;

  [data-theme="light"] & { color: #2a2218; }
`;

export const AlertMeta = styled.div`
  font-size: 10px;
  color: var(--text2);
  margin-top: 4px;
  font-family: var(--mono);

  [data-theme="light"] & { color: #5a4a30; }
`;

/* Gráficos / dashboard — linha 2, coluna 2 */
export const KpiGrid = styled.div`
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const AnomaliaTable = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

type DiagStatus = "healthy" | "warning" | "critical" | "motor_desligado";

function statusColor(s: DiagStatus) {
  if (s === "critical") return "var(--red)";
  if (s === "warning") return "var(--amber)";
  if (s === "healthy") return "var(--success)";
  return "var(--text3)";
}

export const AnomaliaRow = styled.div<{ $status: DiagStatus }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--border);
  border-left: 2px solid ${({ $status }) => statusColor($status)};

  &:hover { background: var(--bg3); }
`;

export const AnomaliaRowMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const AnomaliaRowLabel = styled.span<{ $status: DiagStatus }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $status }) => statusColor($status ?? "motor_desligado")};
`;

export const AnomaliaRowMeta = styled.span`
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AnomaliaRowTime = styled.span`
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  white-space: nowrap;
  align-self: flex-start;
  padding-top: 1px;
`;

export const EmptyAnomalias = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text3);
  font-size: 12px;
`;

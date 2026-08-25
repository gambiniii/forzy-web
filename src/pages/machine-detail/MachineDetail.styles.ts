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

/* ── Hero: identidade + narrativa do estado atual ─────────────────────── */

export const HeroBar = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px 18px;
  flex-shrink: 0;
`;

export const HeroTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

export const HeroTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: var(--text1);
  line-height: 1.25;
`;

export const HeroSub = styled.p`
  font-size: 12px;
  color: var(--text2);
  margin-top: 2px;
`;

export const HeroDivider = styled.div`
  border-top: 1px solid var(--border);
  margin: 10px 0;
  width: 100%;
`;

export const HeroBody = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`;

export const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 260px;
`;

export const HeroStatusLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text3);
`;

export const HeroNarrative = styled.p`
  font-size: 13px;
  color: var(--text1);
  line-height: 1.5;
  max-width: 62ch;
`;

export const HeroChips = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

/* ── Grid principal: sidebar | medições | diagnóstico e histórico ────── */

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 340px;
  gap: 12px;
  flex: 1;
  min-height: 0;

  @media (max-width: 1200px) {
    grid-template-columns: 260px 1fr 300px;
  }
`;

export const SidebarCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow-y: auto;
`;

export const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

export const HistoryCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
`;

export const SidebarModelBox = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
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

/* ── ML Gauge ────────────────────────────────────────────────────────── */

export const GaugeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 16px 0;
  flex-shrink: 0;
`;

export const IsoZoneBadge = styled.div<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}22;
  border: 1px solid ${({ $color }) => $color}44;
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
  letter-spacing: 0.04em;
`;

export const KpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding: 0 12px 10px;
  width: 100%;
`;

export const KpiTile = styled.div`
  background: var(--bg0);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 7px 6px 6px;
  min-width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

export const KpiValue = styled.span<{ $color?: string }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color ?? "var(--text1)"};
  font-family: var(--mono);
  line-height: 1;
`;

export const KpiLabel = styled.span`
  font-size: 8.5px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  line-height: 1.2;
`;

export const RecommendationBox = styled.div`
  margin: 0 12px 12px;
  padding: 8px 10px;
  background: var(--bg0);
  border: 1px solid var(--border);
  border-left: 3px solid var(--purple);
  border-radius: var(--radius);
  font-size: 11px;
  color: var(--text2);
  line-height: 1.5;
  flex-shrink: 0;
`;

/* ── Resumo do período (composição de status + última anomalia) ──────── */

export const SummaryBar = styled.div`
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: var(--bg0);
`;

export const SummarySegment = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const SummaryLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
`;

export const SummaryLegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: var(--text2);
`;

export const SummaryDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const SummaryMeta = styled.div`
  margin-top: 6px;
  font-size: 10.5px;
  color: var(--text3);
  font-family: var(--mono);
`;

/* ── Estatísticas por gráfico (mín/média/pico) ───────────────────────── */

export const ChartStat = styled.span`
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  margin-left: 6px;
`;

/* ── Range selector ─────────────────────────────────────────────────── */

export const RangeBar = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 16px 4px;
  flex-shrink: 0;
`;

export const RangeBtn = styled.button<{ $active: boolean }>`
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid ${({ $active }) => ($active ? "var(--purple)" : "var(--border-md)")};
  background: ${({ $active }) => ($active ? "var(--purple-d)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--purple)" : "var(--text3)")};
  font-size: 10.5px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s, color 0.15s;

  &:hover { border-color: var(--purple); color: var(--purple); }
`;

/* ── Tabs (Diagnósticos / Eventos) ─────────────────────────────────── */

export const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  padding: 7px 16px;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? "var(--text1)" : "var(--text3)")};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? "var(--purple)" : "transparent")};
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  font-family: inherit;
  margin-bottom: -1px;

  &:hover { color: var(--text1); }
`;

/* ── Event Timeline ─────────────────────────────────────────────────── */

export const TimelineList = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 4px 0 8px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border-md); border-radius: 2px; }
`;

export const TimelineGroupLabel = styled.div`
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 16px 4px;
`;

export const TimelineItem = styled.div<{ $color: string }>`
  display: flex;
  gap: 8px;
  padding: 5px 16px 5px 12px;
  border-left: 2px solid ${({ $color }) => $color};
  margin-left: 16px;
  margin-bottom: 1px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: -5px;
    top: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    flex-shrink: 0;
  }
`;

export const TimelineContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TimelineTag = styled.span<{ $color: string }>`
  font-size: 9px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}22;
  border-radius: 4px;
  padding: 1px 6px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const TimelineTitle = styled.div`
  font-size: 11.5px;
  color: var(--text1);
  margin: 2px 0 1px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimelineTime = styled.div`
  font-size: 9.5px;
  color: var(--text3);
  font-family: var(--mono);
`;

export const TimelineEmpty = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text3);
  font-size: 12px;
  padding: 24px;
`;

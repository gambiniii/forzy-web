import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); }`;

export const PageWrapper = styled.div`
  padding: 28px 32px;
  animation: ${fadeIn} 0.2s ease;
`;

export const PlantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
`;

export const PlantCard = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: var(--border-md);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

/* ── Header ─────────────────────────────────────────────────────────── */

export const PlantCardHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #141820 0%, #1a1f30 100%);
  position: relative;
  overflow: hidden;

  [data-theme="light"] & {
    background: linear-gradient(135deg, #dde3ee 0%, #eaedf1 100%);
  }
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 163, 0, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(116, 33, 235, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;

  [data-theme="light"] & {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  }
`;

export const PlantName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  position: relative;
  z-index: 1;
  line-height: 1;

  [data-theme="light"] & { color: var(--text1); }
`;

export const HeaderBadge = styled.div<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ $active }) => ($active ? "#00e5a0" : "#ff4f6a")};
  background: ${({ $active }) => ($active ? "rgba(0,229,160,0.12)" : "rgba(255,79,106,0.12)")};
  border: 1px solid ${({ $active }) => ($active ? "rgba(0,229,160,0.25)" : "rgba(255,79,106,0.25)")};
  border-radius: 12px;
  padding: 3px 9px;

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
    ${({ $active }) => $active && css`
      animation: pulse-dot 1.5s ease infinite;
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }
    `}
  }
`;

/* ── Body ───────────────────────────────────────────────────────────── */

export const PlantBody = styled.div`
  padding: 14px 16px 16px;
`;

export const PlantLocation = styled.div`
  font-size: 12px;
  color: var(--text2);
  display: flex;
  align-items: center;
  gap: 5px;
`;

/* ── KPI tiles ──────────────────────────────────────────────────────── */

export const PlantKpiRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 12px;
`;

export const PlantKpi = styled.div<{ $alert?: boolean }>`
  background: var(--bg0);
  border: 1px solid ${({ $alert }) => ($alert ? "rgba(255,79,106,0.28)" : "var(--border)")};
  border-radius: var(--radius);
  padding: 8px 6px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

export const PlantKpiValue = styled.div<{ $color: string }>`
  font-family: var(--mono);
  font-size: 16px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
`;

export const PlantKpiLabel = styled.div`
  font-size: 9px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  line-height: 1.2;
`;

/* ── Info strip ─────────────────────────────────────────────────────── */

export const PlantInfoStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  gap: 8px;
`;

export const PlantIsoBadge = styled.div<{ $color: string }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => $color}18;
  border: 1px solid ${({ $color }) => $color}30;
  border-radius: 12px;
  padding: 2px 10px;
  letter-spacing: 0.03em;
  white-space: nowrap;
`;

export const PlantLastReading = styled.div`
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  text-align: right;
  white-space: nowrap;
`;

/* ── Motors list ────────────────────────────────────────────────────── */

export const MotorsList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const MotorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const MotorDot = styled.div<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $status }) =>
    $status === "active" ? "var(--success)" :
    $status === "maintenance" ? "#ffb833" : "var(--text3)"};
  ${({ $status }) => $status === "active" && css`
    box-shadow: 0 0 0 2px rgba(0, 229, 160, 0.2);
  `}
`;

export const MotorName = styled.div`
  font-size: 11px;
  color: var(--text2);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MotorHealthBar = styled.div<{ $pct: number; $color: string }>`
  width: 52px;
  height: 3px;
  background: var(--border-md);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ $color }) => $color};
    border-radius: 2px;
    transition: width 0.6s ease;
  }
`;

export const MotorHealthPct = styled.div<{ $color: string }>`
  font-size: 10px;
  font-weight: 600;
  font-family: var(--mono);
  color: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;
`;

/* ── Legacy (keep for compatibility) ───────────────────────────────── */

export const StatsRow   = styled.div`display:flex;gap:16px;margin-top:12px;`;
export const Stat       = styled.div``;
export const StatValue  = styled.div<{ $color: string }>`font-family:var(--mono);font-size:20px;font-weight:600;color:${({ $color }) => $color};`;
export const StatLabel  = styled.div`font-size:11px;color:var(--text3);text-transform:uppercase;`;
export const PillRow    = styled.div`margin-top:12px;display:flex;gap:6px;flex-wrap:wrap;`;

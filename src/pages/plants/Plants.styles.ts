import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 28px 32px;
  animation: fadeIn 0.2s ease;
`;

export const PlantsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;
`;

export const PlantCard = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: var(--border-md);
    transform: translateY(-1px);
  }
`;

export const PlantCardHeader = styled.div`
  height: 96px;
  display: flex;
  align-items: flex-end;
  padding: 14px 20px;
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

  [data-theme="light"] & {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  }
`;

export const PlantName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  position: relative;

  [data-theme="light"] & {
    color: var(--text1);
  }
`;

export const PlantBody = styled.div`
  padding: 16px 20px;
`;

export const PlantLocation = styled.div`
  font-size: 13px;
  color: var(--text2);
  margin-top: 2px;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

export const Stat = styled.div``;

export const StatValue = styled.div<{ $color: string }>`
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: var(--text3);
  text-transform: uppercase;
`;

export const PillRow = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

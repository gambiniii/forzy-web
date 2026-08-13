import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px;
  animation: fadeIn 0.2s ease;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const KpiCard = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: center;
`;

export const KpiValue = styled.div<{ $color: string }>`
  font-family: var(--mono);
  font-size: 32px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const KpiLabel = styled.div`
  font-size: 11px;
  color: var(--text2);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

export const KpiTrend = styled.div<{ $color: string }>`
  font-size: 11px;
  margin-top: 8px;
  color: ${({ $color }) => $color};
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const ChartPad = styled.div<{ $height: number }>`
  padding: 12px 16px 14px;
  height: ${({ $height }) => $height}px;
`;

export const DoughnutWrapper = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
`;

export const DoughnutInner = styled.div`
  max-width: 180px;
  width: 100%;
  height: 100%;
`;

export const RankTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const RankTh = styled.th`
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text3);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
`;

export const RankTd = styled.td<{ $mono?: boolean; $color?: string }>`
  padding: 10px 12px;
  font-size: 12px;
  font-family: ${({ $mono }) => ($mono ? "var(--mono)" : "inherit")};
  color: ${({ $color }) => $color ?? "var(--text2)"};
`;

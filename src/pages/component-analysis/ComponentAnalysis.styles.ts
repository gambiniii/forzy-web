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

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const ChartPad = styled.div`
  padding: 12px 16px 14px;
  height: 160px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

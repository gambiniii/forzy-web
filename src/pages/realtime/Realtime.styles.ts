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

export const ChartPad = styled.div<{ $height: number }>`
  padding: 12px 16px 14px;
  height: ${({ $height }) => $height}px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const FilterBtn = styled.button<{ $active: boolean }>`
  font-size: 10px;
  padding: 3px 8px;
  background: ${({ $active }) => ($active ? "var(--bg4)" : "var(--bg3)")};
  color: var(--text2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: inherit;
`;

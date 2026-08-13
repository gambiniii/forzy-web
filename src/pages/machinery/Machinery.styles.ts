import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 28px 32px;
  animation: fadeIn 0.2s ease;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterBar = styled.div`
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 6px;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
  font-size: 12px;
  padding: 5px 12px;
  background: ${({ $active }) => ($active ? "var(--bg4)" : "var(--bg3)")};
  color: var(--text2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
`;

export const MachineRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  gap: 16px;
  transition: background 0.15s;

  &:hover {
    background: var(--bg3);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const MachineIcon = styled.div`
  width: 42px;
  height: 42px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text2);
`;

export const MachineInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MachineName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text1);
`;

export const MachineMeta = styled.div`
  font-size: 12px;
  color: var(--text3);
  margin-top: 2px;
`;

export const MetricsGroup = styled.div`
  display: flex;
  gap: 20px;
  font-family: var(--mono);
  font-size: 12px;
`;

export const MetricCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
`;

export const MetricValue = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-weight: 500;
`;

export const MetricLabel = styled.span`
  color: var(--text3);
  font-size: 10px;
  text-transform: uppercase;
`;

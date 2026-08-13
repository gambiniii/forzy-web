import styled from "styled-components";
import type { CompStatus } from "./Components.types";

export const PageWrapper = styled.div`
  padding: 20px;
  animation: fadeIn 0.2s ease;
`;

export const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
`;

export const ComponentCard = styled.div<{ $status: CompStatus }>`
  background: var(--bg2);
  border: ${({ $status }) =>
    ({
      green: "1px solid var(--border)",
      amber: "1px solid rgba(255,184,48,.3)",
      red: "1px solid rgba(255,79,106,.3)",
    })[$status]};
  border-radius: var(--radius-lg);
  padding: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const IconBox = styled.div`
  width: 32px;
  height: 32px;
  background: var(--bg3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text2);
`;

export const CompName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--text1);
  margin-bottom: 2px;
`;

export const CompType = styled.div`
  font-size: 10px;
  color: var(--text3);
`;

export const Divider = styled.div`
  height: 1px;
  background: var(--border);
  margin: 10px 0;
`;

export const MetricsRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const MetricCell = styled.div`
  flex: 1;
`;

export const MetricValue = styled.div<{ $color?: string }>`
  font-family: var(--mono);
  font-size: 15px;
  font-weight: 600;
  color: ${({ $color }) => $color ?? "var(--text1)"};
`;

export const MetricLabel = styled.div`
  font-size: 9px;
  color: var(--text3);
  text-transform: uppercase;
`;

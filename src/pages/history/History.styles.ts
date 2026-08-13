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
  align-items: center;
`;

export const ChartPad = styled.div`
  padding: 12px 16px 14px;
  height: 150px;
`;

export const TableHead = styled.th`
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text3);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
`;

export const TableCell = styled.td<{ $mono?: boolean; $color?: string }>`
  padding: 10px 12px;
  font-size: 12px;
  font-family: ${({ $mono }) => ($mono ? "var(--mono)" : "inherit")};
  color: ${({ $color }) => $color ?? "var(--text2)"};
`;

export const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

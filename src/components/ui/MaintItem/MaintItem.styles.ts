import styled from "styled-components";

export const ItemRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
`;

export const StatusDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const ItemBody = styled.div`
  flex: 1;
`;

export const ItemName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text1);
`;

export const ItemDetail = styled.div`
  font-size: 11px;
  color: var(--text2);
  margin-top: 2px;
`;

export const ProgressTrack = styled.div`
  height: 3px;
  background: var(--bg4);
  border-radius: 2px;
  margin-top: 6px;
`;

export const ProgressFill = styled.div<{ $color: string; $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  width: ${({ $percent }) => $percent}%;
`;

export const DueLabel = styled.span<{ $color: string; $alert: boolean }>`
  font-family: var(--mono);
  font-size: 11px;
  color: ${({ $alert, $color }) => ($alert ? $color : "var(--text3)")};
  flex-shrink: 0;
`;

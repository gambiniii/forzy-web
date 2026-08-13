import styled from "styled-components";

export const RowRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
`;

export const RowLabel = styled.span`
  font-size: 11px;
  color: var(--text2);
  width: 160px;
  flex-shrink: 0;
`;

export const BarTrack = styled.div`
  flex: 1;
  height: 4px;
  background: var(--border-md);
  border-radius: 2px;
`;

export const BarFill = styled.div<{ $color: string; $percent: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  width: ${({ $percent }) => $percent}%;
`;

export const RowPercent = styled.span`
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
  width: 36px;
  text-align: right;
`;

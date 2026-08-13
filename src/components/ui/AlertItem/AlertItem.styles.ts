import styled from "styled-components";

export const ItemRoot = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background 0.15s;

  &:hover {
    background: ${({ $clickable }) => ($clickable ? "var(--bg3)" : "transparent")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SeverityBar = styled.div<{ $color: string }>`
  width: 3px;
  border-radius: 2px;
  flex-shrink: 0;
  align-self: stretch;
  background: ${({ $color }) => $color};
`;

export const ItemBody = styled.div`
  flex: 1;
`;

export const ItemTitle = styled.div`
  font-size: 13px;
  color: var(--text1);
  font-weight: 500;
`;

export const ItemDetail = styled.div`
  font-size: 11px;
  color: var(--text2);
  margin-top: 2px;
`;

export const ItemTime = styled.span`
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
  flex-shrink: 0;
`;

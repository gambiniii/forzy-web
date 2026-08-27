import styled from "styled-components";

export const RowRoot = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
`;

export const RowLabel = styled.span`
  width: 140px;
  flex-shrink: 0;
  color: var(--text2);
`;

export const RowValue = styled.span`
  color: var(--text1);
  font-family: var(--mono);
  font-size: 11px;
`;

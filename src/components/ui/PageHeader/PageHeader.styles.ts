import styled from "styled-components";

export const HeaderRoot = styled.div<{ $hasRight: boolean }>`
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: ${({ $hasRight }) => ($hasRight ? "space-between" : "flex-start")};
`;

export const HeaderLeft = styled.div``;

export const HeaderTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: var(--text1);
  margin-bottom: 4px;
`;

export const HeaderSub = styled.p`
  font-size: 13px;
  color: var(--text2);
`;

import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px;
  animation: fadeIn 0.2s ease;
`;

export const ContentStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const AlertRightSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

export const AlertTime = styled.span`
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
`;

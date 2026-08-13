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

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const OsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const OsTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text1);
`;

export const OsSub = styled.div`
  font-size: 12px;
  color: var(--text2);
  margin-top: 2px;
`;

export const OsActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 14px;
`;

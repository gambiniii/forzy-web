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

export const MachinesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
`;

export const ProbaList = styled.div`
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
`;

export const ChartPad = styled.div`
  padding: 12px 16px 14px;
  height: 130px;
`;

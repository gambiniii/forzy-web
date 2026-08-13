import styled from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px;
  animation: fadeIn 0.2s ease;
  margin: 0 auto;
`;

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
`;

export const FieldGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols ?? 2}, 1fr);
  gap: 12px;
`;

export const FormActions = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--border);
`;

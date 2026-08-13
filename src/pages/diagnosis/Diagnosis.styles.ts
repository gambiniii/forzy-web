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

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const TimelinePad = styled.div`
  padding: 14px 16px;
`;

export const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const TimelineDotCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TimelineDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 3px;
`;

export const TimelineConnector = styled.div`
  width: 1px;
  background: var(--border);
  flex: 1;
  margin: 4px 0;
  min-height: 20px;
`;

export const TimelineBody = styled.div`
  flex: 1;
  padding-bottom: 16px;
`;

export const TimelineTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--text1);
`;

export const TimelineSub = styled.div`
  font-size: 11px;
  color: var(--text2);
  margin-top: 2px;
`;

export const TimelineTime = styled.div`
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
  margin-top: 2px;
`;

export const ActionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const ActionTh = styled.th`
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text3);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
`;

export const ActionTd = styled.td<{ $mono?: boolean }>`
  padding: 10px 12px;
  font-size: 12px;
  font-family: ${({ $mono }) => ($mono ? "var(--mono)" : "inherit")};
  color: var(--text2);
`;

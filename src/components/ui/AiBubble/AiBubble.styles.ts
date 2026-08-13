import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
`;

export const BubbleRoot = styled.div`
  background: var(--purple-d);
  border: 1px solid rgba(180, 142, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  margin-bottom: 12px;
`;

export const BubbleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const PulseRing = styled.div`
  width: 20px;
  height: 20px;
  background: var(--purple-d);
  border: 1px solid var(--purple);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--purple);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

export const BubbleTitle = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

export const BubbleConfidence = styled.span`
  margin-left: auto;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text3);
`;

export const BubbleContent = styled.div`
  font-size: 13px;
  color: var(--text1);
  line-height: 1.7;
`;

export const HighlightSpan = styled.span`
  color: var(--amber);
  font-family: var(--mono);
  font-size: 12px;
`;

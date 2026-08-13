import styled from "styled-components";

export const CardRoot = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
`;

export const ColorBar = styled.div<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: ${({ $color }) => $color};
`;

export const CardLabel = styled.div`
  font-size: 10px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
`;

export const CardValue = styled.div<{ $color: string }>`
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
  color: ${({ $color }) => $color};
`;

export const CardUnit = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: var(--text2);
  margin-left: 2px;
`;

export const CardSub = styled.div`
  font-size: 10px;
  color: var(--text3);
  margin-top: 5px;
`;

export const GaugeTrack = styled.div`
  height: 3px;
  background: var(--bg4);
  border-radius: 2px;
  margin-top: 8px;
`;

export const GaugeFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.8s ease;
`;

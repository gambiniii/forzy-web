import styled from "styled-components";

export const RingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const RingContainer = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
`;

export const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;

export const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const RingValue = styled.span<{ $color: string }>`
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const RingSubLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text3);
`;

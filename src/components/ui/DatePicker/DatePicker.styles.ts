import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const TriggerButton = styled.button<{ $hasError?: boolean }>`
  width: 100%;
  background: var(--bg3);
  border: 1px solid ${({ $hasError }) => ($hasError ? "var(--red)" : "var(--border)")};
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text1);
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--border-hi);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const TriggerValue = styled.span<{ $placeholder?: boolean }>`
  color: ${({ $placeholder }) => ($placeholder ? "var(--text3)" : "var(--text1)")};
`;

export const TriggerIcon = styled.span`
  color: var(--text3);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const Popover = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  background: var(--bg2);
  border: 1px solid var(--border-md);
  border-radius: var(--radius-lg);
  padding: 12px;
  min-width: 260px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--bg3);
    color: var(--text1);
  }
`;

export const MonthLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text1);
`;

export const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
`;

export const WeekDay = styled.span`
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 0;
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const DayCell = styled.button<{
  $today?: boolean;
  $selected?: boolean;
  $outside?: boolean;
  $inRange?: boolean;
  $rangeStart?: boolean;
  $rangeEnd?: boolean;
}>`
  aspect-ratio: 1;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--mono);
  cursor: pointer;
  color: var(--text2);
  transition: background 0.1s, color 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg3);
    color: var(--text1);
  }

  ${({ $outside }) =>
    $outside &&
    css`
      color: var(--text3);
      opacity: 0.4;
    `}

  ${({ $today }) =>
    $today &&
    css`
      color: var(--green);
      font-weight: 600;
    `}

  ${({ $inRange }) =>
    $inRange &&
    css`
      background: var(--green-d);
      border-radius: 0;
      color: var(--text1);
    `}

  ${({ $selected, $rangeStart, $rangeEnd }) =>
    ($selected || $rangeStart || $rangeEnd) &&
    css`
      background: var(--green) !important;
      color: #000 !important;
      font-weight: 600;
      border-radius: 6px;
    `}

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
    &:hover { background: none; }
  }
`;

export const ErrorText = styled.span`
  font-size: 11px;
  color: var(--red);
  margin-top: 4px;
  display: block;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const FieldLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text2);
`;

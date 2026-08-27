import styled, { css } from "styled-components";

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Label = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text2);
`;

export const HintText = styled.span`
  font-size: 11px;
  color: var(--text3);
`;

export const ErrorText = styled.span`
  font-size: 11px;
  color: var(--red);
`;

const fieldBase = css`
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text1);
  font-family: inherit;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;

  &::placeholder {
    color: var(--text3);
  }

  &:focus {
    border-color: var(--purple);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  ${fieldBase}
  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: var(--red);
      &:focus {
        border-color: var(--red);
      }
    `}
`;

export const StyledSelect = styled.select<{ $hasError?: boolean }>`
  ${fieldBase}
  cursor: pointer;
  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: var(--red);
    `}
`;

export const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  ${fieldBase}
  resize: vertical;
  ${({ $hasError }) =>
    $hasError &&
    css`
      border-color: var(--red);
    `}
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconSlot = styled.span<{ $side: "left" | "right" }>`
  position: absolute;
  ${({ $side }) => ($side === "left" ? "left: 10px" : "right: 10px")};
  display: flex;
  align-items: center;
  color: var(--text3);
  pointer-events: none;

  & + ${StyledInput},
  ${StyledInput}:has(~ &) {
    ${({ $side }) => ($side === "left" ? "padding-left: 32px" : "padding-right: 32px")};
  }
`;

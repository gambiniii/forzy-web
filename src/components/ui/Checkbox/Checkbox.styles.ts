import styled, { css } from "styled-components";

// ===== CHECKBOX =====

export const CheckboxRoot = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &:has(input:disabled) {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const CheckboxBox = styled.span<{ $checked: boolean; $indeterminate?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--border-md);
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;

  ${({ $checked, $indeterminate }) =>
    ($checked || $indeterminate) &&
    css`
      background: var(--green);
      border-color: var(--green);
    `}
`;

export const CheckMark = styled.svg`
  width: 10px;
  height: 10px;
  color: #000;
  flex-shrink: 0;
`;

export const CheckboxLabel = styled.span`
  font-size: 13px;
  color: var(--text1);
`;

// ===== TOGGLE =====

export const ToggleRoot = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  &:has(input:disabled) {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const ToggleTrack = styled.span<{ $checked: boolean; $size: "sm" | "md" }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 100px;
  transition: background 0.2s;

  ${({ $size }) =>
    $size === "sm"
      ? css`width: 28px; height: 16px;`
      : css`width: 36px; height: 20px;`}

  background: ${({ $checked }) => ($checked ? "var(--green)" : "var(--bg4)")};
`;

export const ToggleThumb = styled.span<{ $checked: boolean; $size: "sm" | "md" }>`
  position: absolute;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);

  ${({ $size }) =>
    $size === "sm"
      ? css`width: 11px; height: 11px; left: 3px;`
      : css`width: 14px; height: 14px; left: 3px;`}

  ${({ $checked, $size }) =>
    $checked &&
    css`
      transform: translateX(${$size === "sm" ? "12px" : "16px"});
    `}
`;

export const ToggleLabel = styled.span`
  font-size: 13px;
  color: var(--text1);
`;

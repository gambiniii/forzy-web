import styled, { css } from "styled-components";

type ButtonVariant = "default" | "primary" | "danger" | "purple";

const variantMap: Record<ButtonVariant, ReturnType<typeof css>> = {
  default: css`
    background: var(--bg3);
    color: var(--text2);
    border: 1px solid var(--border);
  `,
  primary: css`
    background: var(--green);
    color: #000;
    border: 1px solid var(--green);
    font-weight: 600;
  `,
  danger: css`
    background: var(--red-d);
    color: var(--red);
    border: 1px solid rgba(255, 79, 106, 0.3);
  `,
  purple: css`
    background: var(--purple-d);
    color: var(--purple);
    border: 1px solid rgba(180, 142, 255, 0.3);
  `,
};

export const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantMap[$variant]}
`;

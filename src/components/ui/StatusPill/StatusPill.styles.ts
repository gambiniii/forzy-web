import styled, { css, keyframes } from "styled-components";

type PillVariant = "green" | "amber" | "red" | "blue" | "purple";

const variantMap: Record<PillVariant, ReturnType<typeof css>> = {
  green: css`
    background: var(--success-d);
    color: var(--success);
    border: 1px solid rgba(34, 197, 94, 0.2);
  `,
  amber: css`
    background: var(--amber-d);
    color: var(--amber);
    border: 1px solid rgba(255, 184, 48, 0.2);
  `,
  red: css`
    background: var(--red-d);
    color: var(--red);
    border: 1px solid rgba(255, 79, 106, 0.2);
  `,
  blue: css`
    background: var(--blue-d);
    color: var(--blue);
    border: 1px solid rgba(56, 182, 255, 0.2);
  `,
  purple: css`
    background: var(--purple-d);
    color: var(--purple);
    border: 1px solid rgba(180, 142, 255, 0.2);
  `,
};

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
`;

export const PillWrapper = styled.span<{ $variant: PillVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
  ${({ $variant }) => variantMap[$variant]}
`;

export const PillDot = styled.span<{ $animated?: boolean }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${pulse} 1.5s infinite;
    `}
`;

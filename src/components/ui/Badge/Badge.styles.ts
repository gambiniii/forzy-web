import styled, { css } from "styled-components";

type BadgeVariant = "green" | "amber" | "red" | "blue" | "purple" | "default";
type BadgeSize = "sm" | "md";

const variantMap: Record<BadgeVariant, ReturnType<typeof css>> = {
  green: css`
    background: var(--green-d);
    color: var(--green);
    border: 1px solid rgba(255, 163, 0, 0.2);
  `,
  amber: css`
    background: var(--amber-d);
    color: var(--amber);
    border: 1px solid rgba(255, 204, 85, 0.2);
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
    border: 1px solid rgba(116, 33, 235, 0.2);
  `,
  default: css`
    background: var(--bg3);
    color: var(--text2);
    border: 1px solid var(--border);
  `,
};

export const StyledBadge = styled.span<{ $variant: BadgeVariant; $size: BadgeSize; $dot?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 4px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  flex-shrink: 0;

  ${({ $size }) =>
    $size === "sm"
      ? css`font-size: 9px; padding: 2px 6px;`
      : css`font-size: 10px; padding: 3px 8px;`}

  ${({ $variant }) => variantMap[$variant]}
`;

export const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`;

// ===== COUNTER BADGE (número sobre ícone) =====

export const CounterBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  font-family: var(--mono);
  flex-shrink: 0;
  ${({ $variant }) => variantMap[$variant]}
`;

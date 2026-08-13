import styled, { keyframes, css } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
`;

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "green" | "amber" | "red" | "blue" | "purple" | "muted";

const sizeMap: Record<SpinnerSize, string> = {
  xs: "12px",
  sm: "16px",
  md: "24px",
  lg: "36px",
};

const colorMap: Record<SpinnerVariant, string> = {
  green: "var(--green)",
  amber: "var(--amber)",
  red: "var(--red)",
  blue: "var(--blue)",
  purple: "var(--purple)",
  muted: "var(--text3)",
};

export const SpinnerSvg = styled.svg<{ $size: SpinnerSize }>`
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  animation: ${spin} 0.75s linear infinite;
  flex-shrink: 0;
`;

export const SpinnerTrack = styled.circle`
  stroke: var(--bg4);
  fill: none;
`;

export const SpinnerArc = styled.circle<{ $variant: SpinnerVariant }>`
  fill: none;
  stroke: ${({ $variant }) => colorMap[$variant]};
  stroke-linecap: round;
  transition: stroke 0.2s;
`;

// ===== DOTS LOADER =====

export const DotsWrapper = styled.div<{ $size: SpinnerSize }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => ($size === "xs" || $size === "sm" ? "4px" : "6px")};
`;

export const Dot = styled.span<{
  $variant: SpinnerVariant;
  $size: SpinnerSize;
  $delay: number;
}>`
  border-radius: 50%;
  background: ${({ $variant }) => colorMap[$variant]};
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}ms;
  flex-shrink: 0;

  ${({ $size }) => {
    const s = { xs: "4px", sm: "5px", md: "7px", lg: "10px" }[$size];
    return css`
      width: ${s};
      height: ${s};
    `;
  }}
`;

// ===== SKELETON =====

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const SkeletonBlock = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height ?? "16px"};
  border-radius: ${({ $radius }) => $radius ?? "var(--radius)"};
  background: linear-gradient(
    90deg,
    var(--bg3) 25%,
    var(--bg4) 50%,
    var(--bg3) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

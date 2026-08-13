import { SpinnerSvg, SpinnerTrack, SpinnerArc, DotsWrapper, Dot, SkeletonBlock } from "./Spinner.styles";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerVariant = "green" | "amber" | "red" | "blue" | "purple" | "muted";

const strokeMap: Record<SpinnerSize, number> = {
  xs: 2,
  sm: 2,
  md: 2.5,
  lg: 3,
};

// ===== SPINNER (circular) =====

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export function Spinner({ size = "md", variant = "green" }: SpinnerProps) {
  const sw = strokeMap[size];
  const r = 10;
  const cx = 12;
  const circ = 2 * Math.PI * r;

  return (
    <SpinnerSvg $size={size} viewBox="0 0 24 24" fill="none">
      <SpinnerTrack cx={cx} cy={cx} r={r} strokeWidth={sw} />
      <SpinnerArc
        $variant={variant}
        cx={cx}
        cy={cx}
        r={r}
        strokeWidth={sw}
        strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
        strokeDashoffset={circ * 0.1}
      />
    </SpinnerSvg>
  );
}

// ===== DOTS LOADER =====

interface DotsProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export function DotsLoader({ size = "md", variant = "muted" }: DotsProps) {
  return (
    <DotsWrapper $size={size}>
      <Dot $variant={variant} $size={size} $delay={0} />
      <Dot $variant={variant} $size={size} $delay={160} />
      <Dot $variant={variant} $size={size} $delay={320} />
    </DotsWrapper>
  );
}

// ===== SKELETON =====

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
}

export function Skeleton({ width, height, radius }: SkeletonProps) {
  return <SkeletonBlock $width={width} $height={height} $radius={radius} />;
}

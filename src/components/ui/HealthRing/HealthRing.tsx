import { RingWrapper, RingContainer, RingSvg, RingCenter, RingValue, RingSubLabel } from "./HealthRing.styles";

interface HealthRingProps {
  percent: number;
  color: string;
}

export function HealthRing({ percent, color }: HealthRingProps) {
  const r = 58;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);

  return (
    <RingWrapper>
      <RingContainer>
        <RingSvg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg4)" strokeWidth="12" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </RingSvg>
        <RingCenter>
          <RingValue $color={color}>{percent}%</RingValue>
          <RingSubLabel>Saúde</RingSubLabel>
        </RingCenter>
      </RingContainer>
    </RingWrapper>
  );
}

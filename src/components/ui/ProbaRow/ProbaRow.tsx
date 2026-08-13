import { RowRoot, RowLabel, BarTrack, BarFill, RowPercent } from "./ProbaRow.styles";

interface ProbaRowProps {
  label: string;
  percent: number;
  color?: string;
}

export function ProbaRow({ label, percent, color = "var(--purple)" }: ProbaRowProps) {
  return (
    <RowRoot>
      <RowLabel>{label}</RowLabel>
      <BarTrack>
        <BarFill $color={color} $percent={percent} />
      </BarTrack>
      <RowPercent>{percent}%</RowPercent>
    </RowRoot>
  );
}

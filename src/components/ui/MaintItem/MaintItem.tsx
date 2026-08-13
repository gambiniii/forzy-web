import { ItemRoot, StatusDot, ItemBody, ItemName, ItemDetail, ProgressTrack, ProgressFill, DueLabel } from "./MaintItem.styles";

interface MaintItemProps {
  name: string;
  detail: string;
  due: string;
  progress: number;
  color: string;
}

export function MaintItem({ name, detail, due, progress, color }: MaintItemProps) {
  return (
    <ItemRoot>
      <StatusDot $color={color} />
      <ItemBody>
        <ItemName>{name}</ItemName>
        <ItemDetail>{detail}</ItemDetail>
        <ProgressTrack>
          <ProgressFill $color={color} $percent={progress} />
        </ProgressTrack>
      </ItemBody>
      <DueLabel $color={color} $alert={progress >= 90}>{due}</DueLabel>
    </ItemRoot>
  );
}

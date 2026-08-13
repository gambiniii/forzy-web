import React from "react";
import {
  BubbleRoot,
  BubbleHeader,
  PulseRing,
  PulseDot,
  BubbleTitle,
  BubbleConfidence,
  BubbleContent,
  HighlightSpan,
} from "./AiBubble.styles";

interface AiBubbleProps {
  title?: string;
  confidence?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function AiBubble({ title = "Diagnóstico IA", confidence, children, style }: AiBubbleProps) {
  return (
    <BubbleRoot style={style}>
      <BubbleHeader>
        <PulseRing>
          <PulseDot />
        </PulseRing>
        <BubbleTitle>{title}</BubbleTitle>
        {confidence && <BubbleConfidence>{confidence}</BubbleConfidence>}
      </BubbleHeader>
      <BubbleContent>{children}</BubbleContent>
    </BubbleRoot>
  );
}

export function AiHighlight({ children }: { children: React.ReactNode }) {
  return <HighlightSpan>{children}</HighlightSpan>;
}

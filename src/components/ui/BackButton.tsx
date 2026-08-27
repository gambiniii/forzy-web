import type { CSSProperties } from "react";
import styled from "styled-components";
import { useNavigation } from "../../context/NavigationContext";

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--text3);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px 5px 6px;
  border-radius: 20px;
  letter-spacing: 0.01em;
  transition: color 0.15s, background 0.15s;

  svg { flex-shrink: 0; transition: transform 0.15s; }

  &:hover {
    color: var(--text1);
    background: var(--bg2);
    svg { transform: translateX(-2px); }
  }
`;

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

interface Props {
  className?: string;
  style?: CSSProperties;
}

export function BackButton({ className, style }: Props) {
  const { goBack } = useNavigation();
  return (
    <Btn onClick={goBack} className={className} style={style}>
      <ChevronLeft />
      Voltar
    </Btn>
  );
}

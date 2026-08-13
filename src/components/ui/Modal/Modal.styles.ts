import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${fadeIn} 0.15s ease;
`;

type ModalSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<ModalSize, string> = {
  sm: "380px",
  md: "520px",
  lg: "720px",
  xl: "960px",
};

export const Dialog = styled.div<{ $size: ModalSize }>`
  background: var(--bg2);
  border: 1px solid var(--border-md);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: ${({ $size }) => sizeMap[$size]};
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.18s ease;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--text1);
  margin: 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 12px;
  color: var(--text3);
  margin: 2px 0 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;

  &:hover {
    background: var(--bg3);
    color: var(--text1);
  }
`;

export const ModalBody = styled.div<{ $padded?: boolean }>`
  flex: 1;
  overflow-y: auto;
  ${({ $padded = true }) =>
    $padded &&
    css`
      padding: 20px;
    `}
`;

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

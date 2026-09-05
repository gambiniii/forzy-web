import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from { transform: translateX(16px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

export const ToastStack = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 340px;
  pointer-events: none;
`;

export const ToastCard = styled.div<{ $severity: "warning" | "critical" }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--bg2);
  border: 1px solid ${({ $severity }) => ($severity === "critical" ? "var(--red)" : "var(--amber)")};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  animation: ${slideIn} 0.2s ease;
  pointer-events: auto;
`;

export const ToastIcon = styled.span<{ $severity: "warning" | "critical" }>`
  font-size: 15px;
  line-height: 1;
  margin-top: 1px;
  flex-shrink: 0;
  color: ${({ $severity }) => ($severity === "critical" ? "var(--red)" : "var(--amber)")};
`;

export const ToastBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--text1);
  margin-bottom: 2px;
`;

export const ToastMessage = styled.div`
  font-size: 11px;
  color: var(--text2);
  line-height: 1.4;
`;

export const ToastClose = styled.button`
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 2px;
  flex-shrink: 0;

  &:hover { color: var(--text1); }
`;

export const BellButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius);
  border: 1px solid var(--border-md);
  background: var(--bg3);
  color: var(--text2);
  cursor: pointer;
  font-size: 15px;
  transition: border-color 0.15s, color 0.15s;

  &:hover { border-color: var(--purple); color: var(--text1); }
`;

export const BellCounterWrap = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
`;

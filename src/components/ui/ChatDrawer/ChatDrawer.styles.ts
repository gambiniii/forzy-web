import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ── FAB (floating action button) ── */
export const FabButton = styled.button<{ $open: boolean }>`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 1100;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--purple);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(116, 33, 235, 0.45);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(116,33,235,0.6); }
  svg { width: 22px; height: 22px; transition: transform 0.25s; transform: ${({ $open }) => $open ? "rotate(45deg)" : "none"}; }
`;

/* ── Drawer panel ── */
export const DrawerPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 92px;
  right: 28px;
  z-index: 1099;
  width: 380px;
  height: 520px;
  background: var(--bg1);
  border: 1px solid var(--border-md);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.45);
  overflow: hidden;
  pointer-events: ${({ $open }) => ($open ? "all" : "none")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)")};
  transition: opacity 0.2s, transform 0.2s;
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

export const PulseRing = styled.div`
  width: 22px;
  height: 22px;
  background: var(--purple-d);
  border: 1px solid var(--purple);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--purple);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

export const DrawerTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text1);
  flex: 1;
`;

export const ClearBtn = styled.button`
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover { color: var(--text2); background: var(--bg2); }
`;

/* ── Messages area ── */
export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
`;

export const MessageBubble = styled.div<{ $role: "user" | "assistant" }>`
  max-width: 86%;
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  background: ${({ $role }) =>
    $role === "user" ? "var(--purple)" : "var(--bg2)"};
  color: ${({ $role }) => ($role === "user" ? "#fff" : "var(--text1)")};
  border-radius: ${({ $role }) =>
    $role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px"};
  padding: 10px 13px;
  font-size: 13px;
  line-height: 1.6;
  animation: ${fadeIn} 0.18s ease;
  white-space: ${({ $role }) => ($role === "user" ? "pre-wrap" : "normal")};
  word-break: break-word;

  p { margin: 0 0 6px; }
  p:last-child { margin-bottom: 0; }
  ul, ol { margin: 4px 0 6px 16px; padding: 0; }
  li { margin-bottom: 2px; }
  strong { font-weight: 600; }
`;

export const DownloadBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 6px 12px;
  background: var(--purple-d);
  border: 1px solid var(--purple);
  border-radius: var(--radius);
  color: var(--purple);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
  svg { width: 14px; height: 14px; }
  &:hover { background: var(--purple); color: #fff; }
`;

export const ToolsBadge = styled.div`
  font-size: 10px;
  color: var(--text3);
  font-family: var(--mono);
  margin-top: 4px;
  padding-left: 2px;
`;

export const TypingBubble = styled.div`
  align-self: flex-start;
  background: var(--bg2);
  border-radius: 12px 12px 12px 2px;
  padding: 10px 14px;
  display: flex;
  gap: 5px;
  align-items: center;
  animation: ${fadeIn} 0.18s ease;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text3);
    animation: ${pulse} 1.2s infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

/* ── Input row ── */
export const InputRow = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  resize: none;
  background: var(--bg2);
  border: 1px solid var(--border-md);
  border-radius: var(--radius);
  color: var(--text1);
  font-family: inherit;
  font-size: 13px;
  padding: 8px 10px;
  outline: none;
  height: 38px;
  max-height: 100px;
  overflow: auto;
  &:focus { border-color: var(--purple); }
  &::placeholder { color: var(--text3); }
`;

export const SendBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  border: none;
  background: var(--purple);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:disabled { opacity: 0.4; cursor: default; }
  svg { width: 16px; height: 16px; }
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

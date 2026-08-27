import styled from "styled-components";

export const MiniChatRoot = styled.div<{ $x: number; $y: number; $visible: boolean }>`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  width: 360px;
  height: 480px;
  background: var(--bg1);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(116, 33, 235, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1050;
  overflow: hidden;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)")};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: opacity 0.22s ease, transform 0.22s ease;
  transform-origin: bottom right;
`;

/* ── Header ─────────────────────────────────────────────────── */

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  cursor: grab;
  user-select: none;
  flex-shrink: 0;
  border-radius: 16px 16px 0 0;

  &:active { cursor: grabbing; }
`;

export const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OrbDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--purple);
  box-shadow: 0 0 6px rgba(116, 33, 235, 0.6);
`;

export const ChatTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--text1);
`;

export const CtxChip = styled.span`
  font-size: 10px;
  color: var(--text3);
  background: var(--bg0);
  padding: 2px 7px;
  border-radius: 10px;
  border: 1px solid var(--border);
`;

export const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: none;
  background: none;
  color: var(--text3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, color 0.12s;

  &:hover {
    background: var(--bg0);
    color: var(--text1);
  }
`;

/* ── Messages ────────────────────────────────────────────────── */

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

export const MsgRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.div<{ $isUser: boolean }>`
  max-width: 82%;
  padding: 8px 12px;
  border-radius: ${({ $isUser }) => ($isUser ? "14px 14px 3px 14px" : "14px 14px 14px 3px")};
  background: ${({ $isUser }) => ($isUser ? "var(--purple)" : "var(--bg2)")};
  color: ${({ $isUser }) => ($isUser ? "#fff" : "var(--text1)")};
  font-size: 12.5px;
  line-height: 1.55;

  p { margin: 0 0 5px; &:last-child { margin: 0; } }
  code { font-size: 11px; background: rgba(0,0,0,0.18); padding: 1px 4px; border-radius: 3px; }
  pre { overflow-x: auto; margin: 4px 0; }
  strong { font-weight: 600; }
  ul, ol { margin: 4px 0 4px 16px; padding: 0; }
  li { margin: 2px 0; }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text3);
  font-size: 12px;
  text-align: center;
  padding: 24px;

  svg { opacity: 0.4; }
`;

/* ── Input footer ─────────────────────────────────────────────── */

export const ChatFooter = styled.div`
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const TextInput = styled.textarea`
  flex: 1;
  resize: none;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  color: var(--text1);
  font-family: inherit;
  min-height: 36px;
  max-height: 90px;
  line-height: 1.45;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: var(--text3); }
  &:focus { border-color: var(--purple); }
`;

export const SendBtn = styled.button<{ $loading?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: none;
  background: var(--purple);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  transition: opacity 0.15s, transform 0.12s;

  &:not(:disabled):hover { transform: scale(1.06); }
  &:disabled { cursor: not-allowed; }
`;

import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

export const PageWrapper = styled.div`
  height: calc(100vh - var(--topbar-h));
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ── Welcome ────────────────────────────────────────────────────────── */

export const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  animation: ${fadeIn} 0.3s ease;
`;

export const AiOrb = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple) 0%, rgba(116,33,235,0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 0 0 8px var(--purple-d), 0 0 32px rgba(116,33,235,0.3);
  margin-bottom: 20px;
  flex-shrink: 0;
`;

export const WelcomeTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: var(--text1);
  margin: 0 0 6px;
`;

export const WelcomeSubtitle = styled.p`
  font-size: 13px;
  color: var(--text2);
  margin: 0 0 24px;
  text-align: center;
`;

export const CapabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-width: 480px;
  width: 100%;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const CapabilityCard = styled.div`
  background: var(--bg1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  span.icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  span.label {
    font-size: 12px;
    color: var(--text2);
    line-height: 1.4;
  }
  strong {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text1);
    margin-bottom: 2px;
  }
`;

export const WelcomeDivider = styled.div`
  font-size: 11px;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  align-self: center;
  text-align: center;
  max-width: 480px;
  width: 100%;
`;

/* ── Messages ───────────────────────────────────────────────────────── */

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 20px 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border-md); border-radius: 2px; }
`;

export const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 78%;
  align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  flex-direction: ${({ $isUser }) => ($isUser ? "row-reverse" : "row")};
  animation: ${fadeIn} 0.2s ease;
`;

export const Avatar = styled.div<{ $isUser: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $isUser }) => ($isUser ? "11px" : "15px")};
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $isUser }) => ($isUser ? "var(--bg3)" : "var(--purple-d)")};
  border: 1px solid ${({ $isUser }) => ($isUser ? "var(--border-md)" : "var(--purple)")};
  color: ${({ $isUser }) => ($isUser ? "var(--text2)" : "var(--purple)")};
`;

export const Bubble = styled.div<{ $isUser: boolean }>`
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.65;

  ${({ $isUser }) =>
    $isUser
      ? css`
          background: var(--purple-d);
          border: 1px solid rgba(116,33,235,0.25);
          color: var(--text1);
          border-top-right-radius: 4px;
          white-space: pre-wrap;
        `
      : css`
          background: var(--bg1);
          border: 1px solid var(--border-md);
          color: var(--text1);
          border-top-left-radius: 4px;

          p { margin: 0 0 6px; }
          p:last-child { margin-bottom: 0; }
          ul, ol { margin: 4px 0 6px 18px; padding: 0; }
          li { margin-bottom: 3px; }
          strong { color: var(--text1); font-weight: 600; }
          code {
            background: var(--bg2);
            border-radius: 4px;
            padding: 1px 5px;
            font-size: 12px;
            font-family: monospace;
            border: 1px solid var(--border);
          }
          h3 { font-size: 13px; margin: 8px 0 4px; color: var(--text1); }
        `}
`;

export const TypingBubble = styled(Bubble)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--purple);
    animation: ${pulse} 1.2s ease infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

export const ReportLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--purple);
  background: var(--purple-d);
  border: 1px solid rgba(116,33,235,0.3);
  border-radius: var(--radius);
  padding: 5px 10px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.15s;

  &:hover { opacity: 0.8; }
`;

/* ── Examples ───────────────────────────────────────────────────────── */

export const ExamplesRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0 16px 8px;
`;

export const ExampleChip = styled.button`
  background: var(--bg1);
  border: 1px solid var(--border-md);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11.5px;
  color: var(--text2);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  white-space: nowrap;

  &:hover {
    border-color: var(--purple);
    color: var(--purple);
    background: var(--purple-d);
  }
`;

/* ── Input bar ──────────────────────────────────────────────────────── */

export const InputArea = styled.div`
  padding: 0 16px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg0);
  padding-top: 12px;
`;

export const InputBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  background: var(--bg1);
  border: 1px solid var(--border-md);
  border-radius: var(--radius-lg);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text1);
  font-family: inherit;
  outline: none;
  resize: none;
  line-height: 1.5;
  max-height: 120px;
  min-height: 42px;
  transition: border-color 0.15s;
  overflow-y: auto;

  &::placeholder { color: var(--text3); }
  &:focus { border-color: var(--purple); }
`;

export const SendButton = styled.button<{ $loading?: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: var(--purple);
  color: #fff;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: ${({ $loading }) => ($loading ? 0.6 : 1)};
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(116,33,235,0.35);

  &:hover:not(:disabled) { transform: scale(1.05); }
  &:active:not(:disabled) { transform: scale(0.95); }

  svg { ${({ $loading }) => $loading && css`animation: ${spin} 0.8s linear infinite;`} }
`;

/* ── FAB (exported for AppShell) ────────────────────────────────────── */

export const AssistantFab = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
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
  z-index: 1100;
  box-shadow: 0 4px 16px rgba(116,33,235,0.45);
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(116,33,235,0.6);
  }
  &:active { transform: scale(0.96); }
`;

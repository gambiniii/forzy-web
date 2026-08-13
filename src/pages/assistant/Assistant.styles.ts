import styled, { css } from "styled-components";

export const PageWrapper = styled.div`
  padding: 20px;
  animation: fadeIn 0.2s ease;
  height: calc(100vh - 52px);
  display: flex;
  flex-direction: column;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
`;

export const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 80%;
  align-self: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  flex-direction: ${({ $isUser }) => ($isUser ? "row-reverse" : "row")};
`;

export const Avatar = styled.div<{ $isUser: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
  background: ${({ $isUser }) => ($isUser ? "var(--blue-d)" : "var(--purple-d)")};
  border: 1px solid ${({ $isUser }) => ($isUser ? "var(--blue)" : "var(--purple)")};
  color: ${({ $isUser }) => ($isUser ? "var(--blue)" : "var(--purple)")};
`;

export const Bubble = styled.div<{ $isUser: boolean }>`
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
  white-space: ${({ $isUser }) => ($isUser ? "pre-wrap" : "normal")};

  ${({ $isUser }) =>
    $isUser
      ? css`
          background: var(--blue-d);
          border: 1px solid rgba(56, 182, 255, 0.2);
          color: var(--text1);
          border-top-right-radius: 4px;
        `
      : css`
          background: var(--bg2);
          border: 1px solid var(--border);
          color: var(--text1);
          border-top-left-radius: 4px;

          p { margin: 0 0 6px; }
          p:last-child { margin-bottom: 0; }
          ul, ol { margin: 4px 0 6px 18px; padding: 0; }
          li { margin-bottom: 2px; }
          strong { color: var(--text1); font-weight: 600; }
          code {
            background: var(--bg3);
            border-radius: 3px;
            padding: 1px 5px;
            font-size: 12px;
            font-family: monospace;
          }
        `}
`;

export const InputBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border);
`;

export const ChatInput = styled.input`
  flex: 1;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text1);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder {
    color: var(--text3);
  }

  &:focus {
    border-color: var(--border-hi);
  }
`;

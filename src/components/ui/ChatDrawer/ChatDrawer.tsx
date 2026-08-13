import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage, clearChatSession, type ChatMessage } from "../../../services/chat.service";
import {
  FabButton, DrawerPanel, DrawerHeader, DrawerTitle, ClearBtn,
  MessagesArea, MessageBubble, ToolsBadge, TypingBubble,
  InputRow, ChatInput, SendBtn, Spinner,
  PulseRing, PulseDot, DownloadBtn,
} from "./ChatDrawer.styles";

const SESSION_KEY = "forzy_chat_session";

function getOrCreateSession(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session_${Date.now()}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

interface Entry {
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  reportUrl?: string;
}

interface Props {
  machineId: string;
}

export function ChatDrawer({ machineId }: Props) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(getOrCreateSession());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, loading]);

  const submit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const msg = input.trim();
    if (!msg || loading) return;

    const history: ChatMessage[] = entries.map((e) => ({
      role: e.role,
      content: e.content,
    }));

    setEntries((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: msg,
        machine_id: machineId,
        session_id: sessionId.current,
        history,
        mode: "agent",
      });
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, tools: res.tools_used, reportUrl: res.report_url ?? undefined },
      ]);
    } catch {
      setEntries((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao contatar o assistente. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, entries, machineId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleClear = async () => {
    try { await clearChatSession(sessionId.current); } catch {}
    sessionId.current = `session_${Date.now()}`;
    sessionStorage.setItem(SESSION_KEY, sessionId.current);
    setEntries([]);
  };

  return (
    <>
      <DrawerPanel $open={open}>
        <DrawerHeader>
          <PulseRing><PulseDot /></PulseRing>
          <DrawerTitle>Assistente Forzy</DrawerTitle>
          <ClearBtn onClick={handleClear}>limpar</ClearBtn>
        </DrawerHeader>

        <MessagesArea>
          {entries.length === 0 && (
            <MessageBubble $role="assistant">
              Olá! Sou o assistente técnico do Forzy. Posso consultar os sensores, analisar anomalias e responder dúvidas sobre o motor WEG W22. Como posso ajudar?
            </MessageBubble>
          )}
          {entries.map((entry, i) => (
            <div key={i}>
              <MessageBubble $role={entry.role}>
                {entry.role === "assistant"
                  ? <ReactMarkdown>{entry.content}</ReactMarkdown>
                  : entry.content}
              </MessageBubble>
              {entry.role === "assistant" && entry.reportUrl && (
                <DownloadBtn href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}${entry.reportUrl}`} target="_blank" rel="noreferrer" download>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M8 2v8M5 7l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 13h10" strokeLinecap="round"/>
                  </svg>
                  Baixar relatório PDF
                </DownloadBtn>
              )}
              {entry.role === "assistant" && entry.tools && entry.tools.length > 0 && (
                <ToolsBadge>via {entry.tools.join(" · ")}</ToolsBadge>
              )}
            </div>
          ))}
          {loading && (
            <TypingBubble>
              <span /><span /><span />
            </TypingBubble>
          )}
          <div ref={bottomRef} />
        </MessagesArea>

        <InputRow onSubmit={submit}>
          <ChatInput
            ref={textareaRef}
            placeholder="Pergunte sobre o motor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
          />
          <SendBtn type="submit" disabled={loading || !input.trim()}>
            {loading ? <Spinner /> : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </SendBtn>
        </InputRow>
      </DrawerPanel>

      <FabButton $open={open} onClick={() => setOpen((v) => !v)} title="Assistente IA">
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </FabButton>
    </>
  );
}

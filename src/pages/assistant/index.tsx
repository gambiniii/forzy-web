import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage, type ChatMessage } from "../../services/chat.service";
import { api } from "../../services/api";
import {
  PageWrapper, WelcomeContainer, AiOrb, WelcomeTitle, WelcomeSubtitle,
  CapabilityGrid, CapabilityCard, WelcomeDivider,
  MessageList, MessageRow, Avatar, Bubble, ReportLink,
  ExamplesRow, ExampleChip,
  InputArea, InputBar, ChatInput, SendButton,
  PreviousSessionBanner, SessionBtn, NewChatBar, NewChatBtn,
} from "./Assistant.styles";

/* ── Types ─────────────────────────────────────────────────────────── */

interface Message {
  role: "ai" | "user";
  text: string;
  reportUrl?: string | null;
}

/* ── Persistence ────────────────────────────────────────────────────── */

const STORAGE_KEY = "forzy_chat_history";

interface SavedChat {
  sessionId: string;
  messages: Message[];
  history: ChatMessage[];
  savedAt: number;
  lastPreview: string;
}

function loadSaved(): SavedChat | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedChat;
    if (!data.messages?.length) return null;
    return data;
  } catch { return null; }
}

function persistChat(sessionId: string, messages: Message[], history: ChatMessage[]) {
  try {
    const lastAi = [...messages].reverse().find((m) => m.role === "ai");
    const saved: SavedChat = {
      sessionId, messages, history,
      savedAt: Date.now(),
      lastPreview: lastAi ? lastAi.text.slice(0, 80) : "",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {}
}

function clearPersisted() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

function timeAgo(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

/* ── Thinking orb ──────────────────────────────────────────────────── */

const THINKING_ICONS = [
  <svg key="low" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 21v-1.25c0 -2.311 .778 -1.92 2.244 -3.749a8 8 0 1 0 -14.244 -5.001q 0 .25 -1.876 3.518a1 1 0 0 0 .876 1.482h2v3a2 2 0 0 0 2 2h3" />
    <path d="M12 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </svg>,
  <svg key="med" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 21v-1.25c0 -2.311 .778 -1.92 2.244 -3.749a8 8 0 1 0 -14.244 -5.001q 0 .25 -1.876 3.518a1 1 0 0 0 .876 1.482h2v3a2 2 0 0 0 2 2h3" />
    <path d="M11 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </svg>,
  <svg key="high" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 21v-1.25c0 -2.311 .778 -1.92 2.244 -3.749a8 8 0 1 0 -14.244 -5.001q 0 .25 -1.876 3.518a1 1 0 0 0 .876 1.482h2v3a2 2 0 0 0 2 2h3" />
    <path d="M9 11a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  </svg>,
];

function ThinkingOrb() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % 3), 1400);
    return () => clearInterval(id);
  }, []);
  return <>{THINKING_ICONS[idx]}</>;
}

/* ── Typing loader ─────────────────────────────────────────────────── */

function TypingLoader() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" style={{ color: "var(--purple)" }}>
      <path d="M0 0h24v24H0z" fill="none" />
      <defs>
        <filter id="forzy-loader-blur">
          <feGaussianBlur in="SourceGraphic" result="y" stdDeviation="1" />
          <feColorMatrix in="y" result="z" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" />
          <feBlend in="SourceGraphic" in2="z" />
        </filter>
      </defs>
      <g filter="url(#forzy-loader-blur)">
        <circle cx="5" cy="12" r="4" fill="currentColor">
          <animate attributeName="cx" calcMode="spline" dur="2s" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite" values="5;8;5" />
        </circle>
        <circle cx="19" cy="12" r="4" fill="currentColor">
          <animate attributeName="cx" calcMode="spline" dur="2s" keySplines=".36,.62,.43,.99;.79,0,.58,.57" repeatCount="indefinite" values="19;16;19" />
        </circle>
        <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
      </g>
    </svg>
  );
}

/* ── Capability card icons ─────────────────────────────────────────── */

const IconRealtime = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/>
    <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/>
    <path d="M4 18.463V21"/><path d="M8 14.656V21"/>
  </svg>
);
const IconML = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6V2H8"/><path d="M15 11v2"/><path d="M2 12h2"/><path d="M20 12h2"/>
    <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>
    <path d="M9 11v2"/>
  </svg>
);
const IconAlerts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 18v-6a5 5 0 1 1 10 0v6"/>
    <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/>
    <path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/>
    <path d="m4.929 4.929.707.707"/><path d="M12 12v6"/>
  </svg>
);
const IconReports = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v8l3-3 3 3V2"/>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
  </svg>
);

/* ── Data ──────────────────────────────────────────────────────────── */

const EXAMPLE_QUESTIONS = [
  "Como está a saúde do motor agora?",
  "Há alguma anomalia detectada?",
  "Visão geral do sistema",
  "Últimas leituras dos sensores",
  "Gera um relatório em PDF",
  "Gera um relatório em Excel",
  "Quando é a próxima manutenção?",
  "Análise de tendência de temperatura",
];

const CAPABILITIES = [
  { Icon: IconRealtime, title: "Dados em tempo real",     desc: "Leituras de sensores, temperatura, vibração e RPM" },
  { Icon: IconML,       title: "Diagnóstico ML",          desc: "Análise com Isolation Forest, LSTM e estimativa de RUL" },
  { Icon: IconAlerts,   title: "Alertas e manutenção",    desc: "Histórico de alertas e registros de intervenções" },
  { Icon: IconReports,  title: "Relatórios exportáveis",  desc: "Gera PDF, Excel e Word com todos os dados" },
];

/* ── Send icon ─────────────────────────────────────────────────────── */

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <path d="M1 7l11-5-5 11-1.5-4.5L1 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────── */

export function AssistantScreen() {
  const [sessionId, setSessionId] = useState<string>(() => `assistant-${Date.now()}`);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState<ChatMessage[]>([]);
  const [savedChat, setSavedChat] = useState<SavedChat | null>(() => loadSaved());

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* persist after each message pair */
  useEffect(() => {
    if (messages.length > 0) {
      persistChat(sessionId, messages, history);
    }
  }, [messages]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  /* continue previous conversation */
  const continuePrevious = useCallback(() => {
    if (!savedChat) return;
    setMessages(savedChat.messages);
    setHistory(savedChat.history ?? []);
    setSessionId(savedChat.sessionId);
    setSavedChat(null);
  }, [savedChat]);

  /* discard saved and start fresh */
  const startNew = useCallback(() => {
    clearPersisted();
    setSavedChat(null);
    setMessages([]);
    setHistory([]);
    setSessionId(`assistant-${Date.now()}`);
  }, []);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    /* first message of a new conversation — discard any banner */
    setSavedChat(null);

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    const newHistory: ChatMessage[] = [...history, { role: "user", content: msg }];

    try {
      const res = await sendChatMessage({
        message: msg,
        machine_id: "1",
        session_id: sessionId,
        history,
        mode: "agent",
      });

      const answer = res.answer || "Sem resposta disponível.";
      const reportUrl = res.report_url
        ? `${(api as any).baseUrl ?? "http://localhost:8000"}${res.report_url}`
        : null;

      setMessages((prev) => [...prev, { role: "ai", text: answer, reportUrl }]);
      setHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Não consegui processar sua pergunta. Verifique a conexão com a API e tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, history, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <PageWrapper>

      {/* ── Welcome ────────────────────────────────────────────── */}
      {isEmpty && (
        <WelcomeContainer>
          <AiOrb><ThinkingOrb /></AiOrb>
          <WelcomeTitle>Forzy AI</WelcomeTitle>
          <WelcomeSubtitle>Assistente de Monitoramento Industrial</WelcomeSubtitle>

          {/* Banner de sessão anterior */}
          {savedChat && (
            <PreviousSessionBanner>
              <div className="info">
                <strong>Conversa anterior</strong>
                <span>{savedChat.messages.length} mensagens · {timeAgo(savedChat.savedAt)}</span>
                {savedChat.lastPreview && (
                  <em title={savedChat.lastPreview}>"{savedChat.lastPreview}{savedChat.lastPreview.length >= 80 ? "…" : ""}"</em>
                )}
              </div>
              <div className="actions">
                <SessionBtn onClick={startNew}>Nova conversa</SessionBtn>
                <SessionBtn $primary onClick={continuePrevious}>Continuar</SessionBtn>
              </div>
            </PreviousSessionBanner>
          )}

          <CapabilityGrid>
            {CAPABILITIES.map(({ Icon, title, desc }) => (
              <CapabilityCard key={title}>
                <span className="icon"><Icon /></span>
                <div>
                  <strong>{title}</strong>
                  <span className="label">{desc}</span>
                </div>
              </CapabilityCard>
            ))}
          </CapabilityGrid>

          <WelcomeDivider>Perguntas frequentes</WelcomeDivider>
          <ExamplesRow style={{ maxWidth: 480, width: "100%", justifyContent: "center" }}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <ExampleChip key={q} onClick={() => send(q)}>{q}</ExampleChip>
            ))}
          </ExamplesRow>
        </WelcomeContainer>
      )}

      {/* ── Messages ───────────────────────────────────────────── */}
      {!isEmpty && (
        <>
          <NewChatBar>
            <NewChatBtn onClick={startNew} title="Iniciar nova conversa">
              <PlusIcon />
              Nova conversa
            </NewChatBtn>
          </NewChatBar>

          <MessageList>
            {messages.map((msg, i) => (
              <MessageRow key={i} $isUser={msg.role === "user"}>
                <Avatar $isUser={msg.role === "user"}>
                  {msg.role === "ai" ? <ThinkingOrb /> : "U"}
                </Avatar>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "100%" }}>
                  <Bubble $isUser={msg.role === "user"}>
                    {msg.role === "ai"
                      ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                      : msg.text}
                  </Bubble>
                  {msg.reportUrl && (
                    <ReportLink href={msg.reportUrl} target="_blank" rel="noreferrer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Baixar relatório
                    </ReportLink>
                  )}
                </div>
              </MessageRow>
            ))}

            {loading && (
              <MessageRow $isUser={false}>
                <Avatar $isUser={false}><ThinkingOrb /></Avatar>
                <Bubble $isUser={false} style={{ padding: "10px 14px", display: "flex", alignItems: "center" }}>
                  <TypingLoader />
                </Bubble>
              </MessageRow>
            )}
            <div ref={bottomRef} />
          </MessageList>
        </>
      )}

      {/* ── Input area ─────────────────────────────────────────── */}
      <InputArea>
        {!isEmpty && (
          <ExamplesRow style={{ marginBottom: 8 }}>
            {EXAMPLE_QUESTIONS.slice(0, 4).map((q) => (
              <ExampleChip key={q} onClick={() => send(q)}>{q}</ExampleChip>
            ))}
          </ExamplesRow>
        )}
        <InputBar>
          <ChatInput
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre o motor, sensores, diagnóstico, relatórios..."
            rows={1}
          />
          <SendButton onClick={() => send()} disabled={loading || !input.trim()} $loading={loading}>
            <SendIcon />
          </SendButton>
        </InputBar>
      </InputArea>

    </PageWrapper>
  );
}

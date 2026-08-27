import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import { sendChatMessage, type ChatMessage } from "../../services/chat.service";
import { screenLabels } from "../../context/NavigationContext";
import type { ScreenKey } from "../../context/NavigationContext";
import {
  MiniChatRoot, ChatHeader, ChatHeaderLeft, OrbDot, ChatTitle, CtxChip,
  ChatHeaderRight, IconBtn, MessageList, MsgRow, Bubble, EmptyState,
  ChatFooter, InputRow, TextInput, SendBtn,
} from "./MiniChat.styles";

/* ── helpers ─────────────────────────────────────────────────── */

const PATH_TO_SCREEN: Array<[RegExp, ScreenKey]> = [
  [/\/machinery\/machine-detail\//, "machine-detail"],
  [/\/machinery\/alerts/, "alerts"],
  [/\/machinery\/diagnosis/, "diagnosis"],
  [/\/machinery\/health/, "health"],
  [/\/machinery\/realtime/, "realtime"],
  [/\/machinery\/history/, "history"],
  [/\/machinery\/maintenance/, "maintenance"],
  [/\/machinery\/components/, "components"],
  [/\/machinery\/reports/, "reports"],
  [/\/dashboard/, "dashboard"],
  [/\/plants/, "plants"],
  [/\/machinery$/, "machinery"],
];

function getScreenKey(pathname: string): ScreenKey | null {
  for (const [re, key] of PATH_TO_SCREEN) {
    if (re.test(pathname)) return key;
  }
  return null;
}

function getMachineId(pathname: string): string {
  const match = pathname.match(/\/machinery\/machine-detail\/(\d+)/);
  return match ? match[1] : "1";
}

/* ── icons ───────────────────────────────────────────────────── */

const ExpandIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7l11-5-5 11-1.5-4.5L1 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/* ── types ───────────────────────────────────────────────────── */

interface Message {
  role: "ai" | "user";
  text: string;
}

interface Props {
  x: number;
  y: number;
  visible: boolean;
  onMove: (x: number, y: number) => void;
  onClose: () => void;
  onExpand: () => void;
}

/* ── component ───────────────────────────────────────────────── */

export function MiniChat({ x, y, visible, onMove, onClose, onExpand }: Props) {
  const { pathname } = useLocation();

  const screenKey  = getScreenKey(pathname);
  const screenName = screenKey ? screenLabels[screenKey] : null;
  const machineId  = getMachineId(pathname);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [history, setHistory]   = useState<ChatMessage[]>([]);
  const [sessionId]             = useState(() => `mini-${Date.now()}`);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragging    = useRef(false);
  const dragOffset  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (visible) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, visible]);

  /* ── drag header ─────────────────────────────────── */

  const onHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't start drag when clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHeaderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const nx = Math.max(0, Math.min(window.innerWidth - 360, e.clientX - dragOffset.current.x));
    const ny = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.current.y));
    onMove(nx, ny);
  };

  const onHeaderPointerUp = () => { dragging.current = false; };

  /* ── send ────────────────────────────────────────── */

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 90) + "px";
  };

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "36px";
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    const contextHistory: ChatMessage[] = screenName
      ? [{ role: "assistant", content: `Contexto: o usuário está na tela "${screenName}" do sistema Forzy.` }]
      : [];

    const newHistory: ChatMessage[] = [...history, { role: "user", content: msg }];

    try {
      const res = await sendChatMessage({
        message: msg,
        machine_id: machineId,
        session_id: sessionId,
        history: [...contextHistory, ...history],
        mode: "agent",
      });
      const answer = res.answer || "Sem resposta disponível.";
      setMessages(prev => [...prev, { role: "ai", text: answer }]);
      setHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Erro ao conectar com a API." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, history, sessionId, machineId, screenName]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <MiniChatRoot $x={x} $y={y} $visible={visible}>

      <ChatHeader
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
      >
        <ChatHeaderLeft>
          <OrbDot />
          <ChatTitle>PRISMO</ChatTitle>
          {screenName && <CtxChip>{screenName}</CtxChip>}
        </ChatHeaderLeft>
        <ChatHeaderRight>
          <IconBtn onClick={onExpand} title="Abrir chat completo">
            <ExpandIcon />
          </IconBtn>
          <IconBtn onClick={onClose} title="Fechar">
            <CloseIcon />
          </IconBtn>
        </ChatHeaderRight>
      </ChatHeader>

      <MessageList>
        {messages.length === 0 && (
          <EmptyState>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M12 2a7 7 0 017 7c0 3.5-2 6-5 7l-2 4-2-4c-3-1-5-3.5-5-7a7 7 0 017-7z" />
              <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>
              {screenName
                ? `Pergunte sobre ${screenName}`
                : "Como posso ajudar?"}
            </span>
          </EmptyState>
        )}

        {messages.map((msg, i) => (
          <MsgRow key={i} $isUser={msg.role === "user"}>
            <Bubble $isUser={msg.role === "user"}>
              {msg.role === "ai"
                ? <ReactMarkdown>{msg.text}</ReactMarkdown>
                : msg.text}
            </Bubble>
          </MsgRow>
        ))}

        {loading && (
          <MsgRow $isUser={false}>
            <Bubble $isUser={false} style={{ color: "var(--text3)", letterSpacing: 2, minWidth: 40 }}>
              ···
            </Bubble>
          </MsgRow>
        )}

        <div ref={bottomRef} />
      </MessageList>

      <ChatFooter>
        <InputRow>
          <TextInput
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre o motor..."
            rows={1}
          />
          <SendBtn onClick={send} disabled={loading || !input.trim()} $loading={loading}>
            <SendIcon />
          </SendBtn>
        </InputRow>
      </ChatFooter>

    </MiniChatRoot>
  );
}

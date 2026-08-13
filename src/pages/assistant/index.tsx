import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PageWrapper,
  MessageList,
  MessageRow,
  Avatar,
  Bubble,
  InputBar,
  ChatInput,
} from "./Assistant.styles";
import { initialMessages, AI_FALLBACK, type Message } from "./Assistant.types";

export function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "ai", text: AI_FALLBACK },
    ]);
    setInput("");
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Assistente IA"
        sub="Análise inteligente · Contexto: M-07 · Planta A"
      />

      <MessageList>
        {messages.map((msg, i) => (
          <MessageRow key={i} $isUser={msg.role === "user"}>
            <Avatar $isUser={msg.role === "user"}>
              {msg.role === "ai" ? "IA" : "JM"}
            </Avatar>
            <Bubble $isUser={msg.role === "user"}>
              {msg.role === "ai" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </Bubble>
          </MessageRow>
        ))}
        <div ref={bottomRef} />
      </MessageList>

      <InputBar>
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Digite sua pergunta sobre o equipamento..."
        />
        <Button variant="purple" onClick={send}>
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
            <path
              d="M1 7l11-5-5 11-1.5-4.5L1 7z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          Enviar
        </Button>
      </InputBar>
    </PageWrapper>
  );
}

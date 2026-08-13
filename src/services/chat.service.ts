import { api } from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  machine_id: string;
  session_id: string;
  history: ChatMessage[];
  mode: "agent" | "rag";
}

export interface ChatResponse {
  answer: string;
  tools_used: string[];
  sources: string[];
  mode: string;
  machine_id: string;
  session_id: string;
  fallback_used: boolean;
  response_time_ms: number | null;
  report_url: string | null;
}

export function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  return api.post<ChatResponse>("/chat/message", req);
}

export function clearChatSession(sessionId: string): Promise<void> {
  return api.delete<void>(`/chat/sessions/${sessionId}`);
}

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

/**
 * Envia a mensagem ao agente e traduz a falha em algo acionável.
 *
 * Antes, tanto o assistente quanto o mini chat mostravam "erro de conexão" para
 * QUALQUER falha, o que escondia a causa real: servidor fora do ar, agente ainda
 * carregando, ou erro dentro do próprio agente. As três exigem ações diferentes.
 *
 * O agente pode levar mais de 10 s quando precisa encadear várias tools, e a
 * primeira mensagem depois de um reinício ainda paga o carregamento do
 * vectorstore. Por isso o limite aqui é generoso.
 */
const TIMEOUT_MS = 120_000;

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  const abort = new AbortController();
  const t = setTimeout(() => abort.abort(), TIMEOUT_MS);
  try {
    return await api.post<ChatResponse>("/chat/message", req, { signal: abort.signal });
  } catch (e) {
    const err = e as { name?: string; message?: string };
    if (err?.name === "AbortError") {
      throw new Error(
        `O agente não respondeu em ${TIMEOUT_MS / 1000}s. Ele pode estar carregando ` +
        "os modelos — tente de novo em alguns segundos."
      );
    }
    // TypeError de fetch significa que a requisição nem chegou ao servidor.
    if (err?.name === "TypeError") {
      throw new Error("Não foi possível alcançar a API. Verifique se o servidor está no ar.");
    }
    throw e;
  } finally {
    clearTimeout(t);
  }
}

export function clearChatSession(sessionId: string): Promise<void> {
  return api.delete<void>(`/chat/sessions/${sessionId}`);
}

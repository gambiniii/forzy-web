const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("forzy_token");
}

export function saveToken(token: string) {
  localStorage.setItem("forzy_token", token);
}

export function clearToken() {
  localStorage.removeItem("forzy_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/";
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                       => request<T>(path),
  post:   <T>(path: string, body: unknown)        => request<T>(path, { method: "POST",  body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown)        => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)        => request<T>(path, { method: "PUT",   body: JSON.stringify(body) }),
  delete: <T>(path: string)                       => request<T>(path, { method: "DELETE" }),
  postForm: <T>(path: string, form: URLSearchParams) =>
    request<T>(path, {
      method: "POST",
      body: form,
      headers: { "Content-Type": "application/x-www-form-urlencoded" } as HeadersInit,
    }),
};

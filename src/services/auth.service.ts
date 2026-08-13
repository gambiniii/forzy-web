import { api, saveToken } from "./api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const form = new URLSearchParams({ username: email, password });
  const res = await api.postForm<LoginResponse>("/auth/login", form);
  saveToken(res.access_token);
  return res;
}

export interface MeResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getMe(): Promise<MeResponse> {
  return api.get<MeResponse>("/auth/me");
}

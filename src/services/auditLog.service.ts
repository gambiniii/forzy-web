import { api } from "./api";

export interface AuditLogEntry {
  id: number;
  user_id: number;
  action: string;
  target: string;
  justification: string | null;
  created_at: string;
}

export interface AuditLogCreate {
  action: string;
  target: string;
  justification?: string;
}

export const auditLogService = {
  create: (data: AuditLogCreate)   => api.post<AuditLogEntry>("/audit-log/", data),
  list:   (target?: string)        => api.get<AuditLogEntry[]>(`/audit-log/${target ? `?target=${target}` : ""}`),
};

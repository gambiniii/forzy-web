/** Governança CS3 — quem pode tomar decisões críticas / alterar limites contratuais. */

export function canApproveAction(role: string | undefined | null): boolean {
  return role === "admin" || role === "technician";
}

export function canEditLimits(role: string | undefined | null): boolean {
  return role === "admin";
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function diasRestantes(iso: string): string {
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff < 0)  return "Atrasada";
  if (diff === 0) return "Hoje";
  return `Em ${diff} dia${diff > 1 ? "s" : ""}`;
}

export function progressoEstimado(iso: string): number {
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff <= 0)  return 100;
  if (diff >= 30) return 5;
  return Math.round((1 - diff / 30) * 100);
}

export function getInitials(name: string | undefined): string {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

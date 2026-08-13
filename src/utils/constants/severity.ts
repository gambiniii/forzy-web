export const SEV_ITEM: Record<string, "crit" | "warn" | "info" | "ok"> = {
  critical: "crit",
  high:     "warn",
  medium:   "warn",
  low:      "info",
};

export const SEV_VARIANT: Record<string, "red" | "amber" | "blue" | "green"> = {
  critical: "red",
  high:     "amber",
  medium:   "amber",
  low:      "blue",
};

export const SEV_LABEL: Record<string, string> = {
  critical: "CRÍTICO",
  high:     "ATENÇÃO",
  medium:   "ATENÇÃO",
  low:      "INFO",
};

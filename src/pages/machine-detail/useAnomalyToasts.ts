import { useEffect, useRef, useState } from "react";
import { useToast } from "../../components/ui/Toast/ToastProvider";
import { STATUS_LABEL } from "./diagnosticoUtils";
import type { Anomalia } from "../../services/anomalias.service";

/** Dispara um toast quando um NOVO diagnóstico de atenção/crítico chega
 * (não dispara para o histórico já carregado no primeiro render) e mantém
 * um contador de não-vistos para o sino de alertas no Hero. */
export function useAnomalyToasts(anomalias: Anomalia[]) {
  const { pushToast } = useToast();
  const lastSeenId = useRef<number | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const latest = anomalias[0];
    if (!latest) return;

    if (lastSeenId.current === null) {
      lastSeenId.current = latest.id;
      return;
    }
    if (latest.id === lastSeenId.current) return;
    lastSeenId.current = latest.id;

    if (latest.overall_status === "warning" || latest.overall_status === "critical") {
      pushToast({
        severity: latest.overall_status === "critical" ? "critical" : "warning",
        title: STATUS_LABEL[latest.overall_status],
        message: latest.recommendation ?? latest.threshold_message ?? undefined,
      });
      setUnread((n) => n + 1);
    }
  }, [anomalias, pushToast]);

  return { unread, clearUnread: () => setUnread(0) };
}

import { useCallback, useEffect, useState } from "react";
import { alertasService, type Alerta } from "../services/alertas.service";

export function useAlertas(params?: { machine_id?: number; resolved?: boolean }) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    alertasService.list(params)
      .then(setAlertas)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params?.machine_id, params?.resolved]);

  useEffect(() => { fetch(); }, [fetch]);

  const resolve = useCallback(async (id: number) => {
    await alertasService.resolve(id);
    fetch();
  }, [fetch]);

  const criticos   = alertas.filter(a => a.severity === "critical" && !a.resolved_at).length;
  const atencao    = alertas.filter(a => (a.severity === "high" || a.severity === "medium") && !a.resolved_at).length;
  const resolvidos = alertas.filter(a => a.resolved_at).length;

  return { alertas, loading, error, resolve, criticos, atencao, resolvidos };
}

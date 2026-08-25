import { useEffect, useRef, useState } from "react";
import { leiturasService, type LeituraSensor } from "../services/leituras.service";

const POLL_MS = 10_000;
const ONLINE_THRESHOLD_MS = 30_000;
const MAX_POINTS = 30;

/**
 * Não conecta em nenhum dispositivo — só consulta periodicamente
 * GET /sensors/component/{id}/latest (nossa própria API, que lê do Postgres).
 * "online" é derivado da recência do timestamp da última leitura no banco,
 * já que o endpoint da máquina só fica disponível de forma intermitente.
 */
export function useLiveLeituras(componenteId: number, historico: LeituraSensor[] = []) {
  const [leituras, setLeituras] = useState<LeituraSensor[]>(historico);
  const [online, setOnline]     = useState(false);
  const lastTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (historico.length > 0) setLeituras(historico);
  }, [historico.length]);

  useEffect(() => {
    if (!componenteId) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const latest = await leiturasService.ultima(componenteId);
        if (cancelled) return;

        const isFresh = Date.now() - new Date(latest.timestamp).getTime() < ONLINE_THRESHOLD_MS;
        setOnline(isFresh);

        if (latest.timestamp !== lastTimestampRef.current) {
          lastTimestampRef.current = latest.timestamp;
          setLeituras(prev => {
            const next = [...prev, latest];
            return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
          });
        }
      } catch {
        if (!cancelled) setOnline(false);
      }
    };

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [componenteId]);

  return { leituras, online };
}

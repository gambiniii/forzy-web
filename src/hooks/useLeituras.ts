import { useEffect, useState } from "react";
import { leiturasService, type LeituraSensor } from "../services/leituras.service";

export function useLeituras(componenteId: number, params?: { inicio?: string; fim?: string; limit?: number; start?: string }) {
  const [leituras, setLeituras] = useState<LeituraSensor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!componenteId) return;
    leiturasService.list(componenteId, params)
      .then(data => setLeituras([...data].reverse())) // ascending por tempo
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [componenteId, params?.inicio, params?.fim, params?.limit, params?.start]);

  return { leituras, loading, error };
}

export function useUltimaLeitura(componenteId: number) {
  const [leitura, setLeitura] = useState<LeituraSensor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!componenteId) return;
    leiturasService.ultima(componenteId)
      .then(setLeitura)
      .catch((e: Error) => {
        if (!e.message.includes("404")) setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [componenteId]);

  return { leitura, loading, error };
}

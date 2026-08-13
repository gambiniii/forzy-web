import { useEffect, useState, useCallback } from "react";
import { plantasService, type Planta } from "../services/plantas.service";

export function usePlantas() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    plantasService.list()
      .then(setPlantas)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { plantas, loading, error, reload: fetch };
}

export function usePlanta(id: number) {
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    plantasService.get(id)
      .then(setPlanta)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { planta, loading, error };
}

import { useEffect, useState } from "react";
import { maquinasService, type Maquina } from "../services/maquinas.service";

export function useMaquinas() {
  const [maquinas, setMaquinas] = useState<Maquina[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    maquinasService.list()
      .then(setMaquinas)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { maquinas, loading, error };
}

export function useMaquina(id: number) {
  const [maquina, setMaquina] = useState<Maquina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    maquinasService.get(id)
      .then(setMaquina)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { maquina, loading, error };
}

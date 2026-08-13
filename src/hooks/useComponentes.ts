import { useEffect, useState } from "react";
import { componentesService, type Componente } from "../services/componentes.service";

export function useComponentes(maquinaId?: number) {
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    componentesService.list(maquinaId)
      .then(setComponentes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [maquinaId]);

  return { componentes, loading, error };
}

export function useComponente(id: number) {
  const [componente, setComponente] = useState<Componente | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    componentesService.get(id)
      .then(setComponente)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { componente, loading, error };
}

import { useEffect, useState } from "react";
import { manutencaoService, type Manutencao } from "../services/manutencao.service";

export function useManutencao(machine_id?: number) {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    manutencaoService.list(machine_id)
      .then(setManutencoes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [machine_id]);

  const urgentes    = manutencoes.filter(m => !m.completed_at && new Date(m.scheduled_at) <= new Date()).length;
  const programadas = manutencoes.filter(m => !m.completed_at && new Date(m.scheduled_at) > new Date()).length;
  const concluidas  = manutencoes.filter(m => !!m.completed_at).length;

  return { manutencoes, loading, error, urgentes, programadas, concluidas };
}

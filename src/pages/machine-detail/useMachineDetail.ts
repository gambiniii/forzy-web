import { useState, useEffect } from "react";
import { maquinasService } from "../../services/maquinas.service";
import type { Maquina } from "../../services/maquinas.service";
import { componentesService } from "../../services/componentes.service";
import type { Componente } from "../../services/componentes.service";
import { getValoresByComponente } from "../../services/componente.service";
import type { AtributoValor } from "../../services/componente.service";
import { listAnomalias } from "../../services/anomalias.service";
import type { Anomalia } from "../../services/anomalias.service";
import { useLeituras } from "../../hooks/useLeituras";
import { useWsLeituras } from "../../hooks/useWsLeituras";

export function useMachineDetail(id: string | undefined) {
  const [maquina, setMaquina] = useState<Maquina | null>(null);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [valoresPorComponente, setValoresPorComponente] = useState<Record<number, AtributoValor[]>>({});
  const [anomalias, setAnomalias] = useState<Anomalia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const componenteId = componentes[0]?.id ?? 0;
  const { leituras: leiturasHist } = useLeituras(componenteId, { limit: 30 });
  const { leituras, online, prediction } = useWsLeituras(componenteId, leiturasHist);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    maquinasService.get(Number(id))
      .then(async (m) => {
        setMaquina(m);
        const comps = await componentesService.list(Number(id));
        setComponentes(comps);
        const entries = await Promise.all(
          comps.map(async (c) => [c.id, await getValoresByComponente(c.id)] as [number, AtributoValor[]])
        );
        setValoresPorComponente(Object.fromEntries(entries));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!componenteId) return;
    listAnomalias(componenteId, 50)
      .then((data) => setAnomalias(Array.isArray(data) ? data : []))
      .catch((e) => console.error("listAnomalias:", e));
  }, [componenteId]);

  useEffect(() => {
    if (!prediction || !componenteId) return;
    listAnomalias(componenteId, 50)
      .then((data) => setAnomalias(Array.isArray(data) ? data : []))
      .catch((e) => console.error("listAnomalias:", e));
  }, [prediction, componenteId]);

  return {
    maquina, componentes, valoresPorComponente,
    anomalias, loading, error,
    leituras, online, prediction,
  };
}

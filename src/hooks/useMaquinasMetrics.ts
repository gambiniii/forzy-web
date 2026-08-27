import { useEffect, useRef, useState } from "react";
import { componentesService } from "../services/componentes.service";
import { leiturasService, type LeituraSensor } from "../services/leituras.service";

export interface MaquinaMetrics {
  temperatura: number | null;
  vibracao: number | null;
  corrente: number | null;
}

function extractMetrics(l: LeituraSensor): MaquinaMetrics {
  return {
    temperatura: l.temperature_port1 ?? l.temperature_port2 ?? l.temperatura,
    vibracao:    l.vibration_velocity_port1 ?? l.vibration_velocity_port2 ?? l.vibracao,
    corrente:    l.corrente,
  };
}

export function useMaquinasMetrics(maquinaIds: number[]) {
  const [metrics, setMetrics] = useState<Map<number, MaquinaMetrics>>(new Map());
  const key = maquinaIds.slice().sort().join(",");
  const prevKey = useRef<string>("");

  useEffect(() => {
    if (!maquinaIds.length || key === prevKey.current) return;
    prevKey.current = key;

    let cancelled = false;

    async function load() {
      try {
        // 1. todos os componentes de uma vez
        const componentes = await componentesService.list();

        // 2. agrupar por maquina_id (só das maquinas pedidas)
        const idSet = new Set(maquinaIds);
        const byMaquina = new Map<number, number[]>();
        for (const c of componentes) {
          if (!idSet.has(c.maquina_id)) continue;
          const arr = byMaquina.get(c.maquina_id) ?? [];
          arr.push(c.id);
          byMaquina.set(c.maquina_id, arr);
        }

        // 3. para cada maquina, última leitura do primeiro componente disponível
        const result = new Map<number, MaquinaMetrics>();
        await Promise.all(
          [...byMaquina.entries()].map(async ([maquinaId, compIds]) => {
            for (const cid of compIds) {
              try {
                const l = await leiturasService.ultima(cid);
                if (l) {
                  result.set(maquinaId, extractMetrics(l));
                  return;
                }
              } catch {
                // sem dado neste componente — tenta o próximo
              }
            }
          })
        );

        if (!cancelled) setMetrics(result);
      } catch {
        // silencioso — métricas ficam vazias
      }
    }

    load();
    return () => { cancelled = true; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return metrics;
}

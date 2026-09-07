import { useEffect, useState } from "react";
import { atribuicaoService, type Atribuicao } from "../../services/atribuicao.service";

/**
 * Busca a atribuição por componente dos modelos de novidade Forzy.
 *
 * É a fonte que faz uma peça do modelo 3D ficar vermelha por decisão de ML, e
 * não só por estouro de limite determinístico. As duas fontes coexistem:
 *   • `breached_metrics` do diagnóstico — regra determinística, auditável
 *   • esta atribuição — detector de novidade + z-score por feature
 *
 * Repolagem a cada 60 s, alinhada com o ciclo de diagnóstico do backend.
 */
const POLL_MS = 60_000;

export function useAtribuicao(componenteId: number | null) {
  const [atribuicao, setAtribuicao] = useState<Atribuicao | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!componenteId) {
      setAtribuicao(null);
      return;
    }
    let cancelado = false;

    const buscar = async () => {
      setCarregando(true);
      try {
        const r = await atribuicaoService.get(componenteId);
        if (!cancelado) setAtribuicao(r);
      } catch {
        // Endpoint indisponível ou modelos não treinados: o 3D simplesmente não
        // acende por ML. Silencioso de propósito — não é erro de operação.
        if (!cancelado) setAtribuicao(null);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    buscar();
    const t = setInterval(buscar, POLL_MS);
    return () => {
      cancelado = true;
      clearInterval(t);
    };
  }, [componenteId]);

  return { atribuicao, carregando };
}

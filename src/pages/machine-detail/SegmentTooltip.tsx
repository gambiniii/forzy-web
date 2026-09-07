import styled from "styled-components";
import type { SegmentTooltipData } from "./diagnosticoUtils";

/**
 * Card de hover do modelo 3D.
 *
 * Vive FORA do <Canvas> de propósito. O <Html> do drei escalaria o texto com o
 * zoom da câmera e seria recortado pela caixa do canvas quando a peça está na
 * borda; além disso ele usa pointerEvents:"none", o que impediria clicar no
 * botão. Aqui o card é HTML normal, posicionado pelo cursor.
 *
 * Dois modos, para não poluir a tela:
 *   • peça sem anomalia  → só nome, sistema funcional e o que ela faz
 *   • peça com anomalia  → acrescenta o problema, as causas prováveis, os
 *     componentes internos envolvidos e o botão que leva ao agente
 */

const Card = styled.div<{ $severidade?: "atencao" | "critico" }>`
  position: fixed;
  z-index: 9999;
  width: 300px;
  background: var(--bg1);
  border: 1px solid ${(p) =>
    p.$severidade === "critico" ? "var(--red)" :
    p.$severidade === "atencao" ? "var(--amber)" : "var(--border-md)"};
  border-radius: var(--radius);
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text1);
`;

const Head = styled.div<{ $severidade?: "atencao" | "critico" }>`
  padding: 9px 12px;
  background: ${(p) =>
    p.$severidade === "critico" ? "color-mix(in srgb, var(--red) 16%, var(--bg2))" :
    p.$severidade === "atencao" ? "color-mix(in srgb, var(--amber) 16%, var(--bg2))" : "var(--bg2)"};
  border-bottom: 1px solid var(--border);
`;

const Titulo = styled.div`
  font-weight: 650;
  font-size: 13px;
  color: var(--text1);
`;

const Grupo = styled.div`
  margin-top: 2px;
  font-size: 10.5px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text3);
  font-family: var(--mono, monospace);
`;

const Body = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Descricao = styled.p`
  margin: 0;
  color: var(--text2);
`;

const Bloco = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Rotulo = styled.div`
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text3);
  font-family: var(--mono, monospace);
`;

const Problema = styled.div<{ $severidade: "atencao" | "critico" }>`
  color: ${(p) => (p.$severidade === "critico" ? "var(--red)" : "var(--amber)")};
  font-weight: 550;
`;

const Lista = styled.ul`
  margin: 0;
  padding-left: 15px;
  color: var(--text2);
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const CausaNome = styled.span`
  color: var(--text1);
  font-weight: 550;
`;

const Tag = styled.span<{ $precoce: boolean }>`
  margin-left: 5px;
  padding: 0 5px;
  border-radius: 3px;
  font-size: 9.5px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-family: var(--mono, monospace);
  color: ${(p) => (p.$precoce ? "var(--success)" : "var(--text3)")};
  border: 1px solid ${(p) => (p.$precoce ? "var(--success)" : "var(--border-md)")};
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Chip = styled.span`
  padding: 2px 7px;
  border-radius: 10px;
  background: var(--bg3);
  border: 1px solid var(--border);
  color: var(--text2);
  font-size: 10.5px;
`;

const Acao = styled.button`
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--blue);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--blue) 14%, transparent);
  color: var(--blue);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--blue) 26%, transparent);
  }
`;

const Dica = styled.div`
  font-size: 10.5px;
  color: var(--text3);
  font-style: italic;
`;

export interface SegmentTooltipProps {
  data: SegmentTooltipData;
  x: number;
  y: number;
  onExplicar: (pergunta: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SegmentTooltip({
  data, x, y, onExplicar, onMouseEnter, onMouseLeave,
}: SegmentTooltipProps) {
  const sev = data.anomalia?.severidade;

  // Mantém o card dentro da janela: se não couber à direita ou abaixo, joga para
  // o outro lado do cursor.
  const LARGURA = 300;
  const ALTURA_EST = data.anomalia ? 340 : 150;
  const left = x + 16 + LARGURA > window.innerWidth ? Math.max(8, x - LARGURA - 16) : x + 16;
  const top = y + 16 + ALTURA_EST > window.innerHeight ? Math.max(8, y - ALTURA_EST - 8) : y + 16;

  return (
    <Card
      $severidade={sev}
      style={{ left, top }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Head $severidade={sev}>
        <Titulo>{data.titulo}</Titulo>
        <Grupo>{data.grupo}</Grupo>
      </Head>

      <Body>
        <Descricao>{data.descricao}</Descricao>

        {data.anomalia && (
          <>
            <Bloco>
              <Rotulo>Problema detectado</Rotulo>
              <Problema $severidade={data.anomalia.severidade}>
                {data.anomalia.mensagem}
              </Problema>
            </Bloco>

            {data.anomalia.causasProvaveis.length > 0 && (
              <Bloco>
                <Rotulo>Causas prováveis</Rotulo>
                <Lista>
                  {data.anomalia.causasProvaveis.map((c) => (
                    <li key={c.nome}>
                      <CausaNome>{c.nome}</CausaNome>
                      <Tag $precoce={c.precocidade === "precoce"}>
                        {c.precocidade === "precoce" ? "sinal precoce" : "sinal tardio"}
                      </Tag>
                    </li>
                  ))}
                </Lista>
              </Bloco>
            )}
          </>
        )}

        {data.componentesInternos.length > 0 && (
          <Bloco>
            <Rotulo>
              {data.anomalia ? "Componentes possivelmente envolvidos" : "Componentes que esta peça abriga"}
            </Rotulo>
            <Chips>
              {data.componentesInternos.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </Chips>
          </Bloco>
        )}

        {data.anomalia?.grupoAtribuicao && (
          <Dica>
            Atribuição no nível de grupo funcional: {data.anomalia.grupoAtribuicao}. Um único
            sensor por motor não isola a peça exata.
          </Dica>
        )}

        <Acao type="button" onClick={() => onExplicar(data.perguntaAgente)}>
          Explicar com o agente
        </Acao>
      </Body>
    </Card>
  );
}

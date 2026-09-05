import { Modal } from "../../components/ui/Modal/Modal";
import { SpecRow } from "../../components/ui/SpecRow";
import type { useMachineDetail } from "./useMachineDetail";

function NameplateSpecs({ componentes }: {
  componentes: ReturnType<typeof useMachineDetail>["componentes"];
}) {
  const esp = componentes[0]?.especificacao_motor;
  if (!esp) return null;

  const rows: [string, string | number | null | undefined, string][] = [
    ["Potência",    esp.potencia_kw,      "kW"],
    ["Tensão",      esp.tensao_nominal,   "V"],
    ["Corrente",    esp.corrente_nominal, "A"],
    ["Rotação",     esp.rpm_nominal,      "rpm"],
    ["Frequência",  esp.frequencia_hz,    "Hz"],
    ["Nº de polos", esp.numero_polos,     ""],
    ["Rendimento",  esp.rendimento,       "%"],
  ];
  const filled = rows.filter(([, value]) => value !== null && value !== undefined);
  if (filled.length === 0) return null;

  return (
    <div>
      <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text3)", textTransform: "uppercase" }}>
        Placa de identificação
      </div>
      {filled.map(([label, value, unit]) => (
        <SpecRow key={label} label={label} value={unit ? `${value} ${unit}` : String(value)} />
      ))}
    </div>
  );
}

function ComponenteSpecs({ componentes, valoresPorComponente }: {
  componentes: ReturnType<typeof useMachineDetail>["componentes"];
  valoresPorComponente: ReturnType<typeof useMachineDetail>["valoresPorComponente"];
}) {
  if (componentes.length === 0) {
    return <p style={{ color: "var(--text3)", padding: 16, fontSize: 13 }}>Sem componentes cadastrados.</p>;
  }

  return (
    <>
      {componentes.map((comp) => {
        const valores = valoresPorComponente[comp.id] ?? [];
        return (
          <div key={comp.id}>
            <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text3)", textTransform: "uppercase" }}>
              {comp.nome}
              {comp.tipo && <span style={{ fontWeight: 400, marginLeft: 6 }}>· {comp.tipo}</span>}
            </div>
            {valores.map((v) => {
              const val = v.valor_string ?? (v.valor_float !== null ? String(v.valor_float) : null) ?? (v.valor_int !== null ? String(v.valor_int) : "—");
              const label = v.atributo?.nome ?? `Atributo ${v.atributo_id}`;
              const unit  = v.atributo?.unidade ?? "";
              return <SpecRow key={v.id} label={label} value={unit ? `${val} ${unit}` : val} />;
            })}
          </div>
        );
      })}
    </>
  );
}

interface Props {
  componentes: ReturnType<typeof useMachineDetail>["componentes"];
  valoresPorComponente: ReturnType<typeof useMachineDetail>["valoresPorComponente"];
  open: boolean;
  onClose: () => void;
}

export function EspecificacoesModal({ componentes, valoresPorComponente, open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Especificações Técnicas" size="md">
      <NameplateSpecs componentes={componentes} />
      <ComponenteSpecs componentes={componentes} valoresPorComponente={valoresPorComponente} />
    </Modal>
  );
}

import { Modal } from "../../components/ui/Modal/Modal";
import { SpecRow } from "../../components/ui/SpecRow";
import type { Maquina } from "../../services/maquinas.service";

const STATUS_LABEL: Record<string, string> = {
  active: "Online",
  maintenance: "Manutenção",
  inactive: "Inativo",
};

interface Props {
  maquina: Maquina;
  open: boolean;
  onClose: () => void;
}

export function IdentificacaoModal({ maquina, open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Identificação" size="sm">
      <SpecRow label="ID"          value={String(maquina.id)} />
      <SpecRow label="Nome"        value={maquina.nome} />
      <SpecRow label="Tipo"        value={maquina.tipo ?? "—"} />
      <SpecRow label="Fabricante"  value={maquina.fabricante ?? "—"} />
      <SpecRow label="Instalação"  value={maquina.ano_instalacao ? String(maquina.ano_instalacao) : "—"} />
      <SpecRow label="Status"      value={STATUS_LABEL[maquina.status] ?? maquina.status} />
    </Modal>
  );
}

import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal/Modal";
import { Input } from "../ui/Input/Input";
import { Button } from "../ui/Button";
import { plantasService, type Planta, type PlantaCreate } from "../../services/plantas.service";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  planta?: Planta;
}

const EMPTY: PlantaCreate = { nome: "", localizacao: null, cidade: null, estado: null, ativo: true };

export function PlantaModal({ open, onClose, onSaved, planta }: Props) {
  const isEdit = !!planta;
  const [form, setForm] = useState<PlantaCreate>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(planta
        ? { nome: planta.nome, localizacao: planta.localizacao, cidade: planta.cidade, estado: planta.estado, ativo: planta.ativo }
        : EMPTY
      );
      setError(null);
    }
  }, [open, planta]);

  function set(field: keyof PlantaCreate, value: string | boolean | null) {
    setForm(f => ({ ...f, [field]: value || null }));
  }

  async function handleSave() {
    if (!form.nome.trim()) { setError("Nome é obrigatório."); return; }
    setLoading(true);
    setError(null);
    try {
      if (isEdit && planta) {
        await plantasService.update(planta.id, form);
      } else {
        await plantasService.create(form);
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Planta" : "Nova Planta"}
      subtitle={isEdit ? `Editando "${planta?.nome}"` : "Preencha os dados da nova planta industrial"}
      size="sm"
      footer={
        <>
          <Button onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar planta"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input
          label="Nome *"
          placeholder="Ex: Planta São Paulo"
          value={form.nome}
          onChange={e => set("nome", e.target.value)}
        />

        <Input
          label="Logradouro / Bairro"
          placeholder="Ex: Av. Industrial, 1500"
          value={form.localizacao ?? ""}
          onChange={e => set("localizacao", e.target.value)}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
          <Input
            label="Cidade"
            placeholder="Ex: Campinas"
            value={form.cidade ?? ""}
            onChange={e => set("cidade", e.target.value)}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>Estado</label>
            <select
              value={form.estado ?? ""}
              onChange={e => set("estado", e.target.value)}
              style={{
                height: 36,
                padding: "0 10px",
                background: "var(--bg3)",
                border: "1px solid var(--border-md)",
                borderRadius: "var(--radius)",
                color: form.estado ? "var(--text1)" : "var(--text3)",
                fontSize: 13,
                fontFamily: "inherit",
                cursor: "pointer",
                width: 72,
              }}
            >
              <option value="">UF</option>
              {ESTADOS.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => set("ativo", !form.ativo)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              border: "none",
              background: form.ativo ? "var(--green)" : "var(--bg4)",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <span style={{
              position: "absolute",
              top: 3,
              left: form.ativo ? 18 : 3,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.2s",
            }} />
          </button>
          <span style={{ fontSize: 13, color: "var(--text2)" }}>
            Planta {form.ativo ? "ativa" : "inativa"}
          </span>
        </div>

        {error && (
          <p style={{ fontSize: 12, color: "var(--red)", margin: 0 }}>{error}</p>
        )}
      </div>
    </Modal>
  );
}

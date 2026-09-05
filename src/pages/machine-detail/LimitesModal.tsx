import { useEffect, useState } from "react";
import { Modal } from "../../components/ui/Modal/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button";
import { limitesService } from "../../services/limites.service";

interface Props {
  componenteId: number;
  open: boolean;
  onClose: () => void;
  canEdit: boolean;
}

/** Configuração de Limites (Metric Contract, CS3 §7) — thresholds de
 * vibração/temperatura que classificam o motor em NOMINAL/ATENÇÃO/CRÍTICO,
 * independente do diagnóstico estatístico de ML. */
export function LimitesModal({ componenteId, open, onClose, canEdit }: Props) {
  const [vibAtencao, setVibAtencao]   = useState("");
  const [vibCritico, setVibCritico]   = useState("");
  const [tempAtencao, setTempAtencao] = useState("");
  const [tempCritico, setTempCritico] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    limitesService.get(componenteId)
      .then((l) => {
        setVibAtencao(String(l.vib_atencao));
        setVibCritico(String(l.vib_critico));
        setTempAtencao(String(l.temp_atencao));
        setTempCritico(String(l.temp_critico));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, componenteId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await limitesService.update(componenteId, {
        vib_atencao: Number(vibAtencao),
        vib_critico: Number(vibCritico),
        temp_atencao: Number(tempAtencao),
        temp_critico: Number(tempCritico),
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar limites.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configuração de Limites"
      subtitle="Metric Contract — thresholds de vibração e temperatura (ISO 10816-1)"
      size="sm"
      footer={
        canEdit ? (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Fechar</Button>
        )
      }
    >
      {!canEdit && (
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
          Alterar os limiares do Metric Contract exige perfil Administrador — você pode visualizar, não editar.
        </p>
      )}
      {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      {loading ? (
        <p style={{ fontSize: 13, color: "var(--text3)" }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input
            label="Vibração — Atenção (mm/s)"
            type="number" step="0.1"
            value={vibAtencao} onChange={(e) => setVibAtencao(e.target.value)}
            disabled={!canEdit}
          />
          <Input
            label="Vibração — Crítico (mm/s)"
            type="number" step="0.1"
            value={vibCritico} onChange={(e) => setVibCritico(e.target.value)}
            disabled={!canEdit}
          />
          <Input
            label="Temperatura — Atenção (°C)"
            type="number" step="1"
            value={tempAtencao} onChange={(e) => setTempAtencao(e.target.value)}
            disabled={!canEdit}
          />
          <Input
            label="Temperatura — Crítico (°C)"
            type="number" step="1"
            value={tempCritico} onChange={(e) => setTempCritico(e.target.value)}
            disabled={!canEdit}
          />
        </div>
      )}
    </Modal>
  );
}

import { useState } from "react";
import { Modal } from "../../components/ui/Modal/Modal";
import { Textarea } from "../../components/ui/Input/Input";
import { Button } from "../../components/ui/Button";
import { auditLogService } from "../../services/auditLog.service";

interface Props {
  target: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

/** Handoff humano (CS3 §9.4) — a IA recomenda, o humano decide e o registro
 * de autoria fica salvo em audit_log. Não dispara nenhuma ação no motor. */
export function HandoffModal({ target, open, onClose, onSaved }: Props) {
  const [justification, setJustification] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setSaving(true);
    setError(null);
    try {
      await auditLogService.create({
        action: "aprovar_acao_critica",
        target,
        justification: justification.trim() || undefined,
      });
      setJustification("");
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao registrar decisão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar decisão"
      subtitle="Handoff humano — aprovação de ação crítica"
      size="sm"
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button variant="primary" onClick={handleApprove} disabled={saving}>
            {saving ? "Registrando..." : "Aprovar ação"}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12, lineHeight: 1.5 }}>
        A IA recomenda a ação, mas não executa nenhuma parada sozinha. Registrar aqui grava
        seu usuário, o horário e a justificativa como a decisão de autoria humana.
      </p>
      {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}
      <Textarea
        label="Justificativa (opcional)"
        rows={3}
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
      />
    </Modal>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { maquinasService } from "../../services/maquinas.service";
import { PageWrapper, FormGrid, FieldGrid, FormActions } from "./EquipmentForm.styles";

const STATUS_OPTIONS = [
  { value: "active",      label: "Online" },
  { value: "maintenance", label: "Manutenção" },
  { value: "inactive",    label: "Inativo" },
];

const TIPO_OPTIONS = [
  "Motor Elétrico",
  "Bomba Industrial",
  "Compressor",
  "Redutor",
  "Outro",
];

export function EquipmentFormScreen() {
  const { goTo, goBack } = useNavigation();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const [nome, setNome]             = useState("");
  const [tipo, setTipo]             = useState("");
  const [fabricante, setFabricante] = useState("");
  const [anoInst, setAnoInst]       = useState("");
  const [status, setStatus]         = useState<"active" | "inactive" | "maintenance">("active");

  useEffect(() => {
    if (!isEdit || !id) return;
    maquinasService.get(Number(id))
      .then((m) => {
        setNome(m.nome);
        setTipo(m.tipo ?? "");
        setFabricante(m.fabricante ?? "");
        setAnoInst(m.ano_instalacao ? String(m.ano_instalacao) : "");
        setStatus(m.status);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!nome.trim()) { setError("Nome é obrigatório."); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        nome: nome.trim(),
        tipo: tipo || undefined,
        fabricante: fabricante || undefined,
        ano_instalacao: anoInst ? Number(anoInst) : undefined,
        status,
        planta_id: 1, // única planta cadastrada hoje (Forzy - Promon)
      };
      const result = isEdit
        ? await maquinasService.update(Number(id), payload)
        : await maquinasService.create(payload);
      goTo("machine-detail", result.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "Editar Equipamento" : "Cadastrar Equipamento"}
        sub="Preencha os dados do equipamento"
      />

      {error && (
        <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 8 }}>{error}</p>
      )}

      <FormGrid>
        <Card>
          <CardHeader title="Identificação" />
          <CardBody style={{ display: "flex", flexDirection: "column", gap: 16, padding: 20 }}>
            <Input
              label="Nome / Descrição *"
              placeholder="Ex: Sistema de Bombeamento 01"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <FieldGrid>
              <Select
                label="Tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Selecione...</option>
                {TIPO_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              <Input
                label="Fabricante"
                placeholder="Ex: WEG"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
              />
            </FieldGrid>
            <Input
              label="Ano de Instalação"
              type="number"
              placeholder="Ex: 2024"
              value={anoInst}
              onChange={(e) => setAnoInst(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Select>
          </CardBody>
        </Card>
      </FormGrid>

      <FormActions>
        <Button onClick={goBack}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : isEdit ? "Salvar Alterações" : "Cadastrar Equipamento"}
        </Button>
      </FormActions>
    </PageWrapper>
  );
}

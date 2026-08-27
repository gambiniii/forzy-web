import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { maquinasService } from "../../services/maquinas.service";
import { plantasService } from "../../services/plantas.service";
import type { Planta } from "../../services/plantas.service";
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
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const [loading, setLoading]   = useState(isEdit);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [plantas, setPlantas]   = useState<Planta[]>([]);

  const [nome, setNome]     = useState("");
  const [tipo, setTipo]     = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "maintenance">("active");
  const [plantaId, setPlantaId] = useState<number | "">(
    searchParams.get("planta_id") ? Number(searchParams.get("planta_id")) : ""
  );

  // Carregar lista de plantas para o seletor
  useEffect(() => {
    plantasService.list().then(setPlantas).catch(() => {});
  }, []);

  // Pré-popular campos no modo edição
  useEffect(() => {
    if (!isEdit || !id) return;
    maquinasService.get(Number(id))
      .then((m) => {
        setNome(m.nome);
        setTipo(m.tipo ?? "");
        setStatus(m.status);
        setPlantaId(m.planta_id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!nome.trim()) { setError("Nome é obrigatório."); return; }
    if (!plantaId)    { setError("Selecione uma planta."); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        nome:     nome.trim(),
        tipo:     tipo || undefined,
        status,
        planta_id: Number(plantaId),
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
        back
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
              placeholder="Ex: Motor WEG W22 — Linha 1"
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

              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </FieldGrid>

            <Select
              label="Planta *"
              value={plantaId}
              onChange={(e) => setPlantaId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Selecione uma planta...</option>
              {plantas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
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

import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { MetricCard } from "../../components/ui/MetricCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatusPill } from "../../components/ui/StatusPill";
import { Button } from "../../components/ui/Button";
import { AlertItem } from "../../components/ui/AlertItem";
import { Select } from "../../components/ui/Input/Input";
import { PageHeader } from "../../components/ui/PageHeader";
import { Spinner } from "../../components/ui/Spinner";
import { useAlertas } from "../../hooks/useAlertas";
import { SEV_ITEM, SEV_VARIANT, SEV_LABEL } from "../../utils/constants/severity";
import { fmtTime } from "../../utils/formatters";
import {
  PageWrapper, ContentStack, MetricsGrid,
  HeaderActions, AlertRightSlot, AlertTime,
} from "./AlertsScreen.styles";

export function AlertsScreen() {
  const { goTo } = useNavigation();
  const [severidadeFiltro, setSeveridadeFiltro] = useState("Todos");
  const { alertas, loading, error, resolve, criticos, atencao, resolvidos } = useAlertas();

  const ativos    = alertas.filter(a => !a.resolved_at);
  const historico = alertas.filter(a => !!a.resolved_at);

  const filtrados = ativos.filter(a => {
    if (severidadeFiltro === "Todos")   return true;
    if (severidadeFiltro === "Crítico") return a.severity === "critical";
    if (severidadeFiltro === "Atenção") return a.severity === "high" || a.severity === "medium";
    if (severidadeFiltro === "Info")    return a.severity === "low";
    return true;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Alertas e Falhas"
        sub={`${ativos.length} ativos · ${criticos} crítico(s) · ${atencao} em atenção`}
        right={
          <HeaderActions>
            <Select
              style={{ width: 140, fontSize: 12, padding: "6px 10px" }}
              value={severidadeFiltro}
              onChange={e => setSeveridadeFiltro((e.target as HTMLSelectElement).value)}
            >
              <option>Todos</option>
              <option>Crítico</option>
              <option>Atenção</option>
              <option>Info</option>
            </Select>
            <Button>Reconhecer todos</Button>
          </HeaderActions>
        }
      />

      <ContentStack>
        <MetricsGrid>
          <MetricCard label="Críticos"       value={String(criticos)}                       variant="red"   />
          <MetricCard label="Atenção"         value={String(atencao)}                        variant="amber" />
          <MetricCard label="Informativos"    value={String(ativos.filter(a => a.severity === "low").length)} variant="blue"  />
          <MetricCard label="Resolvidos"      value={String(resolvidos)}                     variant="green" />
        </MetricsGrid>

        <Card>
          <CardHeader title={`Alertas Ativos (${filtrados.length})`} />
          {loading && <Spinner />}
          {error   && <p style={{ color: "var(--red)", padding: 16 }}>{error}</p>}
          {!loading && filtrados.length === 0 && (
            <p style={{ color: "var(--text3)", padding: 16 }}>Nenhum alerta ativo.</p>
          )}
          {filtrados.map(a => (
            <AlertItem
              key={a.id}
              severity={SEV_ITEM[a.severity] ?? "info"}
              title={a.message}
              detail={a.anomaly_score != null ? `Score: ${a.anomaly_score.toFixed(2)}` : ""}
              time={fmtTime(a.created_at)}
              onClick={() => goTo("diagnosis")}
              right={
                <AlertRightSlot>
                  <AlertTime>{fmtTime(a.created_at)}</AlertTime>
                  <StatusPill variant={SEV_VARIANT[a.severity] ?? "blue"}>
                    {SEV_LABEL[a.severity] ?? a.severity}
                  </StatusPill>
                  <Button
                    style={{ fontSize: 10, padding: "3px 8px" }}
                    onClick={e => { e.stopPropagation(); resolve(a.id); }}
                  >
                    Resolver
                  </Button>
                </AlertRightSlot>
              }
            />
          ))}
        </Card>

        {historico.length > 0 && (
          <Card>
            <CardHeader title="Histórico Recente" />
            {historico.slice(0, 5).map(a => (
              <AlertItem
                key={a.id}
                severity="ok"
                title={a.message}
                detail={`Resolvido em ${fmtTime(a.resolved_at!)}`}
                time={fmtTime(a.created_at)}
              />
            ))}
          </Card>
        )}
      </ContentStack>
    </PageWrapper>
  );
}

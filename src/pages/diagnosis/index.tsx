import { useNavigation } from "../../context/NavigationContext";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { AiBubble, AiHighlight } from "../../components/ui/AiBubble";
import { ProbaRow } from "../../components/ui/ProbaRow";
import { Button } from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PageWrapper, Stack, TwoCol, TimelinePad,
  TimelineItem, TimelineDotCol, TimelineDot, TimelineConnector,
  TimelineBody, TimelineTitle, TimelineSub, TimelineTime,
  ActionTable, ActionTh, ActionTd,
} from "./Diagnosis.styles";
import { timelineItems, actionPlan } from "./Diagnosis.types";

export function DiagnosisScreen() {
  const { goTo } = useNavigation();

  return (
    <PageWrapper>
      <PageHeader title="Diagnóstico Inteligente" sub="M-07 · Análise IA · Modelo v3.1 · Confiança: 87%" />

      <Stack>
        <AiBubble title="Diagnóstico Principal" confidence="Modelo v3.1 · 87% confiança · Analisado às 08:51">
          O padrão espectral do sensor VIB-Y indica{" "}
          <AiHighlight>desgaste em pista externa (BPFO)</AiHighlight> do rolamento dianteiro DE. O pico
          característico em <AiHighlight>142 Hz</AiHighlight> corresponde à frequência esperada para o
          rolamento <AiHighlight>6205 2Z C3</AiHighlight> operando a 1.760 RPM. A progressão da amplitude
          nos últimos <AiHighlight>14 dias</AiHighlight> indica falha iminente. Recomendo substituição em até 48 horas.
        </AiBubble>

        <TwoCol>
          <Card>
            <CardHeader title="Probabilidade por Causa" />
            <CardBody>
              <ProbaRow label="Desgaste Rolamento DE"    percent={87} />
              <ProbaRow label="Desbalanceamento do rotor" percent={7}  />
              <ProbaRow label="Problema de alinhamento"  percent={4}  />
              <ProbaRow label="Soltura mecânica"         percent={2}  />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Histórico de Diagnósticos" />
            <TimelinePad>
              {timelineItems.map((item, i) => (
                <TimelineItem key={i}>
                  <TimelineDotCol>
                    <TimelineDot $color={item.color} />
                    {i < timelineItems.length - 1 && <TimelineConnector />}
                  </TimelineDotCol>
                  <TimelineBody>
                    <TimelineTitle>{item.title}</TimelineTitle>
                    <TimelineSub>{item.sub}</TimelineSub>
                    <TimelineTime>{item.time}</TimelineTime>
                  </TimelineBody>
                </TimelineItem>
              ))}
            </TimelinePad>
          </Card>
        </TwoCol>

        <Card>
          <CardHeader title="Plano de Ação Recomendado" />
          <CardBody>
            <ActionTable>
              <thead>
                <tr>{["Prioridade", "Ação", "Prazo", "Responsável", ""].map((h) => <ActionTh key={h}>{h}</ActionTh>)}</tr>
              </thead>
              <tbody>
                {actionPlan.map((row, i) => (
                  <tr key={i}>
                    <ActionTd><StatusPill variant={row.priority as "red" | "amber"}>{row.priority === "red" ? "URGENTE" : "NORMAL"}</StatusPill></ActionTd>
                    <ActionTd><strong style={{ color: "var(--text1)", fontWeight: 500 }}>{row.action}</strong></ActionTd>
                    <ActionTd $mono>{row.deadline}</ActionTd>
                    <ActionTd>{row.responsible}</ActionTd>
                    <ActionTd>
                      <Button variant={row.priority === "red" ? "danger" : "default"} style={{ fontSize: 10, padding: "3px 10px" }}
                        onClick={() => row.btnLabel === "Abrir OS" && goTo("maintenance")}>
                        {row.btnLabel}
                      </Button>
                    </ActionTd>
                  </tr>
                ))}
              </tbody>
            </ActionTable>
          </CardBody>
        </Card>
      </Stack>
    </PageWrapper>
  );
}

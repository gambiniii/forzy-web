import { useNavigation } from "../../context/NavigationContext";
import { StatusPill } from "../../components/ui/StatusPill";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PageWrapper, ComponentsGrid, ComponentCard, CardTop, IconBox,
  CompName, CompType, Divider, MetricsRow, MetricCell, MetricValue, MetricLabel,
} from "./Components.styles";
import { components } from "./Components.types";

export function ComponentsScreen() {
  const { goTo } = useNavigation();

  return (
    <PageWrapper>
      <PageHeader title="Componentes da Máquina" sub="M-07 · Motor Siemens 1LE0022-0EB4" />

      <ComponentsGrid>
        {components.map((comp) => (
          <ComponentCard key={comp.name} $status={comp.status} onClick={() => goTo("component-analysis")}>
            <CardTop>
              <IconBox>{comp.icon}</IconBox>
              <StatusPill variant={comp.status}>{comp.statusLabel}</StatusPill>
            </CardTop>
            <CompName>{comp.name}</CompName>
            <CompType>{comp.type}</CompType>
            <Divider />
            <MetricsRow>
              {comp.metrics.map((m) => (
                <MetricCell key={m.label}>
                  <MetricValue $color={m.color}>{m.val}</MetricValue>
                  <MetricLabel>{m.label}</MetricLabel>
                </MetricCell>
              ))}
            </MetricsRow>
          </ComponentCard>
        ))}
      </ComponentsGrid>
    </PageWrapper>
  );
}

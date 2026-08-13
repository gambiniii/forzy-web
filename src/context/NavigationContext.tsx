import { useNavigate, useLocation } from "react-router-dom";

export type ScreenKey =
  | "login"
  | "dashboard"
  | "plants"
  | "machinery"
  | "realtime"
  | "history"
  | "health"
  | "components"
  | "component-analysis"
  | "alerts"
  | "diagnosis"
  | "maintenance"
  | "assistant"
  | "qr"
  | "machine-detail"
  | "equipment-form"
  | "reports";

export const SCREEN_PATHS: Record<ScreenKey, string> = {
  login:                "/",
  dashboard:            "/dashboard",
  plants:               "/plants",
  machinery:            "/machinery",
  realtime:             "/machinery/realtime",
  history:              "/machinery/history",
  health:               "/machinery/health",
  components:           "/machinery/components",
  "component-analysis": "/machinery/component-analysis",
  alerts:               "/machinery/alerts",
  diagnosis:            "/machinery/diagnosis",
  maintenance:          "/machinery/maintenance",
  assistant:            "/machinery/assistant",
  qr:                   "/qr",
  "machine-detail":     "/machinery/machine-detail",
  "equipment-form":     "/machinery/equipment-form",
  reports:              "/machinery/reports",
};

const PATH_TO_KEY = Object.fromEntries(
  Object.entries(SCREEN_PATHS).map(([k, v]) => [v, k as ScreenKey])
) as Record<string, ScreenKey>;

export const screenLabels: Record<ScreenKey, string> = {
  login:                "Login",
  dashboard:            "Dashboard",
  plants:               "Gestão de Plantas",
  machinery:            "Maquinário",
  realtime:             "Tempo Real",
  history:              "Histórico",
  health:               "Saúde",
  components:           "Componentes",
  "component-analysis": "Análise por Componente",
  alerts:               "Alertas e Falhas",
  diagnosis:            "Diagnóstico IA",
  maintenance:          "Manutenção Preditiva",
  assistant:            "Assistente IA",
  qr:                   "Leitura QR Code",
  "machine-detail":     "Detalhes Técnicos",
  "equipment-form":     "Cadastro / Edição",
  reports:              "Relatórios",
};

export const screenBreadcrumbs = screenLabels;

// Root screens clear the navigation history (sidebar items)
export const ROOT_SCREENS: ScreenKey[] = ["dashboard", "plants", "machinery"];

// Hook that wraps react-router and keeps the same API used across the app
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const current: ScreenKey = PATH_TO_KEY[location.pathname] ?? "dashboard";
  const canGoBack = location.key !== "default";

  function goTo(screen: ScreenKey, id?: number | string) {
    let path = SCREEN_PATHS[screen];
    if (id !== undefined) path = `${path}/${id}`;
    if (ROOT_SCREENS.includes(screen)) {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  }

  function goBack() {
    navigate(-1);
  }

  return { current, canGoBack, goTo, goBack };
}

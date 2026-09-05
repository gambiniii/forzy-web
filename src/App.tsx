import "./styles/globals.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui/Toast/ToastProvider";
import { AppShell } from "./components/layout/AppShell";

import { LoginScreen }             from "./pages/login";
import { DashboardScreen }         from "./pages/dashboard";
import { PlantsScreen }            from "./pages/plants";
import { MachineryScreen }         from "./pages/machinery";
import { MachineDetailScreen }     from "./pages/machine-detail";
import { RealtimeScreen }          from "./pages/realtime";
import { HistoryScreen }           from "./pages/history";
import { HealthScreen }            from "./pages/health";
import { ComponentsScreen }        from "./pages/components";
import { ComponentAnalysisScreen } from "./pages/component-analysis";
import { AlertsScreen }            from "./pages/alert";
import { DiagnosisScreen }         from "./pages/diagnosis";
import { MaintenanceScreen }       from "./pages/maintenance";
import { AssistantScreen }         from "./pages/assistant";
import { EquipmentFormScreen }     from "./pages/equipment-form";
import { ReportsScreen }           from "./pages/reports";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/"                           element={<LoginScreen />} />
            <Route path="/dashboard"                  element={<DashboardScreen />} />
            <Route path="/plants"                     element={<PlantsScreen />} />
            <Route path="/machinery"                  element={<MachineryScreen />} />
            <Route path="/machinery/machine-detail/:id" element={<MachineDetailScreen />} />
            <Route path="/machinery/realtime"         element={<RealtimeScreen />} />
            <Route path="/machinery/history"          element={<HistoryScreen />} />
            <Route path="/machinery/health"           element={<HealthScreen />} />
            <Route path="/machinery/components"       element={<ComponentsScreen />} />
            <Route path="/machinery/component-analysis" element={<ComponentAnalysisScreen />} />
            <Route path="/machinery/alerts"           element={<AlertsScreen />} />
            <Route path="/machinery/diagnosis"        element={<DiagnosisScreen />} />
            <Route path="/machinery/maintenance"      element={<MaintenanceScreen />} />
            <Route path="/machinery/assistant"        element={<AssistantScreen />} />
            <Route path="/machinery/equipment-form"      element={<EquipmentFormScreen />} />
            <Route path="/machinery/equipment-form/:id"  element={<EquipmentFormScreen />} />
            <Route path="/machinery/reports"          element={<ReportsScreen />} />
            <Route path="*"                           element={<Navigate to="/plants" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

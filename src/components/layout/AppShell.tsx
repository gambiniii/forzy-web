import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Topbar } from "./Topbar";
import { ShellRoot, ShellContent } from "./Layout.styles";
import { AssistantFab } from "../../pages/assistant/Assistant.styles";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLogin = pathname === "/";
  const isAssistant = pathname === "/machinery/assistant";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <ShellRoot>
      <Topbar />
      <ShellContent>{children}</ShellContent>

      {!isAssistant && (
        <AssistantFab
          onClick={() => navigate("/machinery/assistant")}
          title="Abrir Assistente IA"
          aria-label="Assistente IA"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 017 7c0 3.5-2 6-5 7l-2 4-2-4c-3-1-5-3.5-5-7a7 7 0 017-7z"/>
            <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </AssistantFab>
      )}
    </ShellRoot>
  );
}

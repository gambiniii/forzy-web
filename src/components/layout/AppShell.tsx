import React from "react";
import { useLocation } from "react-router-dom";
import { Topbar } from "./Topbar";
import { ShellRoot, ShellContent } from "./Layout.styles";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const isLogin = pathname === "/";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <ShellRoot>
      <Topbar />
      <ShellContent>{children}</ShellContent>
    </ShellRoot>
  );
}

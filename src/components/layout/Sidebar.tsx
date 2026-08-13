import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigation, SCREEN_PATHS } from "../../context/NavigationContext";
import type { ScreenKey } from "../../context/NavigationContext";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  SidebarRoot, SidebarLogoArea, SidebarLogoIcon, SidebarLogoText, SidebarVersion,
  SidebarNav, NavItemRow, NavIconWrap,
  SidebarFooter, UserCard, SidebarAvatar, UserCardName, UserCardRole,
} from "./Layout.styles";

interface NavItem {
  key: ScreenKey;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    key: "plants",
    label: "Gestão de Plantas",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
        <path d="M2 12V5l5-3 5 3v7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 12V9h4v3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    key: "machinery",
    label: "Maquinário",
    icon: (
      <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 2v1M7 11v1M2 7h1M11 7h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { goTo } = useNavigation();
  const { pathname } = useLocation();
  const { user, initials } = useCurrentUser();

  return (
    <SidebarRoot>
      <SidebarLogoArea>
        <SidebarLogoIcon>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M3 8h10M8 3v10" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6" stroke="#000" strokeWidth="1.5" />
          </svg>
        </SidebarLogoIcon>
        <div>
          <SidebarLogoText>PRISM</SidebarLogoText>
          <SidebarVersion>v2.4.1</SidebarVersion>
        </div>
      </SidebarLogoArea>

      <SidebarNav>
        {navItems.map((item) => {
          const isActive = pathname === SCREEN_PATHS[item.key] || pathname.startsWith(SCREEN_PATHS[item.key] + "/");
          return (
            <NavItemRow key={item.key} $active={isActive} onClick={() => goTo(item.key)}>
              <NavIconWrap $active={isActive}>{item.icon}</NavIconWrap>
              {item.label}
            </NavItemRow>
          );
        })}
      </SidebarNav>

      <SidebarFooter>
        <UserCard>
          <SidebarAvatar>{initials}</SidebarAvatar>
          <div>
            <UserCardName>{user?.name ?? "—"}</UserCardName>
            <UserCardRole>{user?.role ?? ""}</UserCardRole>
          </div>
        </UserCard>
      </SidebarFooter>
    </SidebarRoot>
  );
}

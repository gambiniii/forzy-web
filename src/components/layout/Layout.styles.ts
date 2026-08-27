import styled from "styled-components";

// ── AppShell ──────────────────────────────────────────────────────────────────

export const ShellRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

export const ShellContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

// ── Topbar ────────────────────────────────────────────────────────────────────

export const TopbarRoot = styled.header`
  height: var(--topbar-h);
  background: var(--bg1);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  flex-shrink: 0;
`;

export const LogoBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  cursor: pointer;
`;

export const LogoIcon = styled.div`
  width: 26px;
  height: 26px;
  background: var(--green);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text1);
  text-transform: uppercase;
`;

export const Spacer = styled.div`flex: 1;`;

export const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const PulseDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
`;

export const TimeLabel = styled.span`
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text3);
`;

export const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 4px;
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 20px;
`;

export const Avatar = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--purple-d);
  border: 1px solid var(--purple);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  color: var(--purple);
  flex-shrink: 0;
`;

export const UserName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--text1);
  white-space: nowrap;
`;

export const LogoutBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: none;
  color: var(--text2);
  cursor: pointer;
`;

export const ThemeToggleRoot = styled.button`
  width: 52px;
  height: 28px;
  border-radius: 14px;
  border: 1px solid var(--border-md);
  background: var(--bg3);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
  padding: 0;
`;

export const ThemeEmoji = styled.span<{ $side: "left" | "right"; $active: boolean }>`
  position: absolute;
  ${({ $side }) => $side === "left" ? "left: 6px;" : "right: 6px;"}
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
  transition: opacity 0.2s;
`;

export const ThemeKnob = styled.span<{ $isDark: boolean }>`
  position: absolute;
  top: 3px;
  left: ${({ $isDark }) => ($isDark ? "27px" : "3px")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--green);
  transition: left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
`;

// ── Sidebar ───────────────────────────────────────────────────────────────────

export const SidebarRoot = styled.aside`
  width: var(--sidebar-w);
  background: var(--bg1);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 50;
  height: 100vh;
`;

export const SidebarLogoArea = styled.div`
  height: var(--topbar-h);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
`;

export const SidebarLogoIcon = styled.div`
  width: 28px;
  height: 28px;
  background: var(--green);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SidebarLogoText = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text1);
  text-transform: uppercase;
`;

export const SidebarVersion = styled.div`
  font-family: var(--mono);
  font-size: 9px;
  color: var(--text3);
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 12px 0;
`;

export const NavItemRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? "var(--green)" : "var(--text1)")};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  cursor: pointer;
  border-left: 2px solid ${({ $active }) => ($active ? "var(--green)" : "transparent")};
  background: ${({ $active }) => ($active ? "var(--green-d)" : "transparent")};
  transition: all 0.15s;
  user-select: none;

  &:hover {
    opacity: 1;
    color: ${({ $active }) => ($active ? "var(--green)" : "var(--text1)")};
  }
`;

export const NavIconWrap = styled.span<{ $active: boolean }>`
  width: 14px;
  height: 14px;
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  flex-shrink: 0;
`;

export const SidebarFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid var(--border);
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--bg2);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  cursor: pointer;
`;

export const SidebarAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--purple-d);
  border: 1px solid var(--purple);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--purple);
  flex-shrink: 0;
`;

export const UserCardName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--text1);
`;

export const UserCardRole = styled.div`
  font-size: 11px;
  color: var(--text3);
`;

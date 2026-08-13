import { useState, useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { useTheme } from "../../context/ThemeContext";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  TopbarRoot, LogoBtn, LogoIcon, LogoLabel, Spacer, TopbarRight,
  PulseDot, TimeLabel, UserChip, Avatar, UserName, LogoutBtn,
  ThemeToggleRoot, ThemeEmoji, ThemeKnob,
} from "./Layout.styles";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <ThemeToggleRoot onClick={toggle} title={isDark ? "Mudar para Light Mode" : "Mudar para Dark Mode"}>
      <ThemeEmoji $side="left"  $active={!isDark}>☀️</ThemeEmoji>
      <ThemeEmoji $side="right" $active={isDark}>🌙</ThemeEmoji>
      <ThemeKnob $isDark={isDark} />
    </ThemeToggleRoot>
  );
}

export function Topbar() {
  const { goTo } = useNavigation();
  const { user, initials } = useCurrentUser();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("pt-BR"));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <TopbarRoot>
      <LogoBtn onClick={() => goTo("plants")}>
        <LogoIcon>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M3 8h10M8 3v10" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6" stroke="#000" strokeWidth="1.5" />
          </svg>
        </LogoIcon>
        <LogoLabel>PRISM</LogoLabel>
      </LogoBtn>

      <Spacer />

      <TopbarRight>
        <PulseDot />
        <TimeLabel>{time}</TimeLabel>

        <ThemeToggle />

        {user && (
          <UserChip>
            <Avatar>{initials}</Avatar>
            <UserName>{user.name}</UserName>
          </UserChip>
        )}

        <LogoutBtn onClick={() => goTo("login")} title="Sair">
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
            <path d="M9 2h3v10H9M6 10l3-3-3-3M1 7h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </LogoutBtn>
      </TopbarRight>
    </TopbarRoot>
  );
}

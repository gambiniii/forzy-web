import { useState } from "react";
import { useNavigation } from "../../context/NavigationContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input/Input";
import { login } from "../../services/auth.service";
import {
  PageRoot, ScanlineOverlay, Scanline, GridBg, LoginBox,
  LogoRow, LogoIcon, LogoTitle, LogoSub,
  LoginCard, CardTitle, CardSub, FormStack,
  Divider, DividerLine, DividerLabel, FooterNote,
} from "./Login.styles";

export function LoginScreen() {
  const { goTo } = useNavigation();
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !pass) { setError("Preencha e-mail e senha."); return; }
    setLoading(true);
    setError(null);
    try {
      await login(email, pass);
      goTo("plants");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageRoot>
      <ScanlineOverlay><Scanline /></ScanlineOverlay>
      <GridBg />

      <LoginBox>
        <LogoRow>
          <LogoIcon>
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LogoIcon>
          <div>
            <LogoTitle>PRISM</LogoTitle>
            <LogoSub>Plataforma de Monitoramento Industrial</LogoSub>
          </div>
        </LogoRow>

        <LoginCard>
          <CardTitle>Acesso ao Sistema</CardTitle>
          <CardSub>Entre com suas credenciais corporativas</CardSub>

          <FormStack>
            <Input
              label="E-mail"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            {error && (
              <p style={{ color: "var(--red)", fontSize: 12, margin: 0 }}>{error}</p>
            )}

            <Button
              variant="primary"
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: 10 }}
            >
              <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                <path d="M1 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Divider>
              <DividerLine />
              <DividerLabel>ou</DividerLabel>
              <DividerLine />
            </Divider>

            <Button style={{ width: "100%", justifyContent: "center" }}>
              <svg viewBox="0 0 14 14" fill="none" width="13" height="13">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Acessar por QR Code
            </Button>
          </FormStack>
        </LoginCard>

        <FooterNote>v2.4.1 · Uso restrito · © 2025 PRISM</FooterNote>
      </LoginBox>
    </PageRoot>
  );
}

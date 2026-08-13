import styled from "styled-components";

export const PageRoot = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg0);
`;

export const ScanlineOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.03;
`;

export const Scanline = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: var(--green);
  animation: scanline 4s linear infinite;
`;

export const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 163, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 163, 0, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
`;

export const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  position: relative;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

export const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: var(--green);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const LogoSub = styled.div`
  font-size: 11px;
  color: var(--text3);
  letter-spacing: 0.05em;
`;

export const LoginCard = styled.div`
  background: var(--bg1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const CardSub = styled.div`
  font-size: 12px;
  color: var(--text2);
  margin-bottom: 24px;
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--border);
`;

export const DividerLabel = styled.span`
  font-size: 10px;
  color: var(--text3);
`;

export const FooterNote = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 11px;
  color: var(--text3);
`;

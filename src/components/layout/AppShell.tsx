import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Topbar } from "./Topbar";
import { MiniChat } from "./MiniChat";
import { ShellRoot, ShellContent } from "./Layout.styles";
import { AssistantFab } from "../../pages/assistant/Assistant.styles";

const FAB_SIZE = 52;
const FAB_MARGIN = 28;

function defaultFabPos() {
  return {
    x: window.innerWidth  - FAB_MARGIN - FAB_SIZE,
    y: window.innerHeight - FAB_MARGIN - FAB_SIZE,
  };
}

function defaultMiniPos(fabX: number, fabY: number) {
  const panelW = 360;
  const panelH = 480;
  const x = Math.max(8, Math.min(window.innerWidth - panelW - 8, fabX - panelW + FAB_SIZE));
  const y = Math.max(8, fabY - panelH - 16);
  return { x, y };
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const isLogin     = pathname === "/";
  const isAssistant = pathname === "/machinery/assistant";

  /* ── mini-chat state ─────────────────────────── */
  const [miniOpen, setMiniOpen] = useState(false);
  const [miniPos,  setMiniPos]  = useState({ x: 0, y: 0 });

  /* ── fab draggable state ─────────────────────── */
  const [fabPos, setFabPos] = useState(defaultFabPos);

  const fabDrag = useRef({
    active:  false,
    moved:   false,
    startX:  0,
    startY:  0,
    originX: 0,
    originY: 0,
  });

  /* double-click detection */
  const fabClickTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fabLastClickTs = useRef<number>(0);
  const DBLCLICK_MS    = 360;

  /* keep FAB within viewport on resize */
  useEffect(() => {
    const onResize = () => {
      setFabPos(prev => ({
        x: Math.min(prev.x, window.innerWidth  - FAB_SIZE),
        y: Math.min(prev.y, window.innerHeight - FAB_SIZE),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => { if (fabClickTimer.current) clearTimeout(fabClickTimer.current); };
  }, []);

  /* ── FAB pointer handlers ────────────────────── */

  const onFabPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    fabDrag.current = {
      active:  true,
      moved:   false,
      startX:  e.clientX,
      startY:  e.clientY,
      originX: fabPos.x,
      originY: fabPos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onFabPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!fabDrag.current.active) return;
    const dx = e.clientX - fabDrag.current.startX;
    const dy = e.clientY - fabDrag.current.startY;

    if (!fabDrag.current.moved && Math.hypot(dx, dy) > 6) {
      fabDrag.current.moved = true;
    }

    if (fabDrag.current.moved) {
      const nx = Math.max(0, Math.min(window.innerWidth  - FAB_SIZE, fabDrag.current.originX + dx));
      const ny = Math.max(0, Math.min(window.innerHeight - FAB_SIZE, fabDrag.current.originY + dy));
      setFabPos({ x: nx, y: ny });
    }
  };

  const onFabPointerUp = () => {
    if (!fabDrag.current.moved) {
      handleFabClick();
    }
    fabDrag.current.active = false;
  };

  /* ── FAB click logic (double-click = full assistant) ─────── */

  const handleFabClick = useCallback(() => {
    const now = Date.now();

    if (fabClickTimer.current && now - fabLastClickTs.current < DBLCLICK_MS) {
      // Double-click detected → cancel pending single-click, go to full assistant
      clearTimeout(fabClickTimer.current);
      fabClickTimer.current  = null;
      fabLastClickTs.current = 0;
      setMiniOpen(false);
      navigate("/machinery/assistant");
      return;
    }

    fabLastClickTs.current = now;

    // Capture current FAB position for the delayed action
    const fx = fabPos.x;
    const fy = fabPos.y;

    fabClickTimer.current = setTimeout(() => {
      fabClickTimer.current = null;
      // Single click confirmed → toggle mini-chat
      setMiniOpen(prev => {
        if (!prev) setMiniPos(defaultMiniPos(fx, fy));
        return !prev;
      });
    }, DBLCLICK_MS);
  }, [fabPos.x, fabPos.y, navigate]);

  if (isLogin) return <>{children}</>;

  return (
    <ShellRoot>
      <Topbar />
      <ShellContent>{children}</ShellContent>

      {!isAssistant && (
        <>
          <MiniChat
            x={miniPos.x}
            y={miniPos.y}
            visible={miniOpen}
            onMove={(x, y) => setMiniPos({ x, y })}
            onClose={() => setMiniOpen(false)}
            onExpand={() => { setMiniOpen(false); navigate("/machinery/assistant"); }}
          />

          <AssistantFab
            style={{
              top:    `${fabPos.y}px`,
              left:   `${fabPos.x}px`,
              bottom: "auto",
              right:  "auto",
              touchAction: "none",
              cursor: fabDrag.current.moved ? "grabbing" : "pointer",
            }}
            title={miniOpen ? "Clique duas vezes para abrir o PRISMO completo" : "Abrir PRISMO"}
            aria-label="PRISMO"
            onPointerDown={onFabPointerDown}
            onPointerMove={onFabPointerMove}
            onPointerUp={onFabPointerUp}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 017 7c0 3.5-2 6-5 7l-2 4-2-4c-3-1-5-3.5-5-7a7 7 0 017-7z" />
              <circle cx="9"  cy="9" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="9" r="1" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
            </svg>
          </AssistantFab>
        </>
      )}
    </ShellRoot>
  );
}

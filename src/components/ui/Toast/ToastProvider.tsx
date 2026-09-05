import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastStack, ToastCard, ToastIcon, ToastBody, ToastTitle, ToastMessage, ToastClose } from "./Toast.styles";

export type ToastSeverity = "warning" | "critical";

interface ToastInput {
  severity: ToastSeverity;
  title: string;
  message?: string;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  pushToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 8000;

/** Toasts transientes para eventos de diagnóstico (ver useAnomalyToasts).
 * "warning" some sozinho; "critical" fica até ser fechado manualmente. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((toast: ToastInput) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { ...toast, id }]);
    if (toast.severity === "warning") {
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      {createPortal(
        <ToastStack>
          {toasts.map((t) => (
            <ToastCard key={t.id} $severity={t.severity}>
              <ToastIcon $severity={t.severity}>⚠</ToastIcon>
              <ToastBody>
                <ToastTitle>{t.title}</ToastTitle>
                {t.message && <ToastMessage>{t.message}</ToastMessage>}
              </ToastBody>
              <ToastClose type="button" aria-label="Fechar" onClick={() => dismiss(t.id)}>×</ToastClose>
            </ToastCard>
          ))}
        </ToastStack>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Overlay,
  Dialog,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  TitleGroup,
} from "./Modal.styles";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: ModalSize;
  footer?: React.ReactNode;
  padded?: boolean;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  size = "md",
  footer,
  padded = true,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Dialog $size={size} role="dialog" aria-modal>
        {(title || subtitle) && (
          <ModalHeader>
            <TitleGroup>
              {title && <ModalTitle>{title}</ModalTitle>}
              {subtitle && <ModalSubtitle>{subtitle}</ModalSubtitle>}
            </TitleGroup>
            <CloseButton type="button" onClick={onClose} aria-label="Fechar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </CloseButton>
          </ModalHeader>
        )}

        <ModalBody $padded={padded}>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </Dialog>
    </Overlay>,
    document.body
  );
}

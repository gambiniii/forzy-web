import React from "react";
import { StyledButton } from "./Button.styles";

type ButtonVariant = "default" | "primary" | "danger" | "purple";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ variant = "default", children, ...rest }: ButtonProps) {
  return (
    <StyledButton $variant={variant} {...rest}>
      {children}
    </StyledButton>
  );
}

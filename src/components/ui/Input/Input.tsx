import React from "react";
import {
  Group,
  Label,
  HintText,
  ErrorText,
  StyledInput,
  StyledSelect,
  StyledTextarea,
  InputWrapper,
  IconSlot,
} from "./Input.styles";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, hint, error, children }: FieldWrapperProps) {
  return (
    <Group>
      {label && <Label>{label}</Label>}
      {children}
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && <HintText>{hint}</HintText>}
    </Group>
  );
}

// ---------- Input ----------

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({ label, hint, error, iconLeft, iconRight, ...rest }: InputProps) {
  const field = (
    <InputWrapper>
      {iconLeft && <IconSlot $side="left">{iconLeft}</IconSlot>}
      <StyledInput
        $hasError={!!error}
        style={{
          paddingLeft: iconLeft ? 32 : undefined,
          paddingRight: iconRight ? 32 : undefined,
        }}
        {...rest}
      />
      {iconRight && <IconSlot $side="right">{iconRight}</IconSlot>}
    </InputWrapper>
  );

  if (!label && !hint && !error) return field;
  return (
    <FieldWrapper label={label} hint={hint} error={error}>
      {field}
    </FieldWrapper>
  );
}

// ---------- Select ----------

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Select({ label, hint, error, children, ...rest }: SelectProps) {
  const field = <StyledSelect $hasError={!!error} {...rest}>{children}</StyledSelect>;

  if (!label && !hint && !error) return field;
  return (
    <FieldWrapper label={label} hint={hint} error={error}>
      {field}
    </FieldWrapper>
  );
}

// ---------- Textarea ----------

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, ...rest }: TextareaProps) {
  const field = <StyledTextarea $hasError={!!error} {...rest} />;

  if (!label && !hint && !error) return field;
  return (
    <FieldWrapper label={label} hint={hint} error={error}>
      {field}
    </FieldWrapper>
  );
}

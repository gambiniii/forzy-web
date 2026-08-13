import {
  CheckboxRoot,
  HiddenInput,
  CheckboxBox,
  CheckMark,
  CheckboxLabel,
  ToggleRoot,
  ToggleTrack,
  ToggleThumb,
  ToggleLabel,
} from "./Checkbox.styles";

// ===== CHECKBOX =====

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  indeterminate?: boolean;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, indeterminate = false, disabled = false }: CheckboxProps) {
  return (
    <CheckboxRoot>
      <HiddenInput
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <CheckboxBox $checked={checked} $indeterminate={indeterminate}>
        {indeterminate ? (
          <CheckMark viewBox="0 0 10 10" fill="none">
            <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </CheckMark>
        ) : checked ? (
          <CheckMark viewBox="0 0 10 10" fill="none">
            <polyline points="1.5,5 4,7.5 8.5,2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </CheckMark>
        ) : null}
      </CheckboxBox>
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxRoot>
  );
}

// ===== TOGGLE =====

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, size = "md", disabled = false }: ToggleProps) {
  return (
    <ToggleRoot>
      <HiddenInput
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <ToggleTrack $checked={checked} $size={size}>
        <ToggleThumb $checked={checked} $size={size} />
      </ToggleTrack>
      {label && <ToggleLabel>{label}</ToggleLabel>}
    </ToggleRoot>
  );
}

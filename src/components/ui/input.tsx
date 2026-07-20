import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

function toFieldId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Input({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className = "",
  containerClassName = "",
  error,
  hint,
  id,
  label,
  name,
  ...props
}: InputProps) {
  const fieldId = id ?? name ?? (label ? `field-${toFieldId(label)}` : undefined);
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  const hintId = hint && fieldId ? `${fieldId}-hint` : undefined;
  const describedBy = [ariaDescribedBy, errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["ui-field", containerClassName].filter(Boolean).join(" ")}>
      {label ? (
        <label className="ui-field__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : ariaInvalid}
        className={["ui-input", className].filter(Boolean).join(" ")}
        id={fieldId}
        name={name}
      />
      {error ? (
        <p className="ui-field__message ui-field__message--error" id={errorId}>
          {error}
        </p>
      ) : hint ? (
        <p className="ui-field__message" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type BindingRecord = Record<string, unknown>;

function readBindingValue(
  binding: BindingRecord,
  variableName: string,
): unknown {
  return (
    binding[variableName] ??
    binding[`?${variableName}`] ??
    (binding as { value?: unknown }).value
  );
}

export function parseNumericBindingValue(
  binding: BindingRecord,
  variableName: string,
): number | undefined {
  const bindingValue = readBindingValue(binding, variableName);
  if (typeof bindingValue === "number") {
    return Number.isFinite(bindingValue) ? bindingValue : undefined;
  }
  if (typeof bindingValue === "string") {
    const parsed = Number.parseFloat(bindingValue);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (
    bindingValue &&
    typeof bindingValue === "object" &&
    "value" in bindingValue &&
    typeof (bindingValue as { value: unknown }).value === "string"
  ) {
    const parsed = Number.parseFloat((bindingValue as { value: string }).value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function parseStringBindingValue(
  binding: BindingRecord,
  variableName: string,
): string | undefined {
  const bindingValue = readBindingValue(binding, variableName);
  if (typeof bindingValue === "string") {
    return bindingValue;
  }
  if (
    bindingValue &&
    typeof bindingValue === "object" &&
    "value" in bindingValue &&
    typeof (bindingValue as { value: unknown }).value === "string"
  ) {
    return (bindingValue as { value: string }).value;
  }
  return undefined;
}

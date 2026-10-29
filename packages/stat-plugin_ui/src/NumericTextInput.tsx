import React from "react";
import { TextInput, type TextInputProps } from "react-native";

export interface NumericTextInputProps
  extends Omit<TextInputProps, "value" | "onChangeText" | "keyboardType"> {
  value: number;
  onChangeValue: (next: number) => void;
  min?: number;
  /** How long to wait after the last keystroke before committing. */
  commitDelayMs?: number;
}

/**
 * A numeric text field that keeps a local text draft so the user can clear it
 * while typing. Valid numbers >= `min` are committed after a short pause or on
 * blur, so expensive `onChangeValue` handlers don't run on every keystroke. On
 * blur, an invalid draft snaps back to the last committed value.
 */
export function NumericTextInput({
  value,
  onChangeValue,
  min = 1,
  commitDelayMs = 300,
  onBlur,
  ...rest
}: NumericTextInputProps): React.ReactElement {
  const [draft, setDraft] = React.useState(() => String(value));
  const pendingRef = React.useRef<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeValueRef = React.useRef(onChangeValue);
  onChangeValueRef.current = onChangeValue;

  const flush = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (pending !== null) onChangeValueRef.current(pending);
  }, []);

  // Commit anything still pending if the field unmounts mid-edit.
  React.useEffect(() => flush, [flush]);

  React.useEffect(() => {
    if (pendingRef.current !== null) return;
    setDraft((currentDraft) =>
      Number(currentDraft) === value && currentDraft.trim() !== ""
        ? currentDraft
        : String(value),
    );
  }, [value]);

  return (
    <TextInput
      {...rest}
      value={draft}
      onChangeText={(nextDraft) => {
        setDraft(nextDraft);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
        pendingRef.current = null;

        const parsed = Number(nextDraft);
        if (nextDraft.trim() === "" || !Number.isFinite(parsed) || parsed < min) {
          return;
        }
        if (parsed === value) return;
        pendingRef.current = parsed;
        timerRef.current = setTimeout(flush, commitDelayMs);
      }}
      onBlur={(event) => {
        const pending = pendingRef.current;
        flush();
        setDraft(String(pending ?? value));
        onBlur?.(event);
      }}
      keyboardType="numeric"
    />
  );
}

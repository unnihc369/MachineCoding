"use client";

import { useEffect, useRef, useState } from "react";
import "./OtpInput.css";

const DEFAULT_OTP_DIGITS_COUNT = 5;
const LENGTH_OPTIONS = [4, 5, 6];

export function createEmptyOtpArray(count) {
  return Array.from({ length: count }, () => "");
}

export function otpStringToArray(value, count) {
  const digits = String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, count)
    .split("");

  const result = createEmptyOtpArray(count);
  for (let i = 0; i < digits.length; i += 1) {
    result[i] = digits[i];
  }
  return result;
}

export function sanitizeDigit(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  const lastChar = trimmed.slice(-1);
  return /^\d$/.test(lastChar) ? lastChar : "";
}

export function isOtpComplete(values) {
  return values.length > 0 && values.every((digit) => digit !== "");
}

export function joinOtp(values) {
  return values.join("");
}

function OtpInputField({
  digitsCount = 5,
  value,
  onChange,
  onComplete,
  disabled = false,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    createEmptyOtpArray(digitsCount)
  );
  const inputRefs = useRef([]);

  const values = isControlled
    ? otpStringToArray(value, digitsCount)
    : internalValue;

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(createEmptyOtpArray(digitsCount));
    }
    inputRefs.current = [];
  }, [digitsCount, isControlled]);

  useEffect(() => {
    if (!disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [digitsCount, disabled]);

  const commitValues = (nextValues) => {
    if (!isControlled) {
      setInternalValue(nextValues);
    }

    const otp = joinOtp(nextValues);
    onChange?.(otp);

    if (isOtpComplete(nextValues)) {
      onComplete?.(otp);
    }
  };

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select?.();
  };

  const handleChange = (index, rawValue) => {
    const digit = sanitizeDigit(rawValue);
    if (!digit) return;

    const next = [...values];
    next[index] = digit;
    commitValues(next);

    if (index < digitsCount - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key !== "Backspace") return;

    const currentValue = event.target.value;

    if (currentValue !== "") {
      const next = [...values];
      next[index] = "";
      commitValues(next);
      return;
    }

    event.preventDefault();

    if (index > 0) {
      const next = [...values];
      next[index - 1] = "";
      commitValues(next);
      focusInput(index - 1);
    }
  };

  const applyPaste = (rawText) => {
    const pasted = String(rawText)
      .replace(/\D/g, "")
      .slice(0, digitsCount);

    if (!pasted) return;

    const next = otpStringToArray(pasted, digitsCount);
    commitValues(next);
    focusInput(Math.min(pasted.length, digitsCount - 1));
  };

  const handlePaste = (event) => {
    event.preventDefault();
    applyPaste(event.clipboardData.getData("text"));
  };

  return (
    <div
      className="otp-input-field"
      role="group"
      aria-label={`OTP input, ${digitsCount} digits`}
      onPaste={handlePaste}
    >
      {values.map((digit, index) => (
        <input
          key={`otp-${digitsCount}-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="otp-input-field__box"
          value={digit}
          disabled={disabled}
          maxLength={1}
          aria-label={`Digit ${index + 1} of ${digitsCount}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}

export default function OtpInput() {
  const [digitsCount, setDigitsCount] = useState(DEFAULT_OTP_DIGITS_COUNT);
  const [otpValue, setOtpValue] = useState("");
  const [completedOtp, setCompletedOtp] = useState("");

  const handleDigitsChange = (count) => {
    setDigitsCount(count);
    setOtpValue("");
    setCompletedOtp("");
  };

  const presetOtp = () => {
    const sample = "1".repeat(Math.min(3, digitsCount));
    setOtpValue(sample);
    setCompletedOtp("");
  };

  const clearOtp = () => {
    setOtpValue("");
    setCompletedOtp("");
  };

  return (
    <div className="otp-input-demo">
      <header className="otp-input-demo__header">
        <h2 className="otp-input-demo__title">OTP Input</h2>
        <p className="otp-input-demo__subtitle">
          Controlled OTP field — auto-advance, backspace navigation, and paste
          support.
        </p>
      </header>

      <section className="otp-input-demo__controls">
        <span className="otp-input-demo__label">Digits count</span>
        <div className="otp-input-demo__lengths">
          {LENGTH_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={`otp-input-demo__length-btn ${
                digitsCount === count ? "otp-input-demo__length-btn--active" : ""
              }`}
              onClick={() => handleDigitsChange(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <OtpInputField
        key={digitsCount}
        digitsCount={digitsCount}
        value={otpValue}
        onChange={(next) => {
          setOtpValue(next);
          if (next.length < digitsCount || next.includes("")) {
            setCompletedOtp("");
          }
        }}
        onComplete={setCompletedOtp}
      />

      <div className="otp-input-demo__actions">
        <button type="button" className="otp-input-demo__action" onClick={presetOtp}>
          Set &quot;111…&quot; (controlled)
        </button>
        <button type="button" className="otp-input-demo__action" onClick={clearOtp}>
          Clear
        </button>
      </div>

      <p className="otp-input-demo__meta">
        Controlled value: <code>{otpValue || "—"}</code>
      </p>

      {completedOtp && (
        <p className="otp-input-demo__success" role="status">
          OTP complete: <strong>{completedOtp}</strong>
        </p>
      )}

      <ul className="otp-input-demo__hints">
        <li>Auto-focus next box on digit entry</li>
        <li>Backspace clears current digit, then moves back and clears previous</li>
        <li>Paste full OTP — fills all boxes from clipboard</li>
        <li>Controlled — parent owns <code>value</code> via <code>onChange</code></li>
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import "./OtpInput.css";

const DEFAULT_OTP_DIGITS_COUNT = 5;
const LENGTH_OPTIONS = [4, 5, 6];

export function createEmptyOtpArray(count) {
  return Array.from({ length: count }, () => "");
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

function OtpInputField({ digitsCount = 5, onChange, onComplete }) {
  const [values, setValues] = useState(() => createEmptyOtpArray(digitsCount));
  const inputRefs = useRef([]);

  useEffect(() => {
    setValues(createEmptyOtpArray(digitsCount));
    inputRefs.current = [];
  }, [digitsCount]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [digitsCount]);

  useEffect(() => {
    onChange?.(joinOtp(values));
    if (isOtpComplete(values)) {
      onComplete?.(joinOtp(values));
    }
  }, [values, onChange, onComplete]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, rawValue) => {
    const digit = sanitizeDigit(rawValue);
    if (!digit) return;

    setValues((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (index < digitsCount - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key !== "Backspace") return;

    const currentValue = event.target.value;

    if (currentValue !== "") {
      setValues((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    event.preventDefault();
    if (index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, digitsCount);

    if (!pasted) return;

    const next = createEmptyOtpArray(digitsCount);
    for (let i = 0; i < pasted.length; i += 1) {
      next[i] = pasted[i];
    }

    setValues(next);
    focusInput(Math.min(pasted.length, digitsCount - 1));
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
          maxLength={1}
          aria-label={`Digit ${index + 1} of ${digitsCount}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}

export default function OtpInput() {
  const [digitsCount, setDigitsCount] = useState(DEFAULT_OTP_DIGITS_COUNT);
  const [otpValue, setOtpValue] = useState("");
  const [completedOtp, setCompletedOtp] = useState("");

  return (
    <div className="otp-input-demo">
      <header className="otp-input-demo__header">
        <h2 className="otp-input-demo__title">OTP Input</h2>
        <p className="otp-input-demo__subtitle">
          Generic OTP component — change digit count and it re-renders accordingly.
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
              onClick={() => {
                setDigitsCount(count);
                setOtpValue("");
                setCompletedOtp("");
              }}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <OtpInputField
        key={digitsCount}
        digitsCount={digitsCount}
        onChange={setOtpValue}
        onComplete={setCompletedOtp}
      />

      <p className="otp-input-demo__meta">
        Current: <code>{otpValue || "—"}</code>
      </p>
      {completedOtp && (
        <p className="otp-input-demo__success" role="status">
          OTP complete: <strong>{completedOtp}</strong>
        </p>
      )}

      <ul className="otp-input-demo__hints">
        <li>Numbers only; letters are ignored</li>
        <li>Auto-advance to next box on digit entry</li>
        <li>Backspace on empty box moves to previous</li>
        <li>First box focused on load</li>
      </ul>
    </div>
  );
}

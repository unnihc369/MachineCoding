"use client";

import { useMemo, useState } from "react";
import "./PasswordStrength.css";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()-_=+[]{}|;:,.<>?";

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
  { id: "lower", label: "Lowercase letter (a-z)", regex: /[a-z]/ },
  { id: "upper", label: "Uppercase letter (A-Z)", regex: /[A-Z]/ },
  { id: "number", label: "Number (0-9)", regex: /[0-9]/ },
  { id: "special", label: "Special character", regex: /[^A-Za-z0-9]/ },
];

function randomChar(charset) {
  return charset[Math.floor(Math.random() * charset.length)];
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generatePassword({
  length = 12,
  uppercase = true,
  lowercase = true,
  numbers = true,
  special = true,
}) {
  let charset = "";
  const required = [];

  if (lowercase) {
    charset += LOWERCASE;
    required.push(randomChar(LOWERCASE));
  }
  if (uppercase) {
    charset += UPPERCASE;
    required.push(randomChar(UPPERCASE));
  }
  if (numbers) {
    charset += NUMBERS;
    required.push(randomChar(NUMBERS));
  }
  if (special) {
    charset += SPECIAL;
    required.push(randomChar(SPECIAL));
  }

  if (!charset) return "";

  const safeLength = Math.max(length, required.length, 4);
  const chars = [...required];

  for (let i = chars.length; i < safeLength; i += 1) {
    chars.push(randomChar(charset));
  }

  return shuffle(chars).join("");
}

export function evaluateRules(password) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.regex.test(password),
  }));
}

export function getStrengthLevel(password) {
  if (!password) return null;

  const results = evaluateRules(password);
  const passedCount = results.filter((rule) => rule.passed).length;
  const len = password.length;

  if (passedCount <= 2 || len < 6) return "weak";
  if (passedCount <= 4 || len < 10) return "medium";
  return "strong";
}

const DEFAULT_OPTIONS = {
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  special: true,
};

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);

  const ruleResults = useMemo(() => evaluateRules(password), [password]);
  const strength = useMemo(() => getStrengthLevel(password), [password]);
  const passedCount = ruleResults.filter((rule) => rule.passed).length;

  const hasCharset =
    options.uppercase ||
    options.lowercase ||
    options.numbers ||
    options.special;

  const handleGenerate = () => {
    if (!hasCharset) return;
    const next = generatePassword(options);
    setPassword(next);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const updateOption = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="password-strength">
      <header className="password-strength__header">
        <h2 className="password-strength__title">Password Strength Meter</h2>
        <p className="password-strength__subtitle">
          Generate passwords by length and character options — strength rated
          with regex validation.
        </p>
      </header>

      <section className="password-strength__panel">
        <h3 className="password-strength__section-title">Generator options</h3>

        <label className="password-strength__field">
          <span>Length</span>
          <input
            type="number"
            min={4}
            max={64}
            value={options.length}
            onChange={(e) =>
              updateOption("length", Number(e.target.value) || 4)
            }
          />
        </label>

        <div className="password-strength__checks">
          <label className="password-strength__check">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={(e) => updateOption("uppercase", e.target.checked)}
            />
            Uppercase (A-Z)
          </label>
          <label className="password-strength__check">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={(e) => updateOption("lowercase", e.target.checked)}
            />
            Lowercase (a-z)
          </label>
          <label className="password-strength__check">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={(e) => updateOption("numbers", e.target.checked)}
            />
            Numbers (0-9)
          </label>
          <label className="password-strength__check">
            <input
              type="checkbox"
              checked={options.special}
              onChange={(e) => updateOption("special", e.target.checked)}
            />
            Special characters
          </label>
        </div>

        <button
          type="button"
          className="password-strength__btn password-strength__btn--primary"
          disabled={!hasCharset}
          onClick={handleGenerate}
        >
          Generate password
        </button>

        {!hasCharset && (
          <p className="password-strength__error">
            Select at least one character type.
          </p>
        )}
      </section>

      <section className="password-strength__panel">
        <h3 className="password-strength__section-title">Password</h3>

        <div className="password-strength__input-row">
          <input
            type="text"
            className="password-strength__input"
            placeholder="Type or generate a password…"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setCopied(false);
            }}
            aria-label="Password"
          />
          <button
            type="button"
            className="password-strength__btn"
            disabled={!password}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {password && (
          <>
            <div className="password-strength__meter-wrap">
              <div
                className={`password-strength__meter password-strength__meter--${strength}`}
                role="meter"
                aria-valuenow={passedCount}
                aria-valuemin={0}
                aria-valuemax={PASSWORD_RULES.length}
                aria-label={`Password strength: ${strength}`}
              >
                <div
                  className="password-strength__meter-fill"
                  style={{ width: `${(passedCount / PASSWORD_RULES.length) * 100}%` }}
                />
              </div>
              <span
                className={`password-strength__badge password-strength__badge--${strength}`}
              >
                {strength}
              </span>
            </div>

            <ul className="password-strength__rules">
              {ruleResults.map((rule) => (
                <li
                  key={rule.id}
                  className={`password-strength__rule ${
                    rule.passed
                      ? "password-strength__rule--pass"
                      : "password-strength__rule--fail"
                  }`}
                >
                  <span className="password-strength__rule-icon" aria-hidden="true">
                    {rule.passed ? "✓" : "✗"}
                  </span>
                  <span>{rule.label}</span>
                  <code className="password-strength__regex">
                    {rule.regex.toString()}
                  </code>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import "./TabForm.css";

export type FormData = {
  name: string;
  age: string;
  email: string;
  interests: string[];
  theme: "dark" | "light";
};

export type FormErrors = Partial<
  Record<"name" | "age" | "email" | "interests", string>
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateProfile(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const age = Number(data.age);
  if (!data.age.trim() || Number.isNaN(age) || age < 18) {
    errors.age = "Age must be at least 18.";
  }

  if (!data.email.trim() || !isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function validateInterests(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (data.interests.length < 1) {
    errors.interests = "Select at least one interest.";
  }

  return errors;
}

export function validateSettings(_data: FormData): FormErrors {
  return {};
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  age: "",
  email: "",
  interests: [],
  theme: "dark",
};

const INTEREST_OPTIONS = ["Coding", "Music", "JavaScript", "Movies"] as const;

type TabConfig = {
  id: string;
  label: string;
  validate: (data: FormData) => FormErrors;
};

const TABS_CONFIG: TabConfig[] = [
  { id: "profile", label: "Profile", validate: validateProfile },
  { id: "interests", label: "Interests", validate: validateInterests },
  { id: "settings", label: "Settings", validate: validateSettings },
];

type TabPanelProps = {
  data: FormData;
  errors: FormErrors;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onInterestToggle: (interest: string, checked: boolean) => void;
  onThemeChange: (theme: FormData["theme"]) => void;
};

function ProfileTab({
  data,
  errors,
  onFieldChange,
}: Pick<TabPanelProps, "data" | "errors" | "onFieldChange">) {
  return (
    <div className="tab-form-fields">
      <label className="tab-form-field">
        <span>Name</span>
        <input
          type="text"
          value={data.name}
          placeholder="Your name"
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
        {errors.name && <span className="tab-form-error">{errors.name}</span>}
      </label>

      <label className="tab-form-field">
        <span>Age</span>
        <input
          type="number"
          min={1}
          value={data.age}
          placeholder="18+"
          onChange={(e) => onFieldChange("age", e.target.value)}
        />
        {errors.age && <span className="tab-form-error">{errors.age}</span>}
      </label>

      <label className="tab-form-field">
        <span>Email</span>
        <input
          type="email"
          value={data.email}
          placeholder="you@example.com"
          onChange={(e) => onFieldChange("email", e.target.value)}
        />
        {errors.email && <span className="tab-form-error">{errors.email}</span>}
      </label>
    </div>
  );
}

function InterestsTab({
  data,
  errors,
  onInterestToggle,
}: Pick<TabPanelProps, "data" | "errors" | "onInterestToggle">) {
  return (
    <div className="tab-form-fields">
      <p className="tab-form-hint">Select your interests</p>
      <div className="tab-form-checkbox-group">
        {INTEREST_OPTIONS.map((interest) => (
          <label key={interest} className="tab-form-checkbox">
            <input
              type="checkbox"
              checked={data.interests.includes(interest)}
              onChange={(e) => onInterestToggle(interest, e.target.checked)}
            />
            <span>{interest}</span>
          </label>
        ))}
      </div>
      {errors.interests && (
        <span className="tab-form-error">{errors.interests}</span>
      )}
    </div>
  );
}

function SettingsTab({
  data,
  onThemeChange,
}: Pick<TabPanelProps, "data" | "onThemeChange">) {
  return (
    <div className="tab-form-fields">
      <p className="tab-form-hint">Choose your theme preference</p>
      <div className="tab-form-radio-group">
        <label className="tab-form-radio">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={data.theme === "dark"}
            onChange={() => onThemeChange("dark")}
          />
          <span>Dark theme</span>
        </label>
        <label className="tab-form-radio">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={data.theme === "light"}
            onChange={() => onThemeChange("light")}
          />
          <span>Light theme</span>
        </label>
      </div>
    </div>
  );
}

export default function TabForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");

  const isFirstTab = activeTab === 0;
  const isLastTab = activeTab === TABS_CONFIG.length - 1;

  const runValidation = useCallback(
    (tabIndex: number): boolean => {
      const tabErrors = TABS_CONFIG[tabIndex].validate(formData);
      setErrors(tabErrors);
      return !hasErrors(tabErrors);
    },
    [formData]
  );

  const goToTab = (index: number) => {
    if (index === activeTab) return;

    if (index > activeTab && !runValidation(activeTab)) return;

    if (index < activeTab) {
      setErrors({});
    } else if (index > activeTab) {
      setErrors({});
    }

    setActiveTab(index);
    setSubmitMessage("");
  };

  const handleTabClick = (index: number) => {
    if (index > activeTab && !runValidation(activeTab)) return;
    setErrors({});
    setActiveTab(index);
    setSubmitMessage("");
  };

  const handleNext = () => {
    if (!runValidation(activeTab)) return;
    setErrors({});
    setActiveTab((prev) => Math.min(prev + 1, TABS_CONFIG.length - 1));
    setSubmitMessage("");
  };

  const handlePrevious = () => {
    setErrors({});
    setActiveTab((prev) => Math.max(prev - 1, 0));
    setSubmitMessage("");
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof FormErrors];
      return next;
    });
  };

  const handleInterestToggle = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter((item) => item !== interest),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.interests;
      return next;
    });
  };

  const handleThemeChange = (theme: FormData["theme"]) => {
    setFormData((prev) => ({ ...prev, theme }));
  };

  const handleSubmit = () => {
    if (!runValidation(activeTab)) return;

    setSubmitMessage("Form submitted successfully! Check console for payload.");
    console.log("[TabForm] Submit payload:", formData);
  };

  const activeTabId = TABS_CONFIG[activeTab].id;

  const activePanel = useMemo(() => {
    const props: TabPanelProps = {
      data: formData,
      errors,
      onFieldChange: handleFieldChange,
      onInterestToggle: handleInterestToggle,
      onThemeChange: handleThemeChange,
    };

    switch (activeTabId) {
      case "profile":
        return <ProfileTab {...props} />;
      case "interests":
        return <InterestsTab {...props} />;
      case "settings":
        return <SettingsTab {...props} />;
      default:
        return null;
    }
  }, [activeTabId, formData, errors]);

  return (
    <div className="tab-form-container">
      <header className="tab-form-header">
        <h2 className="tab-form-title">Multi-step Tab Form</h2>
        <p className="tab-form-subtitle">
          Profile → Interests → Settings with validation and persisted state.
        </p>
      </header>

      <div className="tab-form-card">
        <nav className="tab-form-tabs" aria-label="Form steps">
          {TABS_CONFIG.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-form-tab ${
                activeTab === index ? "tab-form-tab--active" : ""
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="tab-form-body">{activePanel}</div>

        <footer className="tab-form-footer">
          <div className="tab-form-footer-left">
            {!isFirstTab && (
              <button
                type="button"
                className="tab-form-btn tab-form-btn--secondary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
          </div>

          <div className="tab-form-footer-right">
            {!isLastTab && (
              <button
                type="button"
                className="tab-form-btn tab-form-btn--primary"
                onClick={handleNext}
              >
                Next
              </button>
            )}
            {isLastTab && (
              <button
                type="button"
                className="tab-form-btn tab-form-btn--primary"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </footer>

        {submitMessage && (
          <p className="tab-form-success" role="status">
            {submitMessage}
          </p>
        )}
      </div>
    </div>
  );
}

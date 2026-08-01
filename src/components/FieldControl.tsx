/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export type FieldControlProps = {
  label?: string;
  type?:
    | "text"
    | "number"
    | "url"
    | "select"
    | "multiselect"
    | "tags"
    | "textarea"
    | "range"
    | "email"
    | "password";
  value: any;
  onChange: (val: any) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
};

export const FieldControl: React.FC<FieldControlProps> = ({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  placeholder,
  min,
  max,
  className = "",
  description,
  disabled,
  required,
  leftIcon,
}) => {
  const baseClasses = `border p-2 rounded-md w-full disabled:opacity-50 ${leftIcon ? "pl-10" : ""}`;
  const baseStyle = {
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  };

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseClasses}
            style={baseStyle}
            disabled={disabled}
            required={required}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            style={baseStyle}
            disabled={disabled}
            required={required}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
      case "tags":
        const customStyles = {
          control: (provided: any) => ({
            ...provided,
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }),
          menu: (provided: any) => ({
            ...provided,
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            zIndex: 50,
          }),
          option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? "var(--accent)" : "transparent",
            color: state.isFocused
              ? "var(--bg-primary)"
              : "var(--text-primary)",
            cursor: "pointer",
          }),
          multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: "var(--accent)",
          }),
          multiValueLabel: (provided: any) => ({
            ...provided,
            color: "#fff",
          }),
          singleValue: (provided: any) => ({
            ...provided,
            color: "var(--text-primary)",
          }),
          input: (provided: any) => ({
            ...provided,
            color: "var(--text-primary)",
          }),
        };

        const isMulti = true;
        const currentSelected =
          type === "tags"
            ? (value || []).map((v: string) => ({ label: v, value: v }))
            : value;
        const handleChange = (selected: any) => {
          if (type === "tags") {
            onChange(selected ? selected.map((s: any) => s.value) : []);
          } else {
            onChange(selected);
          }
        };

        if (type === "tags") {
          return (
            <CreatableSelect
              isMulti={isMulti}
              options={options}
              value={currentSelected}
              onChange={handleChange}
              placeholder={placeholder || "Type and press enter..."}
              styles={customStyles}
              isDisabled={disabled}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          );
        }

        return (
          <Select
            isMulti={isMulti}
            options={options}
            value={currentSelected}
            onChange={handleChange}
            placeholder={placeholder}
            styles={customStyles}
            isDisabled={disabled}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        );

      case "range":
        return (
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
            disabled={disabled}
            required={required}
          />
        );

      default:
        // text, number, url, etc.
        return (
          <div className="relative w-full">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                {leftIcon}
              </div>
            )}
            <input
              type={type}
              value={value}
              onChange={(e) =>
                onChange(
                  type === "number" ? Number(e.target.value) : e.target.value,
                )
              }
              placeholder={placeholder}
              className={baseClasses}
              style={baseStyle}
              disabled={disabled}
              required={required}
              min={min}
              max={max}
            />
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label
          className="text-sm font-medium flex justify-between"
          style={{ color: "var(--text-primary)" }}
        >
          <span>{label}</span>
          {type === "range" && (
            <span className="font-mono text-[var(--accent)]">
              {value} {description}
            </span>
          )}
        </label>
      )}
      {renderInput()}
      {description && type !== "range" && (
        <span
          className="text-xs text-gray-500"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </span>
      )}
    </div>
  );
};

import React from "react";

interface IInputProps {
  name: string;
  label?: string;
  onChange: (event: React.FormEvent) => void;
  error?: string;
  required?: boolean;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}

export const InputField: React.FC<IInputProps> = (props) => {
  const isError = props.error !== "";
  const label =
    props.label !== undefined ? (
      <label htmlFor={props.name} className="w3-left">
        <b>{props.label}</b>
      </label>
    ) : null;

  return (
    <div
      className="w3-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
      }}
    >
      {label}
      <input
        className={"w3-input w3-round-large"}
        type={props.type}
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
      />
      <label
        htmlFor={props.name}
        className={`w3-left w3-hide + ${isError ? " w3-show w3-text-red" : ""}`}
        style={{ textAlign: "left" }}
      >
        {props.error}
      </label>
    </div>
  );
};

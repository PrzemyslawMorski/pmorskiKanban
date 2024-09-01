import React from "react";

interface ITextAreaProps {
  name: string;
  label?: string;
  onChange: (event: React.FormEvent) => void;
  error: string;
  required: boolean;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}

export const TextAreaField: React.FC<ITextAreaProps> = (props) => {
  const isError = props.error !== "";
  const label =
    props.label !== undefined ? (
      <label htmlFor={props.name} className="w3-left">
        <b>{props.label}</b>
      </label>
    ) : null;

  return (
    <div>
      {label}
      <textarea
        className={"w3-input w3-round-large"}
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        style={{ resize: "none" }}
      />
      <label
        htmlFor={props.name}
        className={`w3-left w3-hide + ${isError ? " w3-show w3-text-red" : ""}`}
      >
        {props.error}
      </label>
    </div>
  );
};

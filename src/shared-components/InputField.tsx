import * as React from "react";

interface IInputProps {
  name: string;
  label: string;
  onChange: (event: React.FormEvent) => void;
  error: string;
  required: boolean;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}

export const InputField: React.SFC<IInputProps> =
  (props) => {
    const isError = props.error !== "";

    return (<div className={"w3-panel"}>
      <label htmlFor={props.name}><b>{props.label}</b></label>
      <input
        className={"w3-input"}
        type={props.type}
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
      />
      <label htmlFor={props.name} className={`w3-hide + ${isError ? " w3-show w3-text-red" : ""}`}>{props.error}</label>
    </div>);
  };

interface ICheckboxProps {
  name: string;
  label: string;
  onChange: (event: React.FormEvent) => void;
}

export const Checkbox: React.SFC<ICheckboxProps> =
  (props) => {
    return (<div className={"w3-panel"}>
      <label htmlFor={props.name}><b>{props.label}</b></label>
      <input
        className={"w3-input"}
        type="checkbox"
        onChange={props.onChange}
        name={props.name}
      />
    </div>);
  };

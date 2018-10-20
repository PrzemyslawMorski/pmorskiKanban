import * as React from "react";
interface IInputProps {
    name: string;
    label: string;
    onChange: (event: React.FormEvent) => void;
    error: string;
    required: boolean;
    type: string;
    placeholder: string;
}
export declare const InputField: React.SFC<IInputProps>;
interface ICheckboxProps {
    name: string;
    label: string;
    onChange: (event: React.FormEvent) => void;
}
export declare const Checkbox: React.SFC<ICheckboxProps>;
export {};

import * as React from "react";

export interface IRegisterFormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterFormErrors = (formErrors: IRegisterFormErrors) => {
  const nameErrorText = formErrors.name.length > 0 ? `Name ${formErrors.name}` : "";
  const emailError = formErrors.email.length > 0 ? `Email ${formErrors.email}` : "";
  const passwordError = formErrors.password.length > 0 ? `Password ${formErrors.password}` : "";
  const confirmPasswordError = formErrors.confirmPassword.length > 0 ?
    `Confirm Password ${formErrors.confirmPassword}` : "";
  return (
    <div className="formErrors">
      <p>{nameErrorText}</p>
      <p>{emailError}</p>
      <p>{passwordError}</p>
      <p>{confirmPasswordError}</p>
    </div>
  );
};

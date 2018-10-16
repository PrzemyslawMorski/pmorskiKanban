import * as React from "react";

export interface ILoginFormErrors {
  email: string;
  password: string;
}

export const LoginFormErrors = (formErrors: ILoginFormErrors) => {
  const emailError = formErrors.email.length > 0 ? `Email ${formErrors.email}` : "";
  const passwordError = formErrors.password.length > 0 ? `Password ${formErrors.password}` : "";

  return (
    <div className="formErrors">
      <p>{emailError}</p>
      <p>{passwordError}</p>
    </div>
  );
};

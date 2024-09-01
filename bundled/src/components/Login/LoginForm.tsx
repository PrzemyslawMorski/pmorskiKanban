import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { showAlert } from "../../actions/alertActions";
import { IErrorResponse } from "../../dtos/error";
import { IAlert } from "../../entities/IAlert";
import { loginUser } from "../../services/authService";
import { InputField } from "../../shared-components/Input/InputField";
import { ILoginRequest } from "../../dtos/auth";

interface ILoginFormProps {
  showAlert: (alert: IAlert) => void;
}

class LoginFormComponent extends React.Component<ILoginFormProps> {
  public state = {
    email: "",
    emailValid: false,
    formErrors: { email: "", password: "" },
    formValid: false,
    password: "",
    passwordValid: false,
  };

  constructor(props: ILoginFormProps, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    return (
      <form
        className="w3-panel w3-padding-large w3-center"
        onSubmit={this.handleSubmit}
      >
        <div
          className={
            "w3-container w3-border w3-border-black w3-margin w3-round-large"
          }
        >
          <h3>Sign In</h3>
          <p>Please fill in this form to log in.</p>
        </div>

        <InputField
          name={"email"}
          label={"Email"}
          onChange={this.handleUserInput}
          error={this.state.formErrors.email}
          required={true}
          type={"text"}
          placeholder={"Enter Email"}
        />

        <InputField
          name={"password"}
          label={"Password"}
          onChange={this.handleUserInput}
          error={this.state.formErrors.password}
          required={true}
          type={"password"}
          placeholder={"Enter Password"}
        />

        <div className="w3-panel">
          <Link to="/">
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={!this.state.formValid}
            className="w3-button w3-theme-action w3-round-large"
          >
            Sign In
          </button>
        </div>

        <div>
          <span className="w3-panel">
            <Link style={{ textDecoration: "none" }} to="/forgot">
              <span className={"w3-text-blue"}>Forgot password?</span>
            </Link>
          </span>
        </div>
      </form>
    );
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    const fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "email":
        if (value.length === 0) {
          emailValid = false;
          fieldValidationErrors.email = "Email is required";
        } else if (
          value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null
        ) {
          emailValid = false;
          fieldValidationErrors.email = "Email is invalid";
        } else {
          emailValid = true;
          fieldValidationErrors.email = "";
        }
        break;
      case "password":
        if (value.length === 0) {
          passwordValid = false;
          fieldValidationErrors.password = "Password is required";
        } else if (value.length < 8) {
          passwordValid = false;
          fieldValidationErrors.password = "Password is too short";
        } else {
          passwordValid = true;
          fieldValidationErrors.password = "";
        }
        break;
      default:
        break;
    }
    this.setState(
      {
        emailValid,
        formErrors: fieldValidationErrors,
        passwordValid,
      },
      this.validateForm
    );
  }

  private validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    const loginRequest: ILoginRequest = {
      email: this.state.email,
      password: this.state.password,
    };
    loginUser(loginRequest).subscribe(
      undefined,
      (error: IErrorResponse) => {
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        const fieldValidationErrors = this.state.formErrors;

        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/user-not-found"
        ) {
          emailValid = false;
          fieldValidationErrors.email = error.message;
        } else if (
          error.code === "auth/weak-password" ||
          error.code === "auth/wrong-password"
        ) {
          passwordValid = false;
          fieldValidationErrors.password = error.message;
        } else {
          const alert: IAlert = {
            color: "w3-red",
            duration: 5000,
            text: error.message,
          };
          this.props.showAlert(alert);
        }

        this.setState(
          {
            emailValid,
            formErrors: fieldValidationErrors,
            passwordValid,
          },
          this.validateForm
        );
      },
      undefined
    );
    /* on complete, new user data is dispatched through firebase.onAuthStateChanged
    and Login page redirects to home page */
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
});

export const LoginForm = connect(
  undefined,
  mapDispatchToProps
)(LoginFormComponent);

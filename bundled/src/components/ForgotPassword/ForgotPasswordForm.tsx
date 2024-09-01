import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { showAlert } from "../../actions/alertActions";
import { IErrorResponse } from "../../dtos/error";
import { IAlert } from "../../entities/IAlert";
import { forgotPassword } from "../../services/authService";
import { InputField } from "../../shared-components/Input/InputField";

interface IForgotPasswordFormProps {
  showAlert: (alert: IAlert) => void;
}

class ForgotPasswordFormComponent extends React.Component<IForgotPasswordFormProps> {
  public state = {
    email: "",
    emailValid: false,
    formErrors: { email: "" },
    formValid: false,
    sentEmailResetMessage: false,
  };

  constructor(props: IForgotPasswordFormProps, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.sentEmailResetMessage) {
      return <Redirect to="/" />;
    }

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
          <h3>Forgot password</h3>
          <p>Please fill in this form to receive a password reset link.</p>
        </div>

        <div className="w3-panel">
          <InputField
            label="Email"
            error={this.state.formErrors.email}
            onChange={this.handleUserInput}
            required={true}
            name={"email"}
            type={"text"}
            placeholder={"Enter Email"}
          />
        </div>

        <div className="w3-panel">
          <Link
            to="/"
            className="w3-button w3-red w3-round-large w3-margin-right"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!this.state.formValid}
            className="w3-button w3-theme-action w3-round-large"
          >
            Reset password
          </button>
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
      default:
        break;
    }
    this.setState(
      {
        emailValid,
        formErrors: fieldValidationErrors,
      },
      this.validateForm
    );
  }

  private validateForm() {
    this.setState({
      formValid: this.state.emailValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (!this.state.emailValid || !this.state.formValid) {
      return;
    }

    forgotPassword(this.state.email).subscribe(
      undefined,
      (error: IErrorResponse) => {
        let emailValid = this.state.emailValid;
        const fieldValidationErrors = this.state.formErrors;

        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/user-not-found"
        ) {
          emailValid = false;
          fieldValidationErrors.email = error.message;
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
          },
          this.validateForm
        );
      },
      () => {
        this.setState({ sentEmailResetMessage: true });
        const alert: IAlert = {
          color: "w3-green",
          duration: 5000,
          text: "A password reset email was sent to your email address.",
        };
        this.props.showAlert(alert);
      }
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
});

export const ForgotPasswordForm = connect(
  undefined,
  mapDispatchToProps
)(ForgotPasswordFormComponent);

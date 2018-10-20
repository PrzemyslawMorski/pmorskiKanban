import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {IErrorResponse} from "../../dtos/auth";
import {forgotPassword} from "../../services/authService";
import {InputField} from "../../shared-components/InputField";

class ForgotPasswordFormComponent extends React.Component {
  public state = {
    email: "",
    emailValid: false,
    formErrors: {email: ""},
    formValid: false,
    sentEmailResetMessage: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.sentEmailResetMessage) {
      return <Redirect to="/"/>;
    }

    return (
      <form className="w3-container w3-panel w3-padding-large w3-center" onSubmit={this.handleSubmit}>
        <div className={"w3-container w3-border w3-border-gray w3-margin"}>
          <h1>Forgot password</h1>
          <p>Please fill in this form to receive a password reset link.</p>
        </div>

        <InputField
          label="Email"
          error={this.state.formErrors.email}
          onChange={this.handleUserInput}
          required={true}
          name={"email"}
          type={"text"}
          placeholder={"Enter Email"}
        />

        <div className="w3-panel">
          <Link to="/">
            <button type="button" className="w3-btn w3-red">Cancel</button>
          </Link>
          <button type="submit" disabled={!this.state.formValid} className="w3-btn w3-green">Reset Password</button>
        </div>
      </form>
    );
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({[name]: value}, () => {
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
        } else if (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
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
    this.setState({
      emailValid,
      formErrors: fieldValidationErrors,
    }, this.validateForm);
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

    forgotPassword(this.state.email)
      .subscribe(undefined, (error: IErrorResponse) => {
          let emailValid = this.state.emailValid;
          const fieldValidationErrors = this.state.formErrors;

          if (error.errorCode === "auth/invalid-email" || error.errorCode === "auth/user-not-found") {
            emailValid = false;
            fieldValidationErrors.email = error.error;
          } else {
            alert(error.error);
          }

          this.setState({
            emailValid,
            formErrors: fieldValidationErrors,
          }, this.validateForm);
        },
        () => {
          this.setState({registeredSuccessfully: true});
          alert("A password reset email was sent to your email address.");
        });
  }
}

export const ForgotPasswordForm = connect()(ForgotPasswordFormComponent);

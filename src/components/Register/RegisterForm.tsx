import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Link, Redirect} from "react-router-dom";
import {IErrorResponse, IRegisterRequest} from "../../dtos/auth";
import {IUser} from "../../entities/IUser";
import {registerUser} from "../../services/authService";
import {InputField} from "../../shared-components/InputField";
import {IState} from "../../store/storeStateInterface";

interface IRegisterFormProps {
  user: IUser | null;
}

class RegisterFormComponent extends React.Component<IRegisterFormProps, any> {
  public state = {
    confirmPassword: "",
    confirmPasswordValid: false,
    email: "",
    emailValid: false,
    formErrors: {name: "", email: "", password: "", confirmPassword: ""},
    formValid: false,
    name: "",
    nameValid: false,
    password: "",
    passwordValid: false,
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
    if (this.props.user !== null) {
      return <Redirect to="/"/>;
    }

    return (
      <form className="w3-container w3-panel w3-padding-large w3-center" onSubmit={this.handleSubmit}>
        <div className={"w3-container w3-border w3-border-gray w3-margin"}>
          <h3>Sign Up</h3>
          <p>Please fill in this form to create an account.</p>
          <p><b>Note that signing in with a third party provider creates a new account. Separate from your standard
            email/password one.</b></p>
        </div>

        <InputField
          label="Username"
          error={this.state.formErrors.name}
          onChange={this.handleUserInput}
          required={true}
          name={"name"}
          type={"text"}
          placeholder={"Enter Username"}
        />

        <InputField
          label="Email"
          error={this.state.formErrors.email}
          onChange={this.handleUserInput}
          required={true}
          name={"email"}
          type={"text"}
          placeholder={"Enter Email"}
        />

        <InputField
          label="Password"
          error={this.state.formErrors.password}
          onChange={this.handleUserInput}
          required={true}
          name={"password"}
          type={"password"}
          placeholder={"Enter Password"}
        />

        <InputField
          label="Repeat Password"
          error={this.state.formErrors.confirmPassword}
          onChange={this.handleUserInput}
          required={true}
          name={"confirmPassword"}
          type={"password"}
          placeholder={"Repeat Password"}
        />

        <div className="w3-panel">
          <Link to="/">
            <button type="button" className="w3-btn w3-red">Cancel</button>
          </Link>
          <button type="submit" disabled={!this.state.formValid} className="w3-btn w3-green">Sign Up</button>
        </div>
      </form>);
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
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length > 0;
        fieldValidationErrors.name = nameValid ? "" : "Username is required";
        break;
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
      case "confirmPassword":
        if (value.length === 0) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "Repeat Password is required";
        } else if (value.length < 8) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "Repeat Password is too short";
        } else if (value !== this.state.password) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "Repeat Password doesn't match Password";
        } else {
          confirmPasswordValid = true;
          fieldValidationErrors.confirmPassword = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      confirmPasswordValid,
      emailValid,
      formErrors: fieldValidationErrors,
      nameValid,
      passwordValid,
    }, this.validateForm);
  }

  private validateForm() {
    this.setState({
      formValid: this.state.nameValid &&
        this.state.emailValid &&
        this.state.passwordValid &&
        this.state.confirmPasswordValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (!this.state.nameValid ||
      !this.state.emailValid ||
      !this.state.passwordValid ||
      !this.state.confirmPasswordValid ||
      !this.state.formValid) {
      return;
    }

    const registerRequest: IRegisterRequest = {
      email: this.state.email, name: this.state.name, password: this.state.password,
    };

    registerUser(registerRequest)
      .subscribe(
        undefined,
        (error: IErrorResponse) => {
          let emailValid = this.state.emailValid;
          let passwordValid = this.state.passwordValid;
          const fieldValidationErrors = this.state.formErrors;

          if (error.errorCode === "auth/email-already-in-use" ||
            error.errorCode === "auth/invalid-email") {
            emailValid = false;
            fieldValidationErrors.email = error.error;
          } else if (error.errorCode === "auth/weak-password") {
            passwordValid = false;
            fieldValidationErrors.password = error.error;
          } else {
            alert(error.error);
          }

          this.setState({
            emailValid,
            formErrors: fieldValidationErrors,
            passwordValid,
          }, this.validateForm);
        },
        () => {
          alert("A verification email has been sent to your email address.");
        });
  }
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const RegisterForm = connect(mapStateToProps)(RegisterFormComponent);

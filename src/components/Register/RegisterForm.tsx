import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {Checkbox, InputField} from "../../shared-components/InputField";
import {registerUser} from "../../services/authService";
import {IErrorResponse, IRegisterRequest, IRegisterResponse} from "../../dtos/auth";

class RegisterFormComponent extends React.Component {
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
    registeredSuccessfully: false,
    rememberMe: false,
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
    if (this.state.registeredSuccessfully) {
      return <Redirect to="/login"/>;
    }

    return (
      <form className="w3-container w3-panel w3-padding-large w3-center" onSubmit={this.handleSubmit}>
        <div className={"w3-container w3-border w3-border-gray w3-margin"}>
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
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

        <Checkbox name={"rememberMe"} label={"Remember me"} onChange={this.handleUserInput}/>

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
    const isRememberMe = (event.target as HTMLInputElement).name === "rememberMe";

    const value = isRememberMe ? (event.target as HTMLInputElement).checked : (event.target as HTMLInputElement).value;
    if (isRememberMe) {
      this.setState({[name]: value});
    } else {
      this.setState({[name]: value}, () => {
        this.validateField(name, value as string);
      });
    }
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
      .subscribe((response: IRegisterResponse | IErrorResponse) => {
        if (response as IRegisterResponse !== null) {
          this.setState({registeredSuccessfully: true});
          alert("A verification email was sent to your account.");
        } else {
          const errorResponse = response as IErrorResponse;

          let emailValid = this.state.emailValid;
          let passwordValid = this.state.passwordValid;
          const fieldValidationErrors = this.state.formErrors;

          if (errorResponse.errorCode === "auth/email-already-in-use" ||
            errorResponse.errorCode === "auth/invalid-email") {
            emailValid = false;
            fieldValidationErrors.email = errorResponse.error;
          } else if (errorResponse.errorCode === "auth/weak-password") {
            passwordValid = false;
            fieldValidationErrors.password = errorResponse.error;
          } else {
            alert(errorResponse.error);
          }

          this.setState({
            emailValid,
            formErrors: fieldValidationErrors,
            passwordValid,
          }, this.validateForm);
        }
      });
  }
}

export const RegisterForm = connect()(RegisterFormComponent);

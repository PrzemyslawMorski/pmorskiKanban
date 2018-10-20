import * as _ from "lodash";
import * as React from "react";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {IErrorResponse, ILoginRequest} from "../../dtos/auth";
import {loginUser} from "../../services/authService";
import {Checkbox, InputField} from "../../shared-components/InputField";

export class LoginForm extends React.Component {
  public state = {
    email: "",
    emailValid: false,
    formErrors: {email: "", password: ""},
    formValid: false,
    loggedInSuccessfully: false,
    password: "",
    passwordValid: false,
    rememberMe: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.loggedInSuccessfully) {
      return <Redirect to="/"/>;
    }

    return (<form onSubmit={this.handleSubmit}>
      <div className="container">

        <div className={"w3-container w3-border w3-border-gray w3-margin"}>
          <h1>Sign In</h1>
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

        <Checkbox name={"rememberMe"} label={"Remember me"} onChange={this.handleUserInput}/>
      </div>

      <div className="w3-panel">
        <Link to="/">
          <button type="button" className="w3-btn w3-red">Cancel</button>
        </Link>
        <button type="submit" disabled={!this.state.formValid} className="w3-btn w3-green">Sign In</button>
      </div>

      <div>
        <span className="w3-panel">
          <Link style={{textDecoration: "none"}} to="/forgot">
            <span className={"w3-text-blue"}>Forgot password?</span>
          </Link>
        </span>
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
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

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
    this.setState({
      emailValid,
      formErrors: fieldValidationErrors,
      passwordValid,
    }, this.validateForm);
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
    loginUser(loginRequest).subscribe(() => {
        this.setState({loggedInSuccessfully: true});
      },
      (error: IErrorResponse) => {
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        const fieldValidationErrors = this.state.formErrors;

        if (error.errorCode === "auth/invalid-email" || error.errorCode === "auth/user-not-found") {
          emailValid = false;
          fieldValidationErrors.email = error.error;
        } else if (error.errorCode === "auth/weak-password" || error.errorCode === "auth/wrong-password") {
          passwordValid = false;
          fieldValidationErrors.password = error.error;
        } else {
          alert(`${error.errorCode}: ${error.error}`);
        }

        this.setState({
          emailValid,
          formErrors: fieldValidationErrors,
          passwordValid,
        }, this.validateForm);
      });
  }
}

import {Button, Classes, FormGroup, InputGroup} from "@blueprintjs/core";
import * as React from "react";
import {connect} from "react-redux";
import {isEmail} from "../../shared-components/helper-functions/isEmail";

class LoginFormComponent extends React.Component {
  public state = {
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <div>
        <form id="login-form" noValidate={true} onSubmit={this.handleSubmit}>
          <FormGroup
            label="E-mail"
            labelFor="emailInput"
            labelInfo="(required)"
            helperText={this.emailHelperText()}
            intent={this.emailIntent()}
          >
            <InputGroup
              id="emailInput"
              placeholder="eg. morski.przemek@gmail.com"
              value={this.state.email}
              onChange={this.handleEmailChange}
              intent={this.emailIntent()}
            />
          </FormGroup>

          <FormGroup
            label="Password"
            labelFor="passwordInput"
            labelInfo="(required)"
            helperText={this.passwordHelperText()}
            intent={this.passwordIntent()}
          >
            <InputGroup
              id="passwordInput"
              placeholder="eg. ********"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              intent={this.passwordIntent()}
            />
          </FormGroup>

          <input type="submit" value="Log in" className={`${Classes.BUTTON} ${Classes.INTENT_SUCCESS}`}/>

          <br/>
          <Button text="Log in with Google"/>
          <Button text="Log in with Facebook"/>
        </form>
      </div>
    );
  }

  private handleEmailChange(event: React.FormEvent) {
    this.setState({email: (event.target as HTMLInputElement).value, emailError: ""});
  }

  private handlePasswordChange(event: React.FormEvent) {
    this.setState({password: (event.target as HTMLInputElement).value, passwordError: ""});
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    let error = false;

    if (this.state.email === "") {
      this.setState({emailError: "Email is required"});
      error = true;
    } else if (!isEmail(this.state.email)) {
      this.setState({emailError: "Email is not a valid email"});
      error = true;
    }

    if (this.state.password === "") {
      this.setState({passwordError: "Password is required"});
      error = true;
    }

    if (!error) {
      this.login();
    }
  }

  private emailHelperText(): string {
    return this.state.emailError;
  }

  private emailIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    const isEmailError = this.state.emailError !== "";
    return isEmailError ? "danger" : "none";
  }

  private passwordHelperText(): string {
    const previousFormFieldsHaveErrors = this.state.emailError !== "";
    return previousFormFieldsHaveErrors ? "" : this.state.passwordError;
  }

  private passwordIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    const previousFormFieldsNoErrors = this.state.emailError === "";
    const isPasswordError = this.state.passwordError !== "";
    return previousFormFieldsNoErrors && isPasswordError ? "danger" : "none";
  }

  private login() {
    if (this.state.emailError !== "" || this.state.passwordError !== "") {
      return;
    }
  }
}

export const LoginForm = connect()(LoginFormComponent);

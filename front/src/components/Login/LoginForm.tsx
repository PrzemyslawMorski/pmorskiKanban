import { Button, Classes, FormGroup, InputGroup } from "@blueprintjs/core";
import * as React from "react";
import {connect} from "react-redux";
import {isEmail} from "../../shared-components/helper-functions/isEmail";

class LoginFormComponent extends React.Component {
  public state = {email: "", password: "", emailError: false, passwordError: false};

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
    this.setState({email: (event.target as HTMLInputElement).value, emailError: false});
  }

  private handlePasswordChange(event: React.FormEvent) {
    this.setState({password: (event.target as HTMLInputElement).value, passwordError: false});
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // let error = false;

    if (!isEmail(this.state.email) || this.state.email === "") {
      this.setState({emailError: true});
      // error = true;
    }

    if (this.state.password === "") {
      this.setState({passwordError: true});
      // error = true;
    }

    // if (!error) {
      // console.log("cool");
    // }
  }

  private emailHelperText(): string {
    if (this.state.email === "") {
      return "E-mail is required";
    }
    if (this.state.emailError) {
      return "This is not a valid e-mail";
    }
    return "";
  }

  private emailIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    return this.state.emailError ? "danger" : "none";
  }

  private passwordHelperText(): string {
    if (this.state.emailError || this.state.password !== "") {
      return "";
    } else if (this.state.passwordError) {
      return "Password is required";
    }
    return "";
  }

  private passwordIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    if (this.state.emailError || this.state.password !== "") {
      return "none";
    } else if (this.state.passwordError) {
      return "danger";
    }
    return "none";
  }
}

export const LoginForm = connect()(LoginFormComponent);

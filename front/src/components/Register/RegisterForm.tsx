import {Classes, FormGroup, InputGroup, Intent, Position, Toaster} from "@blueprintjs/core";
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {ResponseStatus} from "../../services/constants";
import {registerHttpCall} from "../../services/userService";
import {IRegisterBadRequestResponse, IRegisterRequest} from "../../dtos/User";
import {isEmail} from "../../shared-components/helper-functions/isEmail";
import {isPassword} from "../../shared-components/helper-functions/isPassword";

class RegisterFormComponent extends React.Component {
  public state = {
    email: "",
    emailError: "",
    name: "",
    nameError: "",
    password: "",
    passwordError: "",
    registeredSuccessfully: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.registeredSuccessfully) {
      return <Redirect to="/login"/>;
    }

    return (
      <div>
        <form id="register-form" noValidate={true} onSubmit={this.handleSubmit}>
          <FormGroup
            label="Name"
            labelFor="nameInput"
            labelInfo="(required)"
            helperText={this.nameHelperText()}
            intent={this.nameIntent()}
          >
            <InputGroup
              id="nameInput"
              placeholder="eg. Przemysław Morski"
              value={this.state.name}
              onChange={this.handleNameChange}
              intent={this.nameIntent()}
            />
          </FormGroup>

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

          <input type="submit" value="Register" className={`${Classes.BUTTON} ${Classes.INTENT_SUCCESS}`}/>
        </form>
      </div>
    );
  }

  private handleNameChange(event: React.FormEvent) {
    this.setState({name: (event.target as HTMLInputElement).value, nameError: ""});
  }

  private handleEmailChange(event: React.FormEvent) {
    this.setState({email: (event.target as HTMLInputElement).value, emailError: ""});
  }

  private handlePasswordChange(event: React.FormEvent) {
    this.setState({password: (event.target as HTMLInputElement).value, passwordError: ""});
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    let error = false;

    if (this.state.name === "") {
      this.setState({nameError: "Name is required"});
      error = true;
    }

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
    } else if (!isPassword(this.state.password)) {
      this.setState({passwordError: "Password needs to be at least 8 characters long"});
      error = true;
    }

    if (!error) {
      this.register();
    }
  }

  private nameHelperText(): string {
    return this.state.nameError;
  }

  private nameIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    return this.state.nameError !== "" ? "danger" : "none";
  }

  private emailHelperText(): string {
    return this.state.nameError === "" ? this.state.emailError : "";
  }

  private emailIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    const noNameError = this.state.nameError === "";
    const isEmailError = this.state.emailError !== "";
    return noNameError && isEmailError ? "danger" : "none";
  }

  private passwordHelperText(): string {
    const previousFormFieldsHaveErrors = this.state.nameError !== "" ||
      this.state.emailError !== "";
    return previousFormFieldsHaveErrors ? "" : this.state.passwordError;
  }

  private passwordIntent(): "none" | "primary" | "warning" | "danger" | undefined {
    const previousFormFieldsNoErrors = this.state.nameError === "" &&
      this.state.emailError === "";
    const isPasswordError = this.state.passwordError !== "";
    return previousFormFieldsNoErrors && isPasswordError ? "danger" : "none";
  }

  private register() {
    if (this.state.nameError === "" ||
      this.state.emailError === "" ||
      this.state.passwordError === "") {
      return;
    }

    const registerDto: IRegisterRequest = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
    };

    registerHttpCall(registerDto)
      .subscribe((response: Response) => {
        if (response.status === ResponseStatus.Ok) {
          Toaster.create({
            className: "recipe-toaster",
            position: Position.TOP,
          }).show({
            intent: Intent.SUCCESS,
            message: "Registered successfully.",
            timeout: 2000,
          });
          this.setState({registeredSuccessfully: true});
        } else if (response.status === ResponseStatus.ServerError) {
          Toaster.create({
            className: "recipe-toaster",
            position: Position.TOP,
          }).show({
            intent: Intent.DANGER,
            message: JSON.stringify(response.body),
            timeout: 5000,
          });
        } else if (response.status === ResponseStatus.BadRequest) {
          response.json().then((badRequest: IRegisterBadRequestResponse) => {
            if (badRequest.emailError != null) {
              this.setState({emailError: badRequest.emailError});
            }

            if (badRequest.nameError != null) {
              this.setState({nameError: badRequest.nameError});
            }

            if (badRequest.passwordError != null) {
              this.setState({passwordError: badRequest.passwordError});
            }
          });
        }
      }, () => {
        Toaster.create({
          className: "recipe-toaster",
          position: Position.TOP,
        }).show({
          intent: Intent.DANGER,
          message: "Our servers seem to be down. Please try again later.",
          timeout: 5000,
        });
      });
  }
}

export const RegisterForm = connect()(RegisterFormComponent);

import {Classes, FormGroup, InputGroup, Intent, Position, Toaster} from "@blueprintjs/core";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {userLoggedIn} from "../../actions/userActions";
import {ILoginBadRequestResponse, ILoginRequest, ILoginSuccessResponse} from "../../dtos/User";
import {IUser} from "../../entities/User";
import {ResponseStatus} from "../../services/constants";
import {saveToken} from "../../services/tokenService";
import {loginHttpCall} from "../../services/userService";
import {isEmail} from "../../shared-components/helper-functions/isEmail";
import {isPassword} from "../../shared-components/helper-functions/isPassword";

interface ILoginFormComponentProps {
  onLoggedIn: (user: IUser) => void;
}

class LoginFormComponent extends React.Component<ILoginFormComponentProps, {}> {
  public state = {
    credentialsError: "",
    email: "",
    emailError: "",
    loggedInSuccessfully: false,
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
    if (this.state.loggedInSuccessfully) {
      return <Redirect to="/"/>;
    }

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

          {this.credentialsError()}

          <input type="submit" value="Log in" className={`${Classes.BUTTON} ${Classes.INTENT_SUCCESS}`}/>

          <br/>
        </form>
      </div>
    );
  }

  private handleEmailChange(event: React.FormEvent) {
    this.setState({email: (event.target as HTMLInputElement).value, emailError: "", credentialsError: ""});
  }

  private handlePasswordChange(event: React.FormEvent) {
    this.setState({password: (event.target as HTMLInputElement).value, passwordError: "", credentialsError: ""});
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
    } else if (!isPassword(this.state.password)) {
      this.setState({passwordError: "Password needs to be at least 8 characters long"});
      error = true;
    }

    if (this.state.credentialsError !== "") {
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

  private credentialsError(): JSX.Element | null {
    if (this.state.credentialsError === "") {
      return null;
    } else {
      return <FormGroup helperText={this.state.credentialsError} intent={"danger"}/>;
    }
  }

  private login() {
    if (this.state.emailError !== "" || this.state.passwordError !== "") {
      return;
    }

    const loginDto: ILoginRequest = {
      email: this.state.email,
      password: this.state.password,
    };

    loginHttpCall(loginDto)
      .subscribe((response: Response) => {
        if (response.status === ResponseStatus.Ok) {
          response.json().then((success: ILoginSuccessResponse) => {
            const user: IUser = {id: success.userId, name: success.userName, email: success.userEmail};
            const token: string = success.token;

            this.props.onLoggedIn(user);
            saveToken(token);

            this.setState({loggedInSuccessfully: true});
            Toaster.create({
              className: "recipe-toaster",
              position: Position.TOP,
            }).show({
              intent: Intent.SUCCESS,
              message: "Logged in successfully.",
              timeout: 2000,
            });
          });
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
          response.json().then((badRequest: ILoginBadRequestResponse) => {
            if (badRequest.emailError != null) {
              this.setState({emailError: badRequest.emailError});
            }

            if (badRequest.passwordError != null) {
              this.setState({passwordError: badRequest.passwordError});
            }

            if (badRequest.credentialsError != null) {
              this.setState({credentialsError: badRequest.credentialsError});
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

const mapDispatchToProps = (dispatch: any) => {
  return ({
    onLoggedIn: (user: IUser) => dispatch(userLoggedIn(user)),
  });
};

export const LoginForm = connect(null, mapDispatchToProps)(LoginFormComponent);

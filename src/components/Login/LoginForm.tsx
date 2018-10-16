import * as React from "react";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import "./LoginForm.css";
import {LoginFormErrors} from "./LoginFormErrors";
import * as _ from "lodash";

class LoginFormComponent extends React.Component {
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

    return (
      <div>
        <form id="login-form" onSubmit={this.handleSubmit}>
          <div className="container">
            <h1>Sign In</h1>
            <p>Please fill in this form to log in.</p>
            <hr/>

            <label htmlFor="email"><b>Email</b></label>
            <input
              className={`${this.errorClass(this.state.formErrors.email)}`}
              type="text"
              onChange={this.handleUserInput}
              placeholder="Enter Email"
              name="email"
              required={true}
            />

            <label htmlFor="password"><b>Password</b></label>

            <input
              className={`${this.errorClass(this.state.formErrors.password)}`}
              type="password"
              onChange={this.handleUserInput}
              placeholder="Enter Password"
              name="password"
              required={true}
            />

            <label htmlFor="rememberMe">Remember me</label>
            <input
              type="checkbox"
              onChange={this.handleUserInput}
              checked={this.state.rememberMe}
              name="rememberMe"
              style={{marginBottom: 15}}
            />
          </div>

          <div className="panel panel-default">
            <LoginFormErrors {...this.state.formErrors}/>
          </div>

          <div className="clearfix">
            <Link to="/">
              <button type="button" className="cancelbtn failbtn">Cancel</button>
            </Link>
            <button type="submit" disabled={!this.state.formValid} className="loginbtn successbtn">Sign Up</button>
          </div>
          <div>
            <span className="psw">
              Forgot <Link style={{textDecoration: "none"}} to="/forgot"><span>password?</span></Link>
            </span>
          </div>
        </form>
      </div>
    );
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
          fieldValidationErrors.email = "is required";
        } else if (value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) === null) {
          emailValid = false;
          fieldValidationErrors.email = "is invalid";
        } else {
          emailValid = true;
          fieldValidationErrors.email = "";
        }
        break;
      case "password":
        if (value.length === 0) {
          passwordValid = false;
          fieldValidationErrors.password = "is required";
        } else if (value.length < 8) {
          passwordValid = false;
          fieldValidationErrors.password = "is too short";
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

  private errorClass(error: string) {
    return (error.length === 0 ? "" : "has-error");
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    // firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    //   .then(() => {
    //     // const token: string = success.token;
    //     //
    //     // this.props.onLoggedIn(user);
    //     // saveToken(token);
    //
    //     this.setState({loggedInSuccessfully: true});
    //
    //   }).catch(() => {    });

    // response.json().then((badRequest: ILoginBadRequestResponse) => {
    //   if (badRequest.emailError != null) {
    //     this.setState({emailError: badRequest.emailError});
    //   }
    //
    //   if (badRequest.passwordError != null) {
    //     this.setState({passwordError: badRequest.passwordError});
    //   }
    //
    //   if (badRequest.credentialsError != null) {
    //     this.setState({credentialsError: badRequest.credentialsError});
    //   }
    // });
  }
}

// const mapDispatchToProps = (dispatch: any) => {
//   return ({
//     onLoggedIn: (user: IUser) => dispatch(userLoggedIn(user)),
//   });
// };

export const LoginForm = LoginFormComponent;

import * as React from "react";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import "./LoginForm.css";

class LoginFormComponent extends React.Component {
  public state = {
    email: "",
    loggedInSuccessfully: false,
    password: "",
    rememberMe: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

            <label htmlFor="uname"><b>Username</b></label>
            <input
              type="text"
              onChange={this.handleEmailChange}
              placeholder="Enter Username"
              name="uname"
              required={true}
            />

            <label htmlFor="psw"><b>Password</b></label>

            <input
              type="password"
              onChange={this.handlePasswordChange}
              placeholder="Enter Password"
              name="psw"
              required={true}
            />

            <label>
              <input
                type="checkbox"
                onChange={this.handleRememberMeChange}
                checked={this.state.rememberMe}
                name="remember"
              />
              Remember me
            </label>
          </div>

          <div className="clearfix">
            <Link to="/">
              <button type="button" className="cancelbtn failbtn">Cancel</button>
            </Link>
            <button type="submit" className="loginbtn successbtn">Sign Up</button>
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

  private handleEmailChange(event: React.FormEvent) {
    this.setState({email: (event.target as HTMLInputElement).value, emailError: "", credentialsError: ""});
  }

  private handlePasswordChange(event: React.FormEvent) {
    this.setState({password: (event.target as HTMLInputElement).value, passwordError: "", credentialsError: ""});
  }

  private handleRememberMeChange(event: React.FormEvent) {
    this.setState({rememberMe: (event.target as HTMLInputElement).checked});
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.login();
  }

  private login() {
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

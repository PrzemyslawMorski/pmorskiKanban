import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import "./RegisterForm.css";

class RegisterFormComponent extends React.Component {
  public state = {
    confirmPassword: "",
    confirmPasswordError: "",
    email: "",
    emailError: "",
    name: "",
    nameError: "",
    password: "",
    passwordError: "",
    registeredSuccessfully: false,
    rememberMe: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.registeredSuccessfully) {
      return <Redirect to="/login"/>;
    }

    return (
      <div>
        <form id="register-form" onSubmit={this.handleSubmit}>
          <div className="container">
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>
            <hr/>
            <label htmlFor="name"><b>Username</b></label>
            <input
              type="text"
              onChange={this.handleUserInput}
              placeholder="Enter Username"
              name="name"
              required={true}
            />

            <label htmlFor="email"><b>Email</b></label>
            <input
              type="text"
              onChange={this.handleUserInput}
              placeholder="Enter Email"
              name="email"
              required={true}
            />

            <label htmlFor="password"><b>Password</b></label>
            <input
              type="password"
              onChange={this.handleUserInput}
              placeholder="Enter Password"
              name="password"
              required={true}
            />

            <label><b>Repeat Password</b></label>
            <input
              type="password"
              onChange={this.handleUserInput}
              placeholder="Repeat Password"
              name="confirmPassword"
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

            <p>
              By creating an account you agree to our <a href="#" style={{color: "dodgerblue"}}>Terms & Privacy</a>.
            </p>

            <div className="clearfix">
              <Link to="/">
                <button type="button" className="cancelbtn failbtn">Cancel</button>
              </Link>
              <button type="submit" className="signupbtn successbtn">Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    )
      ;
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const isRememberMe = (event.target as HTMLInputElement).name === "rememberMe";

    const value = isRememberMe ? (event.target as HTMLInputElement).checked : (event.target as HTMLInputElement).value;
    this.setState({[name]: value});
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    this.register();
  }

  private register() {
    // if (this.state.nameError !== "" ||
    //   this.state.emailError !== "" ||
    //   this.state.passwordError !== "") {
    //   return;
    // }

    // firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    //   .then(() => {
    //       timeout: 5000,
    //     });
    //   })
    //   .catch((error) => {
    //     Toaster.create({
    //       className: "recipe-toaster",
    //       position: Position.TOP,
    //     }).show({
    //       intent: Intent.DANGER,
    //       message: error.message,
    //       timeout: 5000,
    //     });
    //   });
  }
}

export const RegisterForm = connect()(RegisterFormComponent);

import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import {RegisterFormErrors} from "./RegisterFormErrors";
import "./RegisterForm.css";
import * as firebase from "firebase";
import UserCredential = firebase.auth.UserCredential;

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
      <div>
        <form id="register-form" onSubmit={this.handleSubmit}>
          <div className="container">
            <h1>Sign Up</h1>
            <p>Please fill in this form to create an account.</p>
            <hr/>
            <label htmlFor="name"><b>Username</b></label>
            <input
              className={`${this.errorClass(this.state.formErrors.name)}`}
              type="text"
              onChange={this.handleUserInput}
              placeholder="Enter Username"
              name="name"
              required={true}
            />

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

            <label><b>Repeat Password</b></label>
            <input
              className={`${this.errorClass(this.state.formErrors.confirmPassword)}`}
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

            <div className="panel panel-default">
              <RegisterFormErrors {...this.state.formErrors}/>
            </div>

            <p>
              By creating an account you agree to our <a href="#" style={{color: "dodgerblue"}}>Terms & Privacy</a>.
            </p>

            <div className="clearfix">
              <Link to="/">
                <button type="button" className="cancelbtn failbtn">Cancel</button>
              </Link>
              <button type="submit" disabled={!this.state.formValid} className="signupbtn successbtn">Sign Up</button>
            </div>
          </div>
        </form>

      </div>);
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
        fieldValidationErrors.name = nameValid ? "" : " is required";
        break;
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
      case "confirmPassword":
        if (value.length === 0) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "is required";
        } else if (value.length < 8) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "is too short";
        } else if (value !== this.state.password) {
          confirmPasswordValid = false;
          fieldValidationErrors.confirmPassword = "doesn't match Password";
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

  private errorClass(error: string) {
    return (error.length === 0 ? "" : "has-error");
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

    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((credentials: UserCredential) => {

        if (credentials.user !== null && credentials.credential !== null) {
          credentials.user.sendEmailVerification()
            .then(() => {
              // TODO set username and photoURL in db, send confirmation email, and show info that confirmation email was sent
              // TODO save uid
              this.setState({registeredSuccessfully: true});
              alert("A verification email was sent to your account.");
            })
            .catch(() => {
              alert("Your account was created but something went wrong when sending you an email confirmation email." +
                " Please contact our support staff.");
            });
        }
      })
      .catch((error) => {
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;
        const fieldValidationErrors = this.state.formErrors;

        if (error.code === "auth/email-already-in-use" || error.code === "auth/invalid-email") {
          emailValid = false;
          fieldValidationErrors.email = error.message;
        } else if (error.code === "auth/weak-password") {
          passwordValid = false;
          fieldValidationErrors.password = error.message;
        }

        this.setState({
          emailValid,
          formErrors: fieldValidationErrors,
          passwordValid,
        }, this.validateForm);
      });
  }
}

export const RegisterForm = connect()(RegisterFormComponent);

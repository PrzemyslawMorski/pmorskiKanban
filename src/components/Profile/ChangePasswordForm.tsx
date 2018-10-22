import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {newUsername} from "../../actions/userActions";
import {IUser} from "../../entities/IUser";
import {InputField} from "../../shared-components/InputField";
import {IState} from "../../store/storeStateInterface";

interface IChangePasswordProps {
  user: IUser | null;
}

export class ChangePasswordFormComponent extends React.Component<IChangePasswordProps> {
  public state = {
    currentPassword: "",
    currentPasswordValid: false,
    formErrors: {currentPassword: "", newPassword: "", repeatNewPassword: ""},
    formValid: false,
    newPassword: "",
    newPasswordValid: false,
    repeatNewPassword: "",
    repeatNewPasswordValid: false,
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
    const isExternalProviderAccount = false;

    return (
      <div className={"w3-container w3-panel w3-padding-large w3-center"}>
        <h3>Change password</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"currentPassword"}
            label={"Current Password"}
            onChange={this.handleUserInput}
            error={this.state.formErrors.currentPassword}
            required={true}
            disabled={isExternalProviderAccount}
            type={"password"}
            value={this.state.currentPassword}
            placeholder={"Enter current password"}
          />

          <InputField
            name={"newPassword"}
            label={"New Password"}
            onChange={this.handleUserInput}
            error={this.state.formErrors.newPassword}
            required={true}
            disabled={isExternalProviderAccount}
            type={"password"}
            value={this.state.newPassword}
            placeholder={"Enter new password"}
          />

          <InputField
            name={"repeatNewPassword"}
            label={"Repeat New Password"}
            onChange={this.handleUserInput}
            error={this.state.formErrors.repeatNewPassword}
            required={true}
            disabled={isExternalProviderAccount}
            type={"password"}
            value={this.state.repeatNewPassword}
            placeholder={"Repeat new password"}
          />

          <div className="w3-panel">
            <button type="submit" disabled={!this.state.formValid} className="w3-btn w3-green">Change Password</button>
          </div>
        </form>
      </div>
    );
  }

  private handleUserInput(event: React.FormEvent) {
    const name = (event.target as HTMLInputElement).name;
    const value = (event.target as HTMLInputElement).value;
    this.setState({[name]: value}, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    const fieldValidationErrors = this.state.formErrors;
    let currentPasswordValid = this.state.currentPasswordValid;
    let newPasswordValid = this.state.newPasswordValid;
    let repeatNewPasswordValid = this.state.repeatNewPasswordValid;

    switch (fieldName) {
      case "currentPassword":
        if (value.length === 0) {
          currentPasswordValid = false;
          fieldValidationErrors.currentPassword = "Current password is required";
        } else if (value.length < 8) {
          currentPasswordValid = false;
          fieldValidationErrors.currentPassword = "Current password is too short";
        } else {
          currentPasswordValid = true;
          fieldValidationErrors.currentPassword = "";
        }
        break;
      case "newPassword":
        if (value.length === 0) {
          newPasswordValid = false;
          fieldValidationErrors.newPassword = "New password is required";
        } else if (value.length < 8) {
          newPasswordValid = false;
          fieldValidationErrors.newPassword = "New password is too short";
        } else {
          newPasswordValid = true;
          fieldValidationErrors.newPassword = "";
        }
        break;
      case "repeatNewPassword":
        if (value.length === 0) {
          repeatNewPasswordValid = false;
          fieldValidationErrors.repeatNewPassword = "Repeat new password is required";
        } else if (value.length < 8) {
          repeatNewPasswordValid = false;
          fieldValidationErrors.repeatNewPassword = "Repeat new password is too short";
        } else if (value !== this.state.newPassword) {
          repeatNewPasswordValid = false;
          fieldValidationErrors.repeatNewPassword = "Repeat new password is not the same as New password";
        } else {
          repeatNewPasswordValid = true;
          fieldValidationErrors.repeatNewPassword = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      currentPasswordValid,
      formErrors: fieldValidationErrors,
      newPasswordValid,
      repeatNewPasswordValid,
    }, this.validateForm);
  }

  private validateForm() {
    this.setState({
      formValid: this.state.currentPasswordValid &&
        this.state.newPasswordValid &&
        this.state.repeatNewPasswordValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (!this.state.currentPasswordValid ||
      !this.state.newPasswordValid ||
      !this.state.repeatNewPasswordValid ||
      !this.state.formValid) {
      return;
    }

    // firebase.auth().currentUser!.updatePassword(this.state.newPassword)
    //   .then(() => {
    //
    //   })
    //   .catch((error: firebase.auth.Error) => {
    //     let newPasswordValid = this.state.newPasswordValid;
    //     const fieldValidationErrors = this.state.formErrors;
    //
    //     if (error.code === "auth/email-already-in-use" ||
    //       error.code === "auth/invalid-email") {
    //       emailValid = false;
    //       fieldValidationErrors.email = error.message;
    //     } else if (error.errorCode === "auth/weak-password") {
    //       passwordValid = false;
    //       fieldValidationErrors.password = error.message;
    //     } else {
    //       alert(error.message);
    //     }
    //
    //     this.setState({
    //       emailValid,
    //       formErrors: fieldValidationErrors,
    //       passwordValid,
    //     }, this.validateForm);
    //   );

    // const registerRequest: IChangePasswordRequest = {
    //   email: this.props.user!.email,
    //   currentPasswordname: this.state.name, password: this.state.password,
    // };
    //
    // registerUser(registerRequest)
    //   .subscribe(
    //     undefined,
    //     (error: IErrorResponse) => {
    //       let emailValid = this.state.emailValid;
    //       let passwordValid = this.state.passwordValid;
    //       const fieldValidationErrors = this.state.formErrors;
    //
    //       if (error.errorCode === "auth/email-already-in-use" ||
    //         error.errorCode === "auth/invalid-email") {
    //         emailValid = false;
    //         fieldValidationErrors.email = error.error;
    //       } else if (error.errorCode === "auth/weak-password") {
    //         passwordValid = false;
    //         fieldValidationErrors.password = error.error;
    //       } else {
    //         alert(error.error);
    //       }
    //
    //       this.setState({
    //         emailValid,
    //         formErrors: fieldValidationErrors,
    //         passwordValid,
    //       }, this.validateForm);
    //     },
    //     () => {
    //       alert("A verification email has been sent to your email address.");
    //     });
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onNewName: (username: string) => dispatch(newUsername(username)),
  };
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const ChangePasswordForm = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordFormComponent);

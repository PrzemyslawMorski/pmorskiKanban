import * as firebase from "firebase";
import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {newUsername} from "../../actions/userActions";
import {IUser} from "../../entities/IUser";
import {InputField} from "../../shared-components/InputField";
import {IState} from "../../store/storeStateInterface";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;

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
            type={"password"}
            value={this.state.repeatNewPassword}
            placeholder={"Repeat new password"}
          />

          <div className="w3-panel">
            <button
              type="submit"
              disabled={!this.state.formValid}
              className="w3-btn w3-green"
            >
              Change Password
            </button>
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

    firebase.auth().currentUser!
      .reauthenticateAndRetrieveDataWithCredential(
        EmailAuthProvider.credential(this.props.user!.email, this.state.currentPassword),
      )
      .then(() => {
        firebase.auth().currentUser!.updatePassword(this.state.newPassword)
          .then(() => {
            alert("Your password was successfully changed.");
          })
          .catch((error: firebase.auth.Error) => {
            let newPassword = this.state.newPasswordValid;
            const fieldValidationErrors = this.state.formErrors;

            if (error.message === "auth/weak-password" || error.code === "auth/wrong-password") {
              alert(`${error.code}: ${error.message}`);
            } else if (error.message === "auth/weak-password" || error.code === "auth/wrong-password") {
              newPassword = false;
              fieldValidationErrors.newPassword = error.message;
            }

            this.setState({
              formErrors: fieldValidationErrors,
              newPassword,
            }, this.validateForm);

            alert(error.message);
          });
      }).catch((error) => {
      let currentPasswordValid = this.state.currentPasswordValid;
      const fieldValidationErrors = this.state.formErrors;

      if (error.code === "auth/invalid-email" || error.code === "auth/user-not-found") {
        alert(`${error.code}: ${error.message}`);
      } else if (error.message === "auth/weak-password" || error.code === "auth/wrong-password") {
        currentPasswordValid = false;
        fieldValidationErrors.currentPassword = error.message;
      }

      this.setState({
        currentPasswordValid,
        formErrors: fieldValidationErrors,
      }, this.validateForm);
    });
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

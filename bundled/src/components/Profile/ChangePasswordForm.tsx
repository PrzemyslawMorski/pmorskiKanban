import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { showAlert } from "../../actions/alertActions";
import { newUsername } from "../../actions/userActions";
import { IErrorResponse } from "../../dtos/error";
import { IAlert } from "../../entities/IAlert";
import { IUser } from "../../entities/IUser";
import { changePassword } from "../../services/authService";
import { InputField } from "../../shared-components/Input/InputField";
import { IState } from "../../store/storeStateInterface";

interface IChangePasswordProps {
  user: IUser | null;
  showAlert: (alert: IAlert) => void;
}

export class ChangePasswordFormComponent extends React.Component<IChangePasswordProps> {
  public state = {
    currentPassword: "",
    currentPasswordValid: false,
    formErrors: { currentPassword: "", newPassword: "", repeatNewPassword: "" },
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
      <div className="w3-padding">
        <h3 style={{ textAlign: "left" }}>Change password</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"currentPassword"}
            label={"Password"}
            onChange={this.handleUserInput}
            error={this.state.formErrors.currentPassword}
            required={true}
            type={"password"}
            value={this.state.currentPassword}
            placeholder={"Enter password"}
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
            label={"Confirm New Password"}
            onChange={this.handleUserInput}
            error={this.state.formErrors.repeatNewPassword}
            required={true}
            type={"password"}
            value={this.state.repeatNewPassword}
            placeholder={"Confirm new password"}
          />

          <div className="w3-margin-top">
            <button
              type="submit"
              disabled={!this.state.formValid}
              className="w3-left w3-button w3-theme-action w3-round-large"
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
    this.setState({ [name]: value }, () => {
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
          fieldValidationErrors.currentPassword =
            "Current password is required";
        } else if (value.length < 8) {
          currentPasswordValid = false;
          fieldValidationErrors.currentPassword =
            "Current password is too short";
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
          fieldValidationErrors.repeatNewPassword =
            "Repeat new password is required";
        } else if (value.length < 8) {
          repeatNewPasswordValid = false;
          fieldValidationErrors.repeatNewPassword =
            "Repeat new password is too short";
        } else if (value !== this.state.newPassword) {
          repeatNewPasswordValid = false;
          fieldValidationErrors.repeatNewPassword =
            "Repeat new password is not the same as New password";
        } else {
          repeatNewPasswordValid = true;
          fieldValidationErrors.repeatNewPassword = "";
        }
        break;
      default:
        break;
    }
    this.setState(
      {
        currentPasswordValid,
        formErrors: fieldValidationErrors,
        newPasswordValid,
        repeatNewPasswordValid,
      },
      this.validateForm
    );
  }

  private validateForm() {
    this.setState({
      formValid:
        this.state.currentPasswordValid &&
        this.state.newPasswordValid &&
        this.state.repeatNewPasswordValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (
      !this.state.currentPasswordValid ||
      !this.state.newPasswordValid ||
      !this.state.repeatNewPasswordValid ||
      !this.state.formValid
    ) {
      return;
    }

    changePassword(
      this.state.currentPassword,
      this.state.newPassword
    ).subscribe(
      undefined,
      (error: IErrorResponse) => {
        let currentPasswordValid = this.state.currentPasswordValid;
        let newPasswordValid = this.state.newPasswordValid;
        const fieldValidationErrors = this.state.formErrors;

        if (error.code === "auth/wrong-password") {
          currentPasswordValid = false;
          fieldValidationErrors.currentPassword = error.message;
        } else if (error.code === "auth/weak-password") {
          newPasswordValid = false;
          fieldValidationErrors.newPassword = error.message;
        } else {
          const alert: IAlert = {
            color: "w3-red",
            duration: 5000,
            text: error.message,
          };
          this.props.showAlert(alert);
        }

        this.setState(
          {
            currentPasswordValid,
            formErrors: fieldValidationErrors,
            newPasswordValid,
          },
          this.validateForm
        );
      },
      () => {
        const alert: IAlert = {
          color: "w3-green",
          duration: 5000,
          text: "Your password was successfully changed.",
        };
        this.props.showAlert(alert);
        this.setState({
          currentPassword: "",
          currentPasswordValid: false,
          formErrors: {
            currentPassword: "",
            newPassword: "",
            repeatNewPassword: "",
          },
          formValid: false,
          newPassword: "",
          newPasswordValid: false,
          repeatNewPassword: "",
          repeatNewPasswordValid: false,
        });
      }
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onNewName: (username: string) => dispatch(newUsername(username)),
    showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
  };
}

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export const ChangePasswordForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordFormComponent);

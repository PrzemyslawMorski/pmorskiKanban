import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { showAlert } from "../../actions/alertActions";
import { IErrorResponse } from "../../dtos/error";
import { IAlert } from "../../entities/IAlert";
import { deleteAccount } from "../../services/authService";
import { InputField } from "../../shared-components/Input/InputField";

interface IDeleteAccountProps {
  email: string;
  showAlert: (alert: IAlert) => void;
}

class DeleteAccountFormComponent extends React.Component<IDeleteAccountProps> {
  public state = {
    currentPassword: "",
    currentPasswordError: "",
    deletePhrase: "",
    deletePhraseError: "",
    formValid: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render(): JSX.Element {
    return (
      <div className="w3-padding">
        <h3 style={{ textAlign: "left" }}>Delete account</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"currentPassword"}
            label={"Password"}
            onChange={this.handleUserInput}
            error={this.state.currentPasswordError}
            required={true}
            type={"password"}
            placeholder={"Enter password"}
          />

          <InputField
            name={"deletePhrase"}
            label={"Delete phrase"}
            onChange={this.handleUserInput}
            error={this.state.deletePhraseError}
            required={true}
            type={"text"}
            placeholder={"Enter 'delete'"}
          />

          <div className="w3-margin-top">
            <button
              type="submit"
              disabled={!this.state.formValid}
              className="w3-left w3-button w3-red w3-hover-red w3-round-large"
            >
              Delete account
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
    let deletePhraseError = this.state.deletePhraseError;
    let currentPasswordError = this.state.currentPasswordError;

    switch (fieldName) {
      case "deletePhrase":
        deletePhraseError =
          value !== "delete"
            ? "Type in 'delete' to confirm account deletion."
            : "";
        break;
      case "currentPassword":
        if (value.length === 0) {
          currentPasswordError = "Current password is required";
        } else if (value.length < 8) {
          currentPasswordError = "Current password is too short";
        } else {
          currentPasswordError = "";
        }
        break;
      default:
        break;
    }
    this.setState(
      {
        currentPasswordError,
        deletePhraseError,
      },
      this.validateForm
    );
  }

  private validateForm() {
    this.setState({
      formValid:
        this.state.currentPasswordError === "" &&
        this.state.deletePhraseError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (
      this.state.currentPasswordError !== "" ||
      this.state.deletePhraseError !== ""
    ) {
      return;
    }

    deleteAccount(this.state.currentPassword).subscribe(
      undefined,
      (error: IErrorResponse) => {
        let currentPasswordError = this.state.currentPasswordError;
        if (error.code === "auth/wrong-password") {
          currentPasswordError = error.message;
        } else {
          const alert: IAlert = {
            color: "w3-red",
            duration: 5000,
            text: error.message,
          };
          this.props.showAlert(alert);
        }

        this.setState({
          currentPasswordError,
        });
      },
      () => {
        const alert: IAlert = {
          color: "w3-green",
          duration: 5000,
          text: "Your account was successfully deleted.",
        };
        this.props.showAlert(alert);
        // account deleted so no need to reset state because user will be redirected to home page
      }
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
  };
}

export const DeleteAccountForm = connect(
  undefined,
  mapDispatchToProps
)(DeleteAccountFormComponent);

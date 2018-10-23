import * as firebase from "firebase";
import EmailAuthProvider = firebase.auth.EmailAuthProvider;
import * as _ from "lodash";
import * as React from "react";
import {InputField} from "../../shared-components/InputField";

interface IDeleteAccountProps {
  email: string;
}

export class DeleteAccountComponent extends React.Component<IDeleteAccountProps> {
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
      <div className={"w3-container w3-panel w3-padding-large w3-center"}>
        <h3>Delete account</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"currentPassword"}
            label={"Current Password"}
            onChange={this.handleUserInput}
            error={this.state.currentPasswordError}
            required={true}
            type={"password"}
            placeholder={"Enter current password"}
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

          <div className="w3-panel">
            <button
              type="submit"
              disabled={!this.state.formValid}
              className="w3-btn w3-red"
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
    this.setState({[name]: value}, () => {
      this.validateField(name, value as string);
    });
  }

  private validateField(fieldName: string, value: string) {
    let deletePhraseError = this.state.deletePhraseError;
    let currentPasswordError = this.state.currentPasswordError;

    switch (fieldName) {
      case "deletePhrase":
        deletePhraseError = value !== "delete" ? "Type in 'delete' to confirm account deletion." : "";
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
    this.setState({
      currentPasswordError,
      deletePhraseError,
    }, this.validateForm);
  }

  private validateForm() {
    this.setState({
      formValid: this.state.currentPasswordError === "" &&
        this.state.deletePhraseError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.currentPasswordError !== "" || this.state.deletePhraseError !== "") {
      return;
    }

    firebase.auth().currentUser!
      .reauthenticateAndRetrieveDataWithCredential(
        EmailAuthProvider.credential(this.props.email, this.state.currentPassword),
      )
      .then(() => {
        firebase.auth().currentUser!.delete()
          .then(() => {
            alert("Your account was successfully deleted.");
          })
          .catch((error: firebase.auth.Error) => {
            let currentPasswordError = this.state.currentPasswordError;
            if (error.message === "auth/weak-password" || error.code === "auth/wrong-password") {
              currentPasswordError = error.message;
            } else {
              alert(error.message);
            }

            this.setState({
              currentPasswordError,
            });
          });
      })
      .catch((error) => {
        let currentPasswordError = this.state.currentPasswordError;
        if (error.message === "auth/weak-password" || error.code === "auth/wrong-password") {
          currentPasswordError = error.message;
        } else {
          alert(error.message);
        }

        this.setState({
          currentPasswordError,
        });
      });
  }
}

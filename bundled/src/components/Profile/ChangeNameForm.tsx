import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { showAlert } from "../../actions/alertActions";
import { newUsername } from "../../actions/userActions";
import { IAlert } from "../../entities/IAlert";
import { IUser } from "../../entities/IUser";
import { changeUserName } from "../../services/authService";
import { InputField } from "../../shared-components/Input/InputField";

interface IChangeNameProps {
  user: IUser | null;
  onNewName: (username: string) => void;
  showAlert: (alert: IAlert) => void;
}

export class ChangeNameFormComponent extends React.Component<IChangeNameProps> {
  public state = {
    name:
      this.props.user!.displayName !== null ? this.props.user!.displayName : "",
    nameError: "",
    nameValid: false,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateField = this.validateField.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    return (
      <div className="w3-padding">
        <h3 style={{ textAlign: "left" }}>Change name</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"name"}
            label={"Name"}
            onChange={this.handleUserInput}
            error={this.state.nameError}
            required={true}
            type={"text"}
            value={this.state.name}
            placeholder={"Enter Name"}
          />

          <div className="w3-margin-top">
            <button
              type="submit"
              disabled={!this.state.nameValid}
              className="w3-button w3-left w3-theme-action w3-round-large"
            >
              Change Name
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
    let nameError = this.state.nameError;
    let nameValid = this.state.nameValid;

    switch (fieldName) {
      case "name":
        if (value.length === 0) {
          nameValid = false;
          nameError = "Name is required";
        } else {
          nameValid = true;
          nameError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      nameError,
      nameValid,
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    changeUserName(this.state.name!).subscribe(
      undefined,
      (error) => {
        let nameValid = this.state.nameValid;
        let nameError = this.state.nameError;

        if (
          error.errorCode === "auth/invalid-email" ||
          error.errorCode === "auth/user-not-found"
        ) {
          nameValid = false;
          nameError = error.error;
        } else {
          const alert: IAlert = {
            color: "w3-red",
            duration: 5000,
            text: error.message,
          };
          this.props.showAlert(alert);
        }

        this.setState({
          nameError,
          nameValid,
        });
      },
      () => {
        this.props.onNewName(this.state.name);
        this.setState({
          nameError: "",
          nameValid: false,
        });
      }
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onNewName: (username: string) => dispatch(newUsername(username)),
  showAlert: (alert: IAlert) => dispatch(showAlert(alert)),
});

export const ChangeNameForm = connect(
  null,
  mapDispatchToProps
)(ChangeNameFormComponent);

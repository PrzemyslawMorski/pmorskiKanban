import * as _ from "lodash";
import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {newUsername} from "../../actions/userActions";
import {IUser} from "../../entities/IUser";
import {changeUserName} from "../../services/authService";
import {InputField} from "../../shared-components/InputField";

interface IChangeNameProps {
  user: IUser | null;
  onNewName: (username: string) => void;
}

export class ChangeNameFormComponent extends React.Component<IChangeNameProps> {
  public state = {
    name: this.props.user!.displayName !== null ? this.props.user!.displayName : "",
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
      <div className={"w3-container w3-panel w3-padding-large w3-center"}>
        <h3>Change name</h3>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"email"}
            label={"Email"}
            onChange={this.handleUserInput}
            error={this.state.nameError}
            required={true}
            disabled={true}
            type={"text"}
            value={this.state.name}
            placeholder={"Enter Name"}
          />

          <div className="w3-panel">
            <button type="submit" disabled={!this.state.nameValid} className="w3-btn w3-green">Change Name</button>
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
    changeUserName(this.state.name!).subscribe(undefined,
      (error) => {
        let nameValid = this.state.nameValid;
        let nameError = this.state.nameError;

        if (error.errorCode === "auth/invalid-email" || error.errorCode === "auth/user-not-found") {
          nameValid = false;
          nameError = error.error;
        } else {
          alert(`${error.errorCode}: ${error.error}`);
        }

        this.setState({
          nameError,
          nameValid,
        });
      }, () => {
        this.props.onNewName(this.state.name);
      });
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onNewName: (username: string) => dispatch(newUsername(username)),
  };
}

export const ChangeNameForm = connect(mapDispatchToProps)(ChangeNameFormComponent);

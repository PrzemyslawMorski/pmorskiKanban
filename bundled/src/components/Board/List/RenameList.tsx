import * as _ from "lodash";
import React from "react";
import { InputField } from "../../../shared-components/Input/InputField";

interface IRenameListModalProps {
  currentListName: string;
  onRenameComplete: (newListName: string) => void;
  onCloseClicked: () => void;
}

export class RenameListModal extends React.Component<IRenameListModalProps> {
  public state = {
    newListName: this.props.currentListName,
    newListNameError: "",
    newListNameValid: false,
  };

  constructor(props: IRenameListModalProps) {
    super(props);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    return (
      <div className="w3-margin-bottom">
        <h6 className="w3-mobile w3-margin-bottom">Rename list</h6>
        <form onSubmit={this.handleSubmit}>
          <InputField
            name={"newListName"}
            onChange={this.handleUserInput}
            error={this.state.newListNameError}
            required={true}
            type={"text"}
            value={this.state.newListName}
            placeholder={"Enter list's new name"}
          />

          <div className="w3-margin-top">
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.props.onCloseClicked}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
            >
              Rename list
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
    let newListNameError = this.state.newListNameError;

    switch (fieldName) {
      case "newListName":
        if (value.length === 0) {
          newListNameError = "New list's name is required.";
        } else if (value === this.props.currentListName) {
          newListNameError =
            "New list's name needs to be different than the current list's name";
        } else {
          newListNameError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      newListNameError,
      newListNameValid: newListNameError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.newListNameError !== "" || !this.state.newListNameValid) {
      return;
    }
    this.props.onRenameComplete(this.state.newListName);
  }
}

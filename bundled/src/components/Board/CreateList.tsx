import React from "react";
import { InputField } from "../../shared-components/Input/InputField";
import { Spinner } from "../../shared-components/Spinner/Spinner";
import * as _ from "lodash";

interface ICreateListProps {
  onCreateList: (listName: string) => void;
  creatingList: boolean;
}

export class CreateList extends React.Component<ICreateListProps> {
  public state = {
    enteringNewListName: false,
    newListName: "",
    newListNameError: "",
    newListNameValid: false,
  };

  constructor(props: ICreateListProps) {
    super(props);

    this.createList = this.createList.bind(this);
    this.cancelCreateList = this.cancelCreateList.bind(this);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.enteringNewListName) {
      return (
        <form
          className="w3-container w3-margin-top"
          onSubmit={this.handleSubmit}
        >
          <div className="w3-container" style={{ width: "300px" }}>
            <InputField
              name={"newListName"}
              onChange={this.handleUserInput}
              error={this.state.newListNameError}
              required={true}
              type={"text"}
              value={this.state.newListName}
              placeholder={"Enter the new list's name"}
            />
          </div>

          <div className="w3-panel">
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.cancelCreateList}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
              disabled={!this.state.newListNameValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const creatingListSpinner = this.props.creatingList ? (
        <div className="w3-display-right">
          <Spinner fontSize={"24px"} />
        </div>
      ) : null;

      return (
        <div className="w3-container w3-row w3-margin-top">
          <button
            className="w3-button w3-theme-action w3-round-large w3-display-container"
            style={{ width: "300px" }}
            onClick={this.createList}
          >
            Create list
            {creatingListSpinner}
          </button>
        </div>
      );
    }
  }

  private createList() {
    this.setState({ enteringNewListName: true });
  }

  private cancelCreateList() {
    this.setState({
      enteringNewListName: false,
      newListName: "",
      newListNameError: "",
      newListNameValid: false,
    });
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
        newListNameError =
          value.length === 0 ? "New list's name is required" : "";
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
    this.props.onCreateList(this.state.newListName);
    this.cancelCreateList();
  }
}

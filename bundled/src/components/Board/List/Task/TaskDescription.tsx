import * as _ from "lodash";
import React from "react";
import { TextAreaField } from "../../../../shared-components/Input/TextArea";

interface ITaskDescriptionProps {
  changeTaskDescriptionCallback: (taskDescription: string) => void;
  currentTaskDescription: string;
  editingAllowed: boolean;
}

export class TaskDescription extends React.Component<ITaskDescriptionProps> {
  public state = {
    editingTaskDescription: false,
    newTaskDescription: this.props.currentTaskDescription,
    newTaskDescriptionError: "",
    newTaskDescriptionValid: false,
  };

  constructor(props: ITaskDescriptionProps) {
    super(props);

    this.editTaskDescription = this.editTaskDescription.bind(this);
    this.cancelEditTaskDescription = this.cancelEditTaskDescription.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.editingTaskDescription && this.props.editingAllowed) {
      return (
        <form
          className="w3-row w3-margin-top"
          style={{ minHeight: "50px" }}
          onSubmit={this.handleSubmit}
        >
          <div
            className="w3-container w3-col w3-right w3-mobile w3-hide-small"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditTaskDescription}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newTaskDescriptionValid}
            >
              Save
            </button>
          </div>
          <div className="w3-rest w3-mobile">
            <TextAreaField
              name={"newTaskDescription"}
              onChange={this.handleUserInput}
              error={this.state.newTaskDescriptionError}
              required={true}
              label={"New task's description"}
              value={this.state.newTaskDescription}
              placeholder={"Enter new task's description"}
            />
          </div>

          <div
            className="w3-container w3-col w3-right w3-mobile w3-hide-medium w3-hide-large w3-margin-top"
            style={{ width: "350px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditTaskDescription}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newTaskDescriptionValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const editTaskDescriptionMediumLargeScreen = this.props.editingAllowed ? (
        <div
          className="w3-col w3-right w3-container w3-mobile w3-hide-small"
          style={{ width: "200px" }}
        >
          <button
            className="w3-button w3-theme-action w3-round-large"
            onClick={this.editTaskDescription}
          >
            Edit task description
          </button>
        </div>
      ) : null;

      const editTaskDescriptionSmallScreen = this.props.editingAllowed ? (
        <div
          className="w3-left w3-margin-top w3-hide-medium w3-hide-large"
          style={{ width: "150px" }}
        >
          <button
            className="w3-button w3-left w3-theme-action w3-round-large"
            onClick={this.editTaskDescription}
          >
            Edit
          </button>
        </div>
      ) : null;

      return (
        <div
          className="w3-margin-top"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h5 style={{ textAlign: "left" }}>Task description:</h5>

          <div className="w3-row">
            {editTaskDescriptionMediumLargeScreen}
            <div className="w3-rest">
              <span
                className={
                  "w3-left" +
                  (this.props.currentTaskDescription === ""
                    ? " w3-text-theme"
                    : "")
                }
                style={{
                  width: "100%",
                  wordBreak: "break-word",
                  textAlign: "left",
                }}
              >
                {this.props.currentTaskDescription !== ""
                  ? this.props.currentTaskDescription
                  : "Description is empty."}
              </span>
            </div>
            {editTaskDescriptionSmallScreen}
          </div>
        </div>
      );
    }
  }

  private editTaskDescription() {
    this.setState({
      editingTaskDescription: true,
      newTaskDescription: this.props.currentTaskDescription,
    });
  }

  private cancelEditTaskDescription() {
    this.setState({
      editingTaskDescription: false,
      newTaskDescription: this.props.currentTaskDescription,
      newTaskDescriptionError: "",
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
    let newTaskDescriptionError = this.state.newTaskDescriptionError;

    switch (fieldName) {
      case "newTaskDescription":
        if (value.length === 0) {
          newTaskDescriptionError = "New task description is required";
        } else if (value === this.props.currentTaskDescription) {
          newTaskDescriptionError =
            "New task description needs to be different than the current task description";
        } else {
          newTaskDescriptionError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      newTaskDescriptionError,
      newTaskDescriptionValid: newTaskDescriptionError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (
      this.state.newTaskDescriptionError !== "" ||
      !this.state.newTaskDescriptionValid
    ) {
      return;
    }
    this.props.changeTaskDescriptionCallback(this.state.newTaskDescription);
    this.setState({
      editingTaskDescription: false,
      newTaskDescriptionError: "",
    });
  }
}

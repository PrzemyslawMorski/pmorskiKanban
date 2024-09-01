import * as _ from "lodash";
import React from "react";
import { TextAreaField } from "../../../../shared-components/Input/TextArea";

interface ITaskNameProps {
  renameTaskCallback: (taskName: string) => void;
  currentTaskName: string;
  editingAllowed: boolean;
}

export class TaskName extends React.Component<ITaskNameProps> {
  public state = {
    editingTaskName: false,
    newTaskName: this.props.currentTaskName,
    newTaskNameError: "",
    newTaskNameValid: false,
  };

  constructor(props: ITaskNameProps) {
    super(props);

    this.editTaskName = this.editTaskName.bind(this);
    this.cancelEditTaskName = this.cancelEditTaskName.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public render() {
    if (this.state.editingTaskName && this.props.editingAllowed) {
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
              onClick={this.cancelEditTaskName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newTaskNameValid}
            >
              Save
            </button>
          </div>
          <div className="w3-rest w3-mobile">
            <TextAreaField
              name={"newTaskName"}
              onChange={this.handleUserInput}
              error={this.state.newTaskNameError}
              required={true}
              label={"New task's name"}
              value={this.state.newTaskName}
              placeholder={"Enter new task's name"}
            />
          </div>

          <div
            className="w3-container w3-col w3-right w3-mobile w3-hide-medium w3-hide-large w3-margin-top"
            style={{ width: "200px" }}
          >
            <button
              type="button"
              className="w3-button w3-red w3-left w3-round-large"
              onClick={this.cancelEditTaskName}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-right w3-round-large"
              disabled={!this.state.newTaskNameValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const editTaskNameMediumLargeScreen = this.props.editingAllowed ? (
        <div
          className="w3-col w3-right w3-hide-small"
          style={{ width: "150px" }}
        >
          <button
            className="w3-button w3-theme-action w3-round-large"
            onClick={this.editTaskName}
          >
            Edit task name
          </button>
        </div>
      ) : null;

      const editTaskNameSmallScreen = this.props.editingAllowed ? (
        <div
          className="w3-left w3-margin-top w3-hide-medium w3-hide-large"
          style={{ width: "150px" }}
        >
          <button
            className="w3-button w3-left w3-theme-action w3-round-large"
            onClick={this.editTaskName}
          >
            Edit
          </button>
        </div>
      ) : null;

      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5 style={{ textAlign: "left" }}>Task name:</h5>
          <div className="w3-row">
            {editTaskNameMediumLargeScreen}
            <div className="w3-rest">
              <span
                className="w3-left"
                style={{
                  width: "100%",
                  wordBreak: "break-word",
                  textAlign: "left",
                }}
              >
                {this.props.currentTaskName}
              </span>
            </div>
            {editTaskNameSmallScreen}
          </div>
        </div>
      );
    }
  }

  private editTaskName() {
    this.setState({
      editingTaskName: true,
      newTaskName: this.props.currentTaskName,
    });
  }

  private cancelEditTaskName() {
    this.setState({
      editingTaskName: false,
      newTaskName: this.props.currentTaskName,
      newTaskNameError: "",
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
    let newTaskNameError = this.state.newTaskNameError;

    switch (fieldName) {
      case "newTaskName":
        if (value.length === 0) {
          newTaskNameError = "New task name is required";
        } else if (value === this.props.currentTaskName) {
          newTaskNameError =
            "New task name needs to be different than the current task name";
        } else {
          newTaskNameError = "";
        }
        break;
      default:
        break;
    }
    this.setState({
      newTaskNameError,
      newTaskNameValid: newTaskNameError === "",
    });
  }

  private handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.throttledHandleSubmit();
  }

  private throttledHandleSubmit() {
    if (this.state.newTaskNameError !== "" || !this.state.newTaskNameValid) {
      return;
    }
    this.props.renameTaskCallback(this.state.newTaskName);
    this.setState({ editingTaskName: false, newTaskNameError: "" });
  }
}

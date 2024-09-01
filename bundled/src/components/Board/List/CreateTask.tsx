import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  startCreatingTask,
  stopCreatingTask,
} from "../../../actions/listActions";
import { InputField } from "../../../shared-components/Input/InputField";
import { Spinner } from "../../../shared-components/Spinner/Spinner";
import { IState } from "../../../store/storeStateInterface";

interface ICreateTaskProps {
  parentListId: string;
  createTaskListId: string;
  onCreateTask: (taskName: string) => void;
  startCreatingTask: (listId: string) => void;
  stopCreatingTask: () => void;
  waitingForATaskToBeAdded: boolean;
}

export class CreateTaskComponent extends React.Component<ICreateTaskProps> {
  public state = {
    enteringNewTaskName: false,
    newTaskName: "",
    newTaskNameError: "",
    newTaskNameValid: false,
  };

  constructor(props: ICreateTaskProps) {
    super(props);

    this.createTask = this.createTask.bind(this);
    this.cancelCreateTask = this.cancelCreateTask.bind(this);

    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateField = this.validateField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.throttledHandleSubmit = _.throttle(this.throttledHandleSubmit, 500);
  }

  public componentWillReceiveProps(props: ICreateTaskProps) {
    if (
      this.state.enteringNewTaskName &&
      props.parentListId !== props.createTaskListId
    ) {
      this.setState({
        enteringNewTaskName: false,
        newTaskName: "",
        newTaskNameError: "",
        newTaskNameValid: false,
      });
    }
  }

  public render() {
    if (
      this.state.enteringNewTaskName &&
      this.props.createTaskListId === this.props.parentListId
    ) {
      return (
        <form className="w3-margin-top" onSubmit={this.handleSubmit}>
          <div>
            <InputField
              name={"newTaskName"}
              onChange={this.handleUserInput}
              error={this.state.newTaskNameError}
              required={true}
              type={"text"}
              value={this.state.newTaskName}
              placeholder={"Enter the new task's name"}
            />
          </div>

          <div className="w3-margin-top">
            <button
              type="button"
              className="w3-button w3-red w3-round-large w3-margin-right"
              onClick={this.cancelCreateTask}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w3-button w3-theme-action w3-round-large"
              disabled={!this.state.newTaskNameValid}
            >
              Save
            </button>
          </div>
        </form>
      );
    } else {
      const spinner = this.props.waitingForATaskToBeAdded ? (
        <div className="w3-display-right">
          <Spinner fontSize={"24px"} />
        </div>
      ) : null;

      return (
        <div className="w3-row w3-margin-top">
          <button
            className="w3-button w3-block w3-theme-action w3-round-large w3-display-container"
            onClick={this.createTask}
          >
            Create task
            {spinner}
          </button>
        </div>
      );
    }
  }

  private createTask() {
    this.setState({
      enteringNewTaskName: true,
      newTaskName: "",
      newTaskNameError: "",
      newTaskNameValid: false,
    });
    this.props.startCreatingTask(this.props.parentListId);
  }

  private cancelCreateTask() {
    this.setState({
      enteringNewTaskName: false,
      newTaskName: "",
      newTaskNameError: "",
      newTaskNameValid: false,
    });
    this.props.stopCreatingTask();
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
      case "newComment":
        newTaskNameError =
          value.length === 0 ? "New task's name is required" : "";
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
    this.props.onCreateTask(this.state.newTaskName);
    this.cancelCreateTask();
  }
}

const mapStateToProps = (state: IState) => ({
  createTaskListId: state.createTaskListId,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  startCreatingTask: (listId: string) => dispatch(startCreatingTask(listId)),
  stopCreatingTask: () => dispatch(stopCreatingTask()),
});

export const CreateTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTaskComponent);

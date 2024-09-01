import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal } from "../../../../actions/modalActions";
import {
  changeTaskDescription,
  renameTask,
} from "../../../../actions/taskActions";
import { IBoard } from "../../../../entities/IBoard";
import { ITask } from "../../../../entities/ITask";
import { IState } from "../../../../store/storeStateInterface";
import { TaskAttachments } from "./TaskAttachments";
import { TaskComments } from "./TaskComments";
import { TaskDescription } from "./TaskDescription";
import { TaskName } from "./TaskName";

interface ITaskDetailsModalProps {
  board: IBoard | null;
  listId: string;
  taskId: string;
  editingAllowed: boolean;
  renameTask: (
    boardId: string,
    listId: string,
    taskId: string,
    oldTaskName: string,
    newTaskName: string
  ) => void;
  changeTaskDescription: (
    boardId: string,
    listId: string,
    taskId: string,
    oldTaskDescription: string,
    newTaskDescription: string
  ) => void;
  hideModal: () => void;
}

class TaskDetailsModalComponent extends React.Component<ITaskDetailsModalProps> {
  public state: { task: ITask | undefined } = {
    task: this.getTask(this.props.board),
  };

  constructor(props: ITaskDetailsModalProps) {
    super(props);
    this.getTask = this.getTask.bind(this);
    this.renameTaskCallback = this.renameTaskCallback.bind(this);
    this.changeTaskDescriptionCallback =
      this.changeTaskDescriptionCallback.bind(this);
  }

  public componentWillReceiveProps(nextProps: ITaskDetailsModalProps) {
    this.setState({ task: this.getTask(nextProps.board) });
  }

  public render() {
    return this.state.task !== undefined ? (
      <div
        className="w3-container w3-margin-bottom"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: "1 1 auto" }}>
          <TaskName
            currentTaskName={this.state.task.name}
            renameTaskCallback={this.renameTaskCallback}
            editingAllowed={this.props.editingAllowed}
          />
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <TaskDescription
            currentTaskDescription={this.state.task.description}
            changeTaskDescriptionCallback={this.changeTaskDescriptionCallback}
            editingAllowed={this.props.editingAllowed}
          />
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <TaskAttachments
            boardId={this.props.board!.id}
            listId={this.props.listId}
            task={this.state.task}
            editingAllowed={this.props.editingAllowed}
          />
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <TaskComments
            boardId={this.props.board!.id}
            listId={this.props.listId}
            task={this.state.task}
          />
        </div>
      </div>
    ) : null;
  }

  private renameTaskCallback(newTaskName: string) {
    this.props.renameTask(
      this.props.board!.id,
      this.props.listId,
      this.state.task!.id,
      this.state.task!.name,
      newTaskName
    );
  }

  private changeTaskDescriptionCallback(newTaskDescription: string) {
    this.props.changeTaskDescription(
      this.props.board!.id,
      this.props.listId,
      this.state.task!.id,
      this.state.task!.description,
      newTaskDescription
    );
  }

  private getTask(board: IBoard | null) {
    if (board !== null) {
      const nextList = board.lists.find(
        (list) => list.id === this.props.listId
      );
      if (nextList !== undefined) {
        const nextTask = nextList.tasks.find(
          (task) => task.id === this.props.taskId
        );
        if (nextTask !== undefined) {
          return nextTask;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board,
  editingAllowed: state.board !== null && state.board.owner,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeTaskDescription: (
    boardId: string,
    listId: string,
    taskId: string,
    oldTaskDescription: string,
    newTaskDescription: string
  ) =>
    dispatch(
      changeTaskDescription(
        boardId,
        listId,
        taskId,
        oldTaskDescription,
        newTaskDescription
      )
    ),
  hideModal: () => dispatch(hideModal()),
  renameTask: (
    boardId: string,
    listId: string,
    taskId: string,
    oldTaskName: string,
    newTaskName: string
  ) => dispatch(renameTask(boardId, listId, taskId, oldTaskName, newTaskName)),
});

export const TaskDetailsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskDetailsModalComponent);

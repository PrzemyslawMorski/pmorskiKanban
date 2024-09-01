import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal, showModal } from "../../../../actions/modalActions";
import { deleteTask } from "../../../../actions/taskActions";
import { IModal } from "../../../../entities/IModal";
import { ITask } from "../../../../entities/ITask";
import { ConfirmDeleteSthModal } from "../../../../shared-components/Modal/generic/ConfirmDeleteSthModal";
import { Spinner } from "../../../../shared-components/Spinner/Spinner";
import { TaskDetailsModal } from "./TaskDetails";

interface ITaskComponentProps {
  boardId: string;
  listId: string;
  task: ITask;
  editingAllowed: boolean;
  isBeingDeleted: boolean;
  deleteTask: (boardId: string, listId: string, taskId: string) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
}

class TaskComponent extends React.Component<ITaskComponentProps> {
  constructor(props: ITaskComponentProps) {
    super(props);

    this.showDetailsModal = this.showDetailsModal.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  public render() {
    const deleteOption = this.props.editingAllowed ? (
      <div className="w3-bar-item w3-button" onClick={this.deleteTask}>
        Delete
      </div>
    ) : null;
    const taskOptions = (
      <div className="w3-col l1 s1 m1 w3-dropdown-hover">
        <i className="fa fa-ellipsis-h" />
        <div className="w3-dropdown-content w3-border w3-card w3-bar-block">
          <div
            className="w3-bar-item w3-button"
            onClick={this.showDetailsModal}
          >
            Details
          </div>
          {deleteOption}
        </div>
      </div>
    );

    const spinner = this.props.isBeingDeleted ? (
      <div className="w3-display-topright">
        <Spinner fontSize={"15px"} />
      </div>
    ) : null;

    return (
      <div
        className="w3-row-padding w3-white w3-round-large w3-display-container"
        style={{ margin: "3px 0 3px 0" }}
      >
        {spinner}
        <div className="w3-col s11 l11 m11">
          <h6
            className="w3-left-align"
            style={{ width: "95%", wordWrap: "break-word" }}
          >
            {this.props.task.name}
          </h6>
        </div>

        {taskOptions}
      </div>
    );
  }

  private showDetailsModal() {
    const taskDetailsModal: IModal = {
      content: (
        <TaskDetailsModal
          listId={this.props.listId}
          taskId={this.props.task.id}
        />
      ),
      type: "MODAL_TYPE_TASK_DETAILS",
    };
    this.props.showModal(taskDetailsModal);
  }

  private deleteTask() {
    const onModalDeleteClicked = () => {
      this.props.deleteTask(
        this.props.boardId,
        this.props.listId,
        this.props.task.id
      );
      this.props.hideModal();
    };

    const onModalCloseClicked = () => {
      this.props.hideModal();
    };

    const deleteTaskModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={"Are you sure you want to delete this task?"}
          onDeleteClicked={onModalDeleteClicked}
          onCloseClicked={onModalCloseClicked}
        />
      ),
      type: "MODAL_TYPE_TASK_DELETE_CONFIRMATION",
    };

    this.props.showModal(deleteTaskModal);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteTask: (boardId: string, listId: string, taskId: string) =>
    dispatch(deleteTask(boardId, listId, taskId)),
  hideModal: () => dispatch(hideModal()),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const KanbanTask = connect(undefined, mapDispatchToProps)(TaskComponent);

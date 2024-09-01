import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal, showModal } from "../../../../actions/modalActions";
import {
  addAttachment,
  deleteAttachment,
} from "../../../../actions/taskActions";
import {
  IAddAttachmentLocalRequest,
  IRemoveAttachmentLocalRequest,
} from "../../../../dtos/requests";
import { IAttachment } from "../../../../entities/IAttachment";
import { IModal } from "../../../../entities/IModal";
import { ITask } from "../../../../entities/ITask";
import { ConfirmDeleteSthModal } from "../../../../shared-components/Modal/generic/ConfirmDeleteSthModal";
import { IState } from "../../../../store/storeStateInterface";
import { TaskDetailsModal } from "./TaskDetails";

interface ITaskAttachmentsProps {
  boardId: string;
  listId: string;
  task: ITask;
  editingAllowed: boolean;
  addAttachment: (request: IAddAttachmentLocalRequest) => void;
  removeAttachment: (request: IRemoveAttachmentLocalRequest) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
  tasksWaitingForAttachmentToBeCreated: Array<{
    boardId: string;
    listId: string;
    taskId: string;
  }>;
}

class TaskAttachmentsComponent extends React.Component<ITaskAttachmentsProps> {
  private fileInput: HTMLInputElement | null = null;

  constructor(props: ITaskAttachmentsProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
  }

  public render() {
    const ellipsis: React.CSSProperties = {
      overflow: "hidden",
      textAlign: "left",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    const attachments = this.props.task.attachments.map(
      (attachment: IAttachment) => {
        const localRemoveViewer = () => {
          this.removeAttachment(attachment);
        };

        const deleteAttachmentButton = this.props.editingAllowed ? (
          <i
            className="w3-button w3-cell fa fa-times w3-red w3-hover-red w3-round-large"
            onClick={localRemoveViewer}
            style={{ marginBottom: "5px" }}
          />
        ) : null;

        return (
          <li className="w3-row" key={attachment.id}>
            <div
              className="w3-col w3-cell-row w3-margin-left w3-right"
              style={{ width: this.props.editingAllowed ? "100px" : "50px" }}
            >
              <a
                className="w3-cell"
                href={attachment.url}
                download="Seminarium.pptx"
                target="_blank"
              >
                <i
                  className="w3-theme-action w3-button w3-round-large fa fa-download"
                  style={{ marginBottom: "5px" }}
                />
              </a>
              {deleteAttachmentButton}
            </div>
            <div className="w3-rest w3-margin-right" style={ellipsis}>
              <span>{attachment.name}</span>
            </div>
          </li>
        );
      }
    );

    const attachmentsList =
      attachments.length > 0 ? (
        <ul className="w3-ul">{attachments}</ul>
      ) : (
        <div>
          <span className="w3-left w3-text-theme" style={{ textAlign: "left" }}>
            This task has no attachments.
          </span>
        </div>
      );

    const waitingForAnAttachmentToBeAdded =
      this.props.tasksWaitingForAttachmentToBeCreated.find(
        (boardListTask) =>
          boardListTask.boardId === this.props.boardId &&
          boardListTask.listId === this.props.listId &&
          boardListTask.taskId === this.props.task.id
      ) !== undefined;

    const addAttachmentIconClass = waitingForAnAttachmentToBeAdded
      ? " fa fa-spinner w3-spin"
      : " fa fa-plus";

    return (
      <div className="w3-margin-top">
        <div className="w3-cell-row">
          <h5 className="w3-cell w3-cell-middle" style={{ textAlign: "left" }}>
            Task attachments:
          </h5>
          <div className="w3-cell w3-cell-middle w3-right w3-margin-top w3-margin-bottom">
            <input
              type="file"
              ref={(input) => (this.fileInput = input)}
              hidden={true}
              onChange={this.handleChange}
            />
            <button
              className="w3-button w3-theme-action w3-round-large w3-margin-right"
              onClick={this.clickFileInput}
            >
              <i className={addAttachmentIconClass} />
            </button>
          </div>
        </div>
        <div>{attachmentsList}</div>
      </div>
    );
  }

  private clickFileInput() {
    if (this.fileInput !== null) {
      this.fileInput!.click();
    }
  }

  private removeAttachment(attachment: IAttachment) {
    const alreadyRemoved = this.props.task.attachments.find(
      (knownAttachment) => knownAttachment.id === attachment.id
    );
    if (alreadyRemoved === undefined) {
      return;
    }

    const showTaskDetailsModal = () => {
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
    };

    const proceedWithDeleteAndShowTaskDetailsModal = () => {
      const request: IRemoveAttachmentLocalRequest = {
        attachment,
        boardId: this.props.boardId,
        listId: this.props.listId,
        taskId: this.props.task.id,
      };
      this.props.removeAttachment(request);
      showTaskDetailsModal();
    };

    const confirmRemoveViewerModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={
            "Are you sure you want to remove this attachment?"
          }
          onDeleteClicked={proceedWithDeleteAndShowTaskDetailsModal}
          onCloseClicked={showTaskDetailsModal}
        />
      ),
      type: "MODAL_TYPE_VIEWER_DELETE_CONFIRMATION",
    };
    this.props.showModal(confirmRemoveViewerModal);
  }

  private handleChange(event: any) {
    const request: IAddAttachmentLocalRequest = {
      attachment: event!.target!.files[0],
      boardId: this.props.boardId,
      listId: this.props.listId,
      taskId: this.props.task.id,
    };
    this.props.addAttachment(request);
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board === null ? "" : state.board.id,
  tasksWaitingForAttachmentToBeCreated:
    state.tasksWaitingForAttachmentToBeAdded,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addAttachment: (request: IAddAttachmentLocalRequest) =>
    dispatch(addAttachment(request)),
  hideModal: () => dispatch(hideModal()),
  removeAttachment: (request: IRemoveAttachmentLocalRequest) =>
    dispatch(deleteAttachment(request)),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const TaskAttachments = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskAttachmentsComponent);

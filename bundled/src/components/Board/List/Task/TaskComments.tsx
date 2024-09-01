import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { hideModal, showModal } from "../../../../actions/modalActions";
import {
  addComment,
  deleteComment,
  editComment,
} from "../../../../actions/taskActions";
import {
  IAddCommentRequest,
  IDeleteCommentLocalRequest,
  IEditCommentLocalRequest,
} from "../../../../dtos/requests";
import { IComment } from "../../../../entities/IComment";
import { IModal } from "../../../../entities/IModal";
import { ITask } from "../../../../entities/ITask";
import { ConfirmDeleteSthModal } from "../../../../shared-components/Modal/generic/ConfirmDeleteSthModal";
import { IState } from "../../../../store/storeStateInterface";
import { AddComment } from "./AddComment";
import { TaskComment } from "./TaskComment";
import { TaskDetailsModal } from "./TaskDetails";

interface ITaskCommentsProps {
  boardId: string;
  listId: string;
  task: ITask;
  userId: string;
  owner: boolean;
  addComment: (request: IAddCommentRequest) => void;
  editComment: (request: IEditCommentLocalRequest) => void;
  deleteComment: (request: IDeleteCommentLocalRequest) => void;
  showModal: (modal: IModal) => void;
  hideModal: () => void;
  tasksWaitingForCommentToBeAdded: Array<{
    boardId: string;
    listId: string;
    taskId: string;
  }>;
}

class TaskCommentsComponent extends React.Component<ITaskCommentsProps> {
  constructor(props: ITaskCommentsProps) {
    super(props);
    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.editComment = this.editComment.bind(this);
  }

  public render() {
    const comments = this.props.task.comments.map((comment: IComment) => {
      const localRemoveComment = () => {
        this.deleteComment(comment);
      };

      const localEditComment = (newContent: string) => {
        this.editComment(comment, newContent);
      };

      const editingAllowed =
        (comment.author === null ? "" : comment.author.uid) ===
          this.props.userId || this.props.owner;

      return (
        <TaskComment
          key={comment.id}
          editingAllowed={editingAllowed}
          authorDisplayName={
            comment.author === null ? "Unknown" : comment.author.displayName
          }
          currentComment={comment.content}
          editCommentCallback={localEditComment}
          deleteCommentCallback={localRemoveComment}
        />
      );
    });

    const attachmentsList =
      comments.length > 0 ? (
        <ul className="w3-ul">{comments}</ul>
      ) : (
        <div>
          <span
            className="w3-left w3-text-theme w3-margin-top"
            style={{ textAlign: "left" }}
          >
            This task has no comments.
          </span>
        </div>
      );

    const waitingForACommentToBeAdded =
      this.props.tasksWaitingForCommentToBeAdded.find(
        (boardListTask) =>
          boardListTask.boardId === this.props.boardId &&
          boardListTask.listId === this.props.listId &&
          boardListTask.taskId === this.props.task.id
      ) !== undefined;

    return (
      <div
        className="w3-margin-top"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="w3-left" style={{ flex: "1 1 auto" }}>
          <h5 className="w3-cell w3-cell-middle" style={{ textAlign: "left" }}>
            Task comments:
          </h5>
        </div>
        <div style={{ flex: "1 1 auto" }}>{attachmentsList}</div>
        <div style={{ flex: "1 1 auto" }}>
          <AddComment
            onAddComment={this.addComment}
            waitingForACommentToBeAdded={waitingForACommentToBeAdded}
          />
        </div>
      </div>
    );
  }

  private addComment(content: string) {
    const request: IAddCommentRequest = {
      boardId: this.props.boardId,
      content,
      listId: this.props.listId,
      taskId: this.props.task.id,
    };
    this.props.addComment(request);
  }

  private deleteComment(comment: IComment) {
    const alreadyRemoved = this.props.task.comments.find(
      (knownComments) => knownComments.id === comment.id
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
      const request: IDeleteCommentLocalRequest = {
        comment,
      };
      this.props.deleteComment(request);
      showTaskDetailsModal();
    };

    const confirmDeleteCommentModal: IModal = {
      content: (
        <ConfirmDeleteSthModal
          confirmDeleteMessage={"Are you sure you want to delete this comment?"}
          onDeleteClicked={proceedWithDeleteAndShowTaskDetailsModal}
          onCloseClicked={showTaskDetailsModal}
        />
      ),
      type: "MODAL_TYPE_VIEWER_DELETE_CONFIRMATION",
    };
    this.props.showModal(confirmDeleteCommentModal);
  }

  private editComment(comment: IComment, newContent: string) {
    const request: IEditCommentLocalRequest = {
      comment,
      newContent,
    };
    this.props.editComment(request);
  }
}

const mapStateToProps = (state: IState) => ({
  board: state.board === null ? "" : state.board.id,
  owner: state.board === null ? false : state.board.owner,
  tasksWaitingForCommentToBeAdded: state.tasksWaitingForCommentToBeAdded,
  userId: state.user === null ? "" : state.user.uid,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addComment: (request: IAddCommentRequest) => dispatch(addComment(request)),
  deleteComment: (request: IDeleteCommentLocalRequest) =>
    dispatch(deleteComment(request)),
  editComment: (request: IEditCommentLocalRequest) =>
    dispatch(editComment(request)),
  hideModal: () => dispatch(hideModal()),
  showModal: (modal: IModal) => dispatch(showModal(modal)),
});

export const TaskComments = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskCommentsComponent);

import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  ADD_COMMENT,
  ADD_COMMENT_ERROR,
  ADD_COMMENT_SUCCESS,
  RESET_BOARD,
} from "../actions/constants";
import * as taskActions from "../actions/taskActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof taskActions.addAttachment>
  | ActionType<typeof taskActions.addAttachmentSuccess>
  | ActionType<typeof taskActions.addAttachmentError>
  | ActionType<typeof boardActions.resetBoard>
  | ActionType<typeof taskActions.addComment>
  | ActionType<typeof taskActions.addCommentSuccess>
  | ActionType<typeof taskActions.addCommentError>;

function addTask(
  state: Array<{ boardId: string; listId: string; taskId: string }>,
  boardId: string,
  listId: string,
  taskId: string
) {
  const newState = state.slice();
  if (
    newState.find(
      (board) =>
        board.boardId === boardId &&
        board.listId === listId &&
        board.taskId === taskId
    ) === undefined
  ) {
    newState.push({ boardId, listId, taskId });
  }
  return newState;
}

function deleteTask(
  state: Array<{ boardId: string; listId: string; taskId: string }>,
  boardId: string,
  listId: string,
  taskId: string
) {
  const newState = state.slice();
  const taskIndex = newState.findIndex(
    (board) =>
      board.boardId === boardId &&
      board.listId === listId &&
      board.taskId === taskId
  );
  if (taskIndex !== -1) {
    newState.splice(taskIndex, 1);
  }
  return newState;
}

export const tasksWaitingForCommentToBeAddedReducer: Reducer<
  Array<{ boardId: string; listId: string; taskId: string }>,
  actions
> = (state = initialStoreState.tasksWaitingForAttachmentToBeAdded, action) => {
  switch (action.type) {
    case ADD_COMMENT:
      return addTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId
      );

    case ADD_COMMENT_SUCCESS:
      return deleteTask(
        state,
        action.payload.comment.boardId,
        action.payload.comment.listId,
        action.payload.comment.taskId
      );

    case ADD_COMMENT_ERROR:
      return deleteTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId
      );

    case RESET_BOARD:
      return [];
    default:
      return state;
  }
};

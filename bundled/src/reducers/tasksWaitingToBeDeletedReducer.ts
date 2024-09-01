import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  DELETE_TASK,
  DELETED_TASK,
  DELETED_TASK_ERROR,
  RESET_BOARD,
} from "../actions/constants";
import * as taskActions from "../actions/taskActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof taskActions.deleteTask>
  | ActionType<typeof taskActions.deletedTask>
  | ActionType<typeof taskActions.deletedTaskError>
  | ActionType<typeof boardActions.resetBoard>;

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

export const tasksWaitingToBeDeletedReducer: Reducer<
  Array<{ boardId: string; listId: string; taskId: string }>,
  actions
> = (state = initialStoreState.tasksWaitingToBeDeleted, action) => {
  switch (action.type) {
    case DELETE_TASK:
      return addTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId
      );

    case DELETED_TASK:
      return deleteTask(
        state,
        action.payload.boardId,
        action.payload.listId,
        action.payload.taskId
      );

    case DELETED_TASK_ERROR:
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

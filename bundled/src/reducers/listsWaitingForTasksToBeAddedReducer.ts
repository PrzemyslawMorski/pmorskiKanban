import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  CREATE_TASK,
  CREATED_TASK,
  CREATED_TASK_ERROR,
  RESET_BOARD,
} from "../actions/constants";
import * as taskActions from "../actions/taskActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof taskActions.createTask>
  | ActionType<typeof taskActions.createdTask>
  | ActionType<typeof taskActions.createdTaskError>
  | ActionType<typeof boardActions.resetBoard>;

function addList(
  state: Array<{ boardId: string; listId: string }>,
  boardId: string,
  listId: string
) {
  const newState = state.slice();
  if (
    newState.find(
      (board) => board.boardId === boardId && board.listId === listId
    ) === undefined
  ) {
    newState.push({ boardId, listId });
  }
  return newState;
}

function deleteList(
  state: Array<{ boardId: string; listId: string }>,
  boardId: string,
  listId: string
) {
  const newState = state.slice();
  const listIndex = newState.findIndex(
    (board) => board.boardId === boardId && board.listId === listId
  );
  if (listIndex !== -1) {
    newState.splice(listIndex, 1);
  }
  return newState;
}

export const listsWaitingForTasksToBeAddedReducer: Reducer<
  Array<{ boardId: string; listId: string }>,
  actions
> = (state = initialStoreState.listsWaitingForTasksToBeAdded, action) => {
  switch (action.type) {
    case CREATE_TASK:
      return addList(state, action.payload.boardId, action.payload.listId);

    case CREATED_TASK:
      return deleteList(state, action.payload.boardId, action.payload.listId);

    case CREATED_TASK_ERROR:
      return deleteList(state, action.payload.boardId, action.payload.listId);

    case RESET_BOARD:
      return [];

    default:
      return state;
  }
};

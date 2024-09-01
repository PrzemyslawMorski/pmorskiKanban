import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  DELETE_LIST,
  DELETED_LIST,
  DELETED_LIST_ERROR,
  RESET_BOARD,
} from "../actions/constants";
import * as listActions from "../actions/listActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof listActions.deleteList>
  | ActionType<typeof listActions.deletedList>
  | ActionType<typeof listActions.deletedListError>
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

export const listsWaitingToBeDeletedReducer: Reducer<
  Array<{ boardId: string; listId: string }>,
  actions
> = (state = initialStoreState.listsWaitingForTasksToBeAdded, action) => {
  switch (action.type) {
    case DELETE_LIST:
      return addList(state, action.payload.boardId, action.payload.listId);

    case DELETED_LIST:
      return deleteList(state, action.payload.boardId, action.payload.listId);

    case DELETED_LIST_ERROR:
      return deleteList(state, action.payload.boardId, action.payload.listId);

    case RESET_BOARD:
      return [];

    default:
      return state;
  }
};

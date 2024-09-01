import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as boardActions from "../actions/boardActions";
import {
  CREATE_LIST,
  CREATED_LIST,
  CREATED_LIST_ERROR,
  RESET_BOARD,
} from "../actions/constants";
import * as listActions from "../actions/listActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof listActions.createList>
  | ActionType<typeof listActions.createdList>
  | ActionType<typeof listActions.createdListError>
  | ActionType<typeof boardActions.resetBoard>;

export const isListBeingAddedReducer: Reducer<boolean, actions> = (
  state = initialStoreState.isListBeingAdded,
  action
) => {
  switch (action.type) {
    case CREATE_LIST:
      return true;

    case CREATED_LIST:
      return false;

    case CREATED_LIST_ERROR:
      return false;

    case RESET_BOARD:
      return false;

    default:
      return state;
  }
};

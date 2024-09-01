import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { START_CREATING_TASK, STOP_CREATING_TASK } from "../actions/constants";
import * as listActions from "../actions/listActions";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof listActions.startCreatingTask>
  | ActionType<typeof listActions.stopCreatingTask>;

export const createTaskListIdReducer: Reducer<string, actions> = (
  state = initialStoreState.createTaskListId,
  action
) => {
  switch (action.type) {
    case START_CREATING_TASK:
      return action.payload.listId;
    case STOP_CREATING_TASK:
      return initialStoreState.createTaskListId;
    default:
      return state;
  }
};

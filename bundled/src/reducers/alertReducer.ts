import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import * as alertActions from "../actions/alertActions";
import { HIDE_ALERT, SHOW_ALERT } from "../actions/constants";
import { IAlert } from "../entities/IAlert";
import { initialStoreState } from "../store/initialStoreState";

type actions =
  | ActionType<typeof alertActions.showAlert>
  | ActionType<typeof alertActions.hideAlert>;

export const alertReducer: Reducer<IAlert | null, actions> = (
  state = initialStoreState.alert,
  action
) => {
  switch (action.type) {
    case SHOW_ALERT:
      return action.payload;
    case HIDE_ALERT:
      return initialStoreState.alert;
    default:
      return state;
  }
};

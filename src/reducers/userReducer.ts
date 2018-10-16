import * as actions from "../actions/userActions";

import {Reducer} from "redux";
import {ActionType} from "typesafe-actions";
import {USER_LOGGED_IN} from "../actions/constants";
import {IUser} from "../entities/User";
import {initialStoreState} from "../store/initialStoreState";

type userAction = ActionType<typeof actions>;

export const userReducer: Reducer<IUser, userAction> = (
  state: IUser = initialStoreState.user,
  action: userAction,
) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.payload;
    default:
      return state;
  }
};

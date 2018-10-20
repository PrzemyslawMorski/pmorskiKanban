import * as actions from "../actions/userActions";

import {Reducer} from "redux";
import {ActionType} from "typesafe-actions";
import {USER_LOGGED_IN, USER_LOGGED_OUT} from "../actions/constants";
import {IUser} from "../entities/User";
import {initialStoreState} from "../store/initialStoreState";

type userAction = ActionType<typeof actions>;

export const userReducer: Reducer<IUser | null, userAction> = (
  state: IUser | null = initialStoreState.user,
  action: userAction,
) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return action.payload;
    case USER_LOGGED_OUT:
      return null;
    default:
      return state;
  }
};

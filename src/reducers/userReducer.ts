import * as firebase from "firebase";
import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { USER_SIGNED_IN, USER_SIGNED_OUT } from "../actions/constants";
import * as actions from "../actions/userActions";
import { initialStoreState } from "../store/initialStoreState";

type userActions = ActionType<typeof actions>;

export const userReducer: Reducer<firebase.User | null, userActions> = (
  state: firebase.User | null = initialStoreState.user,
  action: userActions,
) => {
  switch (action.type) {
    case USER_SIGNED_IN:
      return action.payload;
    case USER_SIGNED_OUT:
      return null;
    default:
      return state;
  }
};

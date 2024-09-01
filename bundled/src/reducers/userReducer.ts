import { Reducer } from "redux";
import { ActionType } from "typesafe-actions";
import { UPDATE_USER, UPDATE_USER_NAME } from "../actions/constants";
import * as actions from "../actions/userActions";
import { IUser } from "../entities/IUser";
import { initialStoreState } from "../store/initialStoreState";

type userActions = ActionType<typeof actions>;

export const userReducer: Reducer<IUser | null, userActions> = (
  state: IUser | null = initialStoreState.user,
  action: userActions
) => {
  switch (action.type) {
    case UPDATE_USER:
      return action.payload.user;
    case UPDATE_USER_NAME:
      return {
        displayName: action.payload.username,
        email: state!.email,
        photoURL: state!.photoURL,
        uid: state!.uid,
      };
    default:
      return state;
  }
};
